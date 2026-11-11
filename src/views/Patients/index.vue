<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center gap-3">
            <VAvatar
              color="primary"
              variant="tonal"
            >
              <VIcon icon="mdi-account-heart" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">
                Acolhidos
              </div>

              <div class="text-body-2 text-medium-emphasis">
                Consulte e acompanhe os acolhidos cadastrados no sistema.
              </div>
            </div>
          </div>

          <VBtn
            color="primary"
            prepend-icon="mdi-plus"
            @click="router.push({ name: 'patients-new' })"
          >
            Novo acolhido
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VForm @submit.prevent="submit">
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VAutocomplete
                  v-model="filterModel.patientId"
                  label="Nome"
                  :items="patientOptions"
                  item-title="name"
                  item-value="id"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VTextField
                  v-model="filterModel.cpf"
                  label="CPF"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="filterModel.clinicalCondition"
                  label="Condição Clinica"
                  :items="conditions"
                  item-title="name"
                  item-value="id"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="filterModel.gender"
                  label="Sexo"
                  :items="genderOptions"
                  clearable
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-end gap-3">
                  <VBtn
                    color="primary"
                    prepend-icon="mdi-magnify"
                    :loading="loading"
                    @click="submit"
                  >
                    Pesquisar
                  </VBtn>

                  <VBtn
                    color="secondary"
                    variant="outlined"
                    prepend-icon="mdi-filter-remove"
                    :disabled="loading"
                    @click="cleanFilters"
                  >
                    Limpar filtros
                  </VBtn>
                </div>

                <div class="mt-3 text-body-2 text-medium-emphasis">
                  Total de registros encontrados: {{ paginationData.count }}
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="patients"
          :loading="loading"
          loading-text="Carregando... Aguarde"
          class="text-no-wrap"
          hide-default-footer
        >
          <template #[`item.id`]="{ item }">
            <RouterLink :to="{ name: 'patient-details', params: { id: item.id } }">
              <strong class="text-primary">#{{ item.id }}</strong>
            </RouterLink>
          </template>

          <template #[`item.name`]="{ item }">
            <div>
              <h6 class="text-sm font-weight-bold mb-0">
                {{ item.name }}
              </h6>

              <span class="text-caption text-medium-emphasis">
                {{ item.cpf ? formatCpf(item.cpf) : 'CPF não informado' }}
              </span>
            </div>
          </template>

          <template #[`item.birthDate`]="{ item }">
            {{ formatDate(item.birthDate) }}
          </template>

          <template #[`item.phone`]="{ item }">
            {{ item.phone ? formatPhone(item.phone) : '-' }}
          </template>

          <template #[`item.gender`]="{ item }">
            <VChip
              size="small"
              variant="tonal"
              color="primary"
            >
              {{ item.gender || 'Não informado' }}
            </VChip>
          </template>

          <template #[`item.actions`]="{ item }">
            <VMenu>
              <template #activator="{ props }">
                <VBtn
                  color="primary"
                  size="small"
                  v-bind="props"
                >
                  <VIcon icon="mdi-cog" />
                </VBtn>
              </template>

              <VList>
                <VListItem
                  link
                  @click="openDetails(item)"
                >
                  <VListItemTitle>Detalhes</VListItemTitle>
              </VListItem>

                <VListItem
                  link
                  @click="openMedicines(item)"
                >
                  <VListItemTitle>Medicamentos</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </template>
        </VDataTable>

        <VCardText>
          <VPagination
            v-model="paginationData.page"
            color="secondary"
            active-color="primary"
            :length="paginationData.totalPages"
            :total-visible="10"
            @update:model-value="getPatients"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { clinicalConditionsApi } from '@/api/clinical-conditions-api';
import { patientsApi } from '@/api/patients-api';
import { formatCpf, formatPhone } from '@/utils/validators';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import { toast } from 'vue3-toastify';

const router = useRouter()
const conditions = ref([])
const loading = ref(false)
const patients = ref([])
const patientOptions = ref([])

const filterModel = ref({
  page: 1,
  patientId: null,
  cpf: '',
  phone: '',
  gender: '',
  clinicalCondition: '',
})

