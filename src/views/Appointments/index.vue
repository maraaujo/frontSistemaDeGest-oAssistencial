<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
          <div class="d-flex align-center gap-3">
            <VAvatar color="primary" variant="tonal">
              <VIcon icon="mdi-calendar-clock-outline" />
            </VAvatar>
            <div>
              <div class="text-h5 font-weight-bold">Agendamentos</div>
              <div class="text-body-2 text-medium-emphasis">Organize os compromissos assistenciais dos acolhidos.</div>
            </div>
          </div>
          <VBtn color="primary" prepend-icon="mdi-plus" @click="router.push({ name: 'appointments-new' })">
            Novo agendamento
          </VBtn>
        </VCardTitle>

        <VDivider />
        <VCardText class="pa-6">
          <VForm @submit.prevent="search">
            <VRow>
              <VCol cols="12" md="3">
                <VAutocomplete v-model="filters.patientId" label="Paciente" :items="patients" item-title="name"
                  item-value="id" clearable hide-details />
              </VCol>
              <VCol cols="12" md="3">
                <VAutocomplete v-model="filters.employeeId" label="Funcionário" :items="employees" item-title="name"
                  item-value="id" clearable hide-details />
              </VCol>
              <VCol cols="12" md="2">
                <VSelect v-model="filters.status" label="Status" :items="statusOptions" clearable hide-details />
              </VCol>
              <VCol cols="12" md="2">
                <VTextField v-model="filters.startDate" label="Data inicial" type="date" hide-details />
              </VCol>
              <VCol cols="12" md="2">
                <VTextField v-model="filters.endDate" label="Data final" type="date" hide-details />
              </VCol>
              <VCol cols="12" class="d-flex justify-end gap-3">
                <VBtn color="secondary" variant="outlined" prepend-icon="mdi-filter-remove" @click="clearFilters">Limpar
                </VBtn>
                <VBtn color="primary" prepend-icon="mdi-magnify" :loading="loading" type="submit">Pesquisar</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />
        <VDataTable :headers="headers" :items="appointments" :loading="loading"
          loading-text="Carregando agendamentos..." no-data-text="Nenhum agendamento encontrado." class="text-no-wrap">
          <template #[`item.id`]="{ item }"><strong class="text-primary">#{{ item.id }}</strong></template>
          <template #[`item.dateTime`]="{ item }">{{ formatDateTime(item.dateTime) }}</template>
          <template #[`item.status`]="{ item }">
            <VChip :color="getStatusColor(item.status)" variant="tonal" size="small">{{ item.status || '-' }}</VChip>
          </template>
          <template #[`item.observations`]="{ item }"><span class="text-wrap">{{ item.observations || '-'
              }}</span></template>
          <template #[`item.actions`]="{ item }">
            <VMenu>
              <template #activator="{ props }">
                <VBtn color="primary" size="small" icon="mdi-cog" v-bind="props" />
              </template>
              <VList>
                <VListItem prepend-icon="mdi-pencil-outline" title="Editar" @click="editItem(item)" />
                <VListItem v-if="item.status !== 'Cancelado'" prepend-icon="mdi-calendar-remove-outline"
                  title="Cancelar" @click="cancelItem(item)" />
                <VListItem prepend-icon="mdi-delete-outline" title="Excluir" class="text-error"
                  @click="confirmRemove(item)" />
              </VList>
            </VMenu>
          </template>
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <VDialog v-model="deleteDialog" max-width="460" persistent>
    <VCard>
      <VCardTitle class="pa-6">Excluir agendamento</VCardTitle>
      <VCardText>Deseja excluir o agendamento <strong>#{{ selectedItem?.id }}</strong>?</VCardText>
      <VCardActions class="pa-6 justify-end">
        <VBtn variant="outlined" :disabled="deleting" @click="deleteDialog = false">Cancelar</VBtn>
        <VBtn color="error" :loading="deleting" @click="removeItem">Excluir</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { appointmentsApi } from '@/api/appointments-api';
import { employeesApi } from '@/api/employees-api';
import { patientsApi } from '@/api/patients-api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter()
const loading = ref(false)
const deleting = ref(false)
const appointments = ref([])
const patients = ref([])
const employees = ref([])
const deleteDialog = ref(false)
const selectedItem = ref(null)
const statusOptions = ['Pendente', 'Confirmado', 'Realizado', 'Cancelado']
const emptyFilters = () => ({ patientId: null, employeeId: null, status: null, startDate: '', endDate: '' })
const filters = ref(emptyFilters())

const headers = [
  { title: 'Id', key: 'id' },
  { title: 'Paciente', key: 'patientName' },
  { title: 'Funcionário', key: 'employeeName' },
  { title: 'Observações', key: 'observations', sortable: false },
  { title: 'Data/Hora', key: 'dateTime' },
  { title: 'Status', key: 'status' },

  { title: 'Ações', key: 'actions', sortable: false },
]

const dataOf = response => response?.data?.data ?? response?.data ?? []
const listOf = (data, keys = []) => {
  if (Array.isArray(data)) return data
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key]
  return data?.items ?? data?.$values ?? []
}
const normalize = item => ({ ...item, patientName: item.patientName ?? item.namePatient ?? '', employeeName: item.responsible ?? item.employeeName ?? item.responsibleEmployeeName ?? '', dateTime: item.dateTime ?? item.appointmentDate ?? item.date ?? item.scheduledDateTime })

const loadOptions = async () => {
  const [patientResult, employeeResult] = await Promise.allSettled([patientsApi.getAll(), employeesApi.getAll()])
  if (patientResult.status === 'fulfilled') patients.value = listOf(dataOf(patientResult.value), ['patients'])
  if (employeeResult.status === 'fulfilled') employees.value = listOf(dataOf(employeeResult.value), ['employees'])
}
const loadAppointments = async () => {
  loading.value = true
  try {
    const data = dataOf(await appointmentsApi.filter({ ...filters.value }))
    appointments.value = listOf(data, ['appointments', 'appointment']).map(normalize)
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error)
    appointments.value = []
    toast.error('Não foi possível carregar os agendamentos.')
  } finally { loading.value = false }
}
const search = () => loadAppointments()
const clearFilters = () => { filters.value = emptyFilters(); loadAppointments() }
const editItem = item => router.push({ name: 'appointments-update', params: { id: item.id } })
const cancelItem = async item => {
  try { await appointmentsApi.update(item.id, { ...item, status: 'Cancelado' }); toast.success('Agendamento cancelado.'); await loadAppointments() }
  catch (error) { console.error(error); toast.error('Não foi possível cancelar o agendamento.') }
}
const confirmRemove = item => { selectedItem.value = item; deleteDialog.value = true }
const removeItem = async () => {
  deleting.value = true
  try { await appointmentsApi.remove(selectedItem.value.id); toast.success('Agendamento excluído.'); deleteDialog.value = false; await loadAppointments() }
  catch (error) { console.error(error); toast.error('Não foi possível excluir o agendamento.') }
  finally { deleting.value = false }
}
const formatDateTime = value => value ? new Date(value).toLocaleString('pt-BR') : '-'
const getStatusColor = status => ({ Pendente: 'warning', Confirmado: 'info', Realizado: 'success', Cancelado: 'error' }[status] ?? 'secondary')
onMounted(() => { loadOptions(); loadAppointments() })
</script>
