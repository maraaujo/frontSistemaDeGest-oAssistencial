<template>
  <VRow><VCol cols="12"><VCard>
    <VCardTitle class="d-flex align-center gap-3 pa-6"><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-calendar-edit" /></VAvatar><div><div class="text-h5 font-weight-bold">Editar agendamento</div><div class="text-body-2 text-medium-emphasis">Atualize as informações do agendamento.</div></div></VCardTitle>
    <VDivider /><VCardText class="pa-6"><VProgressLinear v-if="loading" indeterminate class="mb-6" /><VForm v-else ref="formRef" @submit.prevent="submit"><div class="text-h6 mb-6">Dados do agendamento</div><VRow>
      <VCol cols="12" md="6"><VAutocomplete v-model="model.patientId" label="Paciente" :items="patients" item-title="name" item-value="id" :rules="requiredRules" /></VCol>
      <VCol cols="12" md="6"><VAutocomplete v-model="model.responsible" label="Funcionário responsável" :items="employees" item-title="name" item-value="name" :rules="requiredRules" /></VCol>
      <VCol cols="12" md="6"><VTextField v-model="model.dateTime" label="Data e hora do agendamento" type="datetime-local" :rules="requiredRules" /></VCol>
      <VCol cols="12" md="6"><VTextField v-model="model.appointmentType" label="Tipo de agendamento" :rules="requiredRules" /></VCol>
      <VCol cols="12" md="6"><VSelect v-model="model.status" label="Status" :items="statusOptions" :rules="requiredRules" /></VCol>
  
      <VCol cols="12"><VTextarea v-model="model.observations" label="Observações" rows="3" auto-grow /></VCol>
    </VRow><VDivider class="my-6" /><div class="d-flex justify-end gap-3"><VBtn color="secondary" variant="outlined" :disabled="saving" @click="router.push({ name: 'appointments' })">Cancelar</VBtn><VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving" type="submit">Salvar alterações</VBtn></div></VForm></VCardText>
  </VCard></VCol></VRow>
</template>

<script setup>
import { appointmentsApi } from '@/api/appointments-api';
import { employeesApi } from '@/api/employees-api';
import { patientsApi } from '@/api/patients-api';
import auth from '@/auth';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const route = useRoute(); const router = useRouter(); const formRef = ref(); const loading = ref(true); const saving = ref(false)
const patients = ref([]); const employees = ref([]); const statusOptions = ['Pendente', 'Confirmado', 'Realizado', 'Cancelado']
const requiredRules = [value => !!value || 'Este campo é obrigatório']
const model = ref({ id: null, patientId: null, responsible: null, appointmentType: '', dateTime: '', description: '', status: 'Pendente', observations: '' })
const getData = response => response?.data?.data ?? response?.data
const getList = (data, key) => Array.isArray(data) ? data : data?.[key] ?? data?.items ?? data?.$values ?? []
const toInputDateTime = value => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''

const load = async () => {
  try {
    const [patientResponse, employeeResponse, appointmentResponse] = await Promise.all([patientsApi.getAll(), employeesApi.getAll(), appointmentsApi.getById(route.params.id)])
    patients.value = getList(getData(patientResponse), 'patients'); employees.value = getList(getData(employeeResponse), 'employees')
    const item = getData(appointmentResponse)
    model.value = { ...model.value, ...item, id: item.id ?? Number(route.params.id), patientId: item.patientId ?? item.idPatient, responsible: item.responsible ?? item.employeeName ?? item.responsibleEmployeeName, dateTime: toInputDateTime(item.dateTime ?? item.appointmentDate ?? item.date) }
  } catch (error) {
    console.error('Erro ao carregar agendamento:', error); toast.error('Não foi possível carregar o agendamento.'); router.push({ name: 'appointments' })
  } finally { loading.value = false }
}

const submit = async () => {
  const { valid } = await formRef.value.validate(); if (!valid) return
  const userId = auth.getUserStorage()?.userId
  if (!userId) { toast.error('Não foi possível identificar o usuário autenticado.'); return }
  saving.value = true
  try {
    await appointmentsApi.update(route.params.id, { ...model.value, userId, dateTime: new Date(model.value.dateTime).toISOString(), appointmentType: model.value.appointmentType.trim(), description: model.value.description.trim(), observations: model.value.observations.trim() })
    toast.success('Agendamento atualizado com sucesso!'); router.push({ name: 'appointments' })
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error); toast.error(error.response?.data?.message ?? 'Não foi possível atualizar o agendamento.')
  } finally { saving.value = false }
}

onMounted(load)
</script>
