<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VAvatar
            color="primary"
            variant="tonal"
          >
            <VIcon icon="mdi-history" />
          </VAvatar>

          <div>
            <div class="text-h5 font-weight-bold">
              Histórico de medicação
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Consulte os registros de administração de medicamentos.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VRow>
            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VAutocomplete
                v-model="filtermodel.patientId"
                label="Paciente"
                :items="listPatient"
                item-title="name"
                item-value="id"
                clearable
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VAutocomplete
                v-model="filtermodel.medicineId"
                label="Medicamento"
                :items="listMedicine"
                item-title="name"
                item-value="id"
                clearable
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VAutocomplete
                v-model="filtermodel.status"
                label="Status"
                :items="statusOptions"
                clearable
              />
            </VCol>

            <VCol cols="12">
              <VBtn
                color="secondary"
                prepend-icon="mdi-magnify"
                @click="search"
              >
                Procurar
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="items"
          :loading="loading"
          loading-text="Carregando... Aguarde"
          no-data-text="Nenhum registro de administração encontrado."
          class="text-no-wrap"
          hide-default-footer
        >
          <template #[`item.id`]="{ item }">
            <strong class="text-primary">#{{ item.id }}</strong>
          </template>

          <template #[`item.scheduledDateTime`]="{ item }">
            {{ formatDateTime(item.scheduledDateTime) }}
          </template>

          <template #[`item.administeredDateTime`]="{ item }">
            {{ formatDateTime(item.administeredDateTime) }}
          </template>

          <template #[`item.nextDoseDateTime`]="{ item }">
            <VChip
              v-if="item.nextDoseDateTime || item.administrationTime"
              color="primary"
              variant="tonal"
              size="small"
            >
              <VIcon
                start
                icon="mdi-clock-outline"
              />
              {{ formatNextDose(item) }}
            </VChip>
            <span v-else>-</span>
          </template>

          <template #[`item.observations`]="{ item }">
            <span class="text-wrap">{{ item.observations || '-' }}</span>
          </template>
        </VDataTable>

        <VPagination
          v-model="paginationData.page"
          color="secondary"
          :total-visible="10"
          active-color="primary"
          :length="paginationData.totalPages"
          :disabled="loading"
          @update:model-value="changePage"
        />
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { medicationAdministrationsApi } from '@/api/medication-administrations-api'
import { medicinesApi } from '@/api/medicines-api'
import { patientsApi } from '@/api/patients-api'
import { onMounted, ref } from 'vue'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { toast } from 'vue3-toastify'

const headers = [
  { title: 'Id', key: 'id', sortable: true },
  { title: 'Paciente', key: 'patientName', sortable: true },
  { title: 'Medicamento', key: 'medicineName', sortable: true },
  { title: 'Dosagem', key: 'prescribedDosage', sortable: true },
  { title: 'Horário previsto', key: 'scheduledDateTime', sortable: true },
  { title: 'Horário administrado', key: 'administeredDateTime', sortable: true },
  { title: 'Próxima medicação', key: 'nextDoseDateTime', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Funcionário', key: 'employeeName', sortable: true },
  { title: 'Observações', key: 'observations', sortable: false },
]

const statusOptions = ['Administrado', 'Não administrado', 'Atrasado', 'Cancelado']

const loading = ref(false)
const items = ref([])
const listMedicine = ref([])
const listPatient = ref([])
const filtermodel = ref({})
const paginationData = ref({ page: 1, totalPages: 1, perPage: 15, count: 0 })

/**
 * Extrai o conteúdo útil da resposta da API (`data.data`, senão `data`).
 */
const getData = response => response?.data?.data ?? response?.data

/**
 * Normaliza o valor para array: aceita array puro, o formato `$values` do .NET
 * ou um objeto único (vira array de um item); vazio vira [].
 */
const getList = value => {
  if (Array.isArray(value))
    return value

  if (value?.$values)
    return value.$values

  return value ? [value] : []
}

/**
 * Formata data e hora no padrão brasileiro (dd/mm/aaaa hh:mm:ss); retorna "-" se vazia.
 */
const formatDateTime = value => {
  if (!value)
    return '-'

  return new Date(value).toLocaleString('pt-BR')
}

// Proxima medicacao: vem do backend com fuso (-03:00). Se nao vier, usa o
// horario planejado (administrationTime, "HH:mm:ss").
const formatNextDose = item => {
  const date = new Date(item.nextDoseDateTime)

  if (!Number.isNaN(date.getTime()))
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return typeof item.administrationTime === 'string' ? item.administrationTime.slice(0, 5) : '-'
}

/**
 * Busca todos os medicamentos (`medicinesApi.getAll`) para o filtro por medicamento.
 * Em erro, apenas registra no console.
 */
const loadMedicines = async () => {
  try {
    listMedicine.value = getList(getData(await medicinesApi.getAll()))
  } catch (error) {
    console.error('Erro ao carregar medicamentos:', error)
  }
}

/**
 * Busca todos os acolhidos (`patientsApi.getAll`) para o filtro por acolhido.
 * Em erro, apenas registra no console.
 */
const loadPatients = async () => {
  try {
    listPatient.value = getList(getData(await patientsApi.getAll()))
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error)
  }
}

