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
              md="3"
            >
              <VTextField
                v-model="filtermodel.patientName"
                label="Paciente"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="3"
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
              md="2"
            >
              <VAutocomplete
                v-model="filtermodel.status"
                label="Status"
                :items="statusOptions"
                clearable
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="2"
            >
              <VTextField
                v-model="filtermodel.startDate"
                label="Data inicial"
                type="date"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="2"
            >
              <VTextField
                v-model="filtermodel.endDate"
                label="Data final"
                type="date"
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
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Funcionário', key: 'employeeName', sortable: true },
  { title: 'Observações', key: 'observations', sortable: false },
]

const statusOptions = ['Administrado', 'Não administrado', 'Atrasado', 'Cancelado']

const loading = ref(false)
const items = ref([])
const listMedicine = ref([])
const filtermodel = ref({})
const paginationData = ref({ page: 1, totalPages: 1, perPage: 15, count: 0 })

const getData = response => response?.data?.data ?? response?.data

const getList = value => {
  if (Array.isArray(value))
    return value

  if (value?.$values)
    return value.$values

  return value ? [value] : []
}

const formatDateTime = value => {
  if (!value)
    return '-'

  return new Date(value).toLocaleString('pt-BR')
}

const loadMedicines = async () => {
  try {
    listMedicine.value = getList(getData(await medicinesApi.getAll()))
  } catch (error) {
    console.error('Erro ao carregar medicamentos:', error)
  }
}

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

const search = async () => {
  paginationData.value.page = 1
  await loadItems()
}

const changePage = async page => {
  if (page < 1 || page > paginationData.value.totalPages)
    return

  paginationData.value.page = page
  await loadItems()
}

onMounted(() => {
  loadItems()
  loadMedicines()
})
</script>