const paginationData = ref({
  page: 1,
  totalPages: 1,
  itensPerPage: 20,
  count: 0,
})

const genderOptions = [
  'Feminino',
  'Masculino',
  'Outro',
]

const headers = [
  { title: 'Id', key: 'id', sortable: true },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Telefone', key: 'phone', sortable: true },
  { title: 'Data de nascimento', key: 'birthDate', sortable: true },
  { title: 'Sexo', key: 'gender', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false },
]

/**
 * Extrai o conteúdo útil da resposta da API (`data.data`, senão `data`).
 */
const getResponseData = response => response?.data?.data ?? response?.data

/**
 * Busca todas as condições clínicas (`clinicalConditionsApi.getAll`) para o
 * filtro de condição da listagem. Em erro, mostra toast e retorna [].
 */
const getAllConditions = async () => {
  try {
    const ret = await clinicalConditionsApi.getAll()
    const data = getResponseData(ret)

    conditions.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erro ao buscar condições clínicas:', error)
    toast.error('Não foi possível buscar as condições clínicas.')

    return []
  }
}

/**
 * Busca todos os acolhidos (`patientsApi.getAll`) para preencher as opções do
 * filtro por acolhido. Em erro, apenas registra no console (sem aviso na tela).
 */
const getAllPatients = async () => {
  try {
    const ret = await patientsApi.getAll()
    const data = getResponseData(ret)

    patientOptions.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erro ao buscar acolhidos:', error)
  }
}

/**
 * Busca a página atual de acolhidos com os filtros preenchidos (`patientsApi.filter`),
 * convertendo a condição clínica para texto. Atualiza a tabela e os dados de
 * paginação (página, total, total de páginas e itens por página).
 */
const getPatients = async () => {
  loading.value = true

  try {
    filterModel.value.page = paginationData.value.page

    const filter = {
      ...filterModel.value,
      clinicalCondition: filterModel.value.clinicalCondition == null
        ? ''
        : String(filterModel.value.clinicalCondition),
    }

    const ret = await patientsApi.filter(filter)
    const data = getResponseData(ret)

    patients.value =
      data?.patients
      ?? data?.itens
      ?? data?.items
      ?? data?.data
      ?? []

    paginationData.value.page = data?.page ?? 1
    paginationData.value.count = data?.count ?? patients.value.length
    paginationData.value.totalPages = data?.totalPages ?? 1
    paginationData.value.itensPerPage = data?.itensPerPage ?? 20
  } catch (error) {
    console.error('Erro ao buscar acolhidos:', error)
    toast.error('Não foi possível buscar os acolhidos.')
  } finally {
    loading.value = false
  }
}

/**
 * Aplica os filtros: volta para a página 1 e refaz a busca de acolhidos.
 */
const submit = async () => {
  paginationData.value.page = 1
  await getPatients()
}

/**
 * Limpa todos os filtros, volta para a página 1 e recarrega a listagem.
 */
const cleanFilters = async () => {
  filterModel.value = {
    page: 1,
    patientId: null,
    cpf: '',
    phone: '',
    gender: '',
    clinicalCondition: '',
  }

  paginationData.value.page = 1

  await getPatients()
}

/**
 * Navega para a tela de detalhes do acolhido selecionado.
 */
const openDetails = item => {
  router.push({
    name: 'patient-details',
    params: { id: item.id },
  })
}

/**
 * Navega para a tela de edição do acolhido selecionado.
 */
const openEdit = item => {
  router.push({
    name: 'patient-update',
    params: { id: item.id },
  })
}

/**
 * Navega para a tela de medicamentos programados, passando o id do acolhido na query (`patientId`).
 */
const openMedicines = item => {
  router.push({
    name: 'patient-medicines',
    query: { patientId: item.id },
  })
}

/**
 * Formata uma data no padrão brasileiro (dd/mm/aaaa); retorna "-" se vazia.
 */
const formatDate = value => {
  if (!value)
    return '-'

  const date = new Date(value)

  return date.toLocaleDateString('pt-BR')
}

// Ao abrir a tela, carrega a listagem de acolhidos e as opções dos filtros (condições e acolhidos).
onMounted(() => {
  getPatients(),
  getAllConditions(),
  getAllPatients()
})
</script>