/**
 * Busca a página atual do histórico de administrações com os filtros
 * (`medicationAdministrationsApi.filter`). Aceita vários formatos de resposta para
 * achar a lista (garantindo `patientName`) e os dados de paginação. Em erro, limpa e mostra toast.
 */
const loadItems = async () => {
  loading.value = true

  try {
  
    const payload = {
      ...filtermodel.value,
      page: paginationData.value.page,
      perPage: paginationData.value.perPage,
      itensPerPage: paginationData.value.perPage,
    }

    const ret = await medicationAdministrationsApi.filter(payload)
    const responseData = ret?.data
    const nestedData = responseData?.data

    const receivedItems = Array.isArray(responseData)
      ? responseData
      : responseData?.medicationAdministration
        ?? nestedData?.medicationAdministration
        ?? responseData?.medicationAdministrations
        ?? nestedData?.medicationAdministrations
        ?? responseData?.$values
        ?? nestedData
        ?? []

    const list = getList(receivedItems).map(item => ({
      ...item,
      patientName: item.patientName ?? item.namePatient ?? '',
    }))

    items.value = list

    const pagination = responseData?.pagination
      ?? responseData?.paginationData
      ?? (Array.isArray(nestedData) ? responseData : nestedData)
      ?? responseData
      ?? {}

    const perPage = Number(
      pagination.itensPerPage
      ?? pagination.itemsPerPage
      ?? pagination.perPage
      ?? paginationData.value.perPage,
    )

    const totalCount = Number(
      pagination.count
      ?? pagination.totalCount
      ?? pagination.totalItems
      ?? list.length,
    )

    const totalPages = Number(
      pagination.totalPages
      ?? pagination.pageCount
      ?? Math.ceil(totalCount / perPage),
    )

    paginationData.value.perPage = perPage
    paginationData.value.count = totalCount
    paginationData.value.totalPages = Math.max(1, totalPages || 1)
  } catch (error) {
    console.error('Erro ao carregar histórico de medicação:', error)
    items.value = []
    toast.error('Não foi possível carregar o histórico de medicação.')
  } finally {
    loading.value = false
  }
}

/**
 * Aplica os filtros: volta para a página 1 e recarrega o histórico.
 */
const search = async () => {
  paginationData.value.page = 1
  await loadItems()
}

/**
 * Vai para a página informada e recarrega o histórico; ignora páginas fora do intervalo.
 * @param {number} page Número da nova página.
 */
const changePage = async page => {
  if (page < 1 || page > paginationData.value.totalPages)
    return

  paginationData.value.page = page
  await loadItems()
}

// Ao abrir a tela, carrega o histórico e as opções dos filtros (medicamentos e acolhidos).
onMounted(() => {
  loadItems()
  loadMedicines()
  loadPatients()
})
</script>
