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
              <VIcon icon="mdi-account-tie" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">
                Funcionários
              </div>

              <div class="text-body-2 text-medium-emphasis">
                Consulte e acompanhe os funcionários cadastrados no sistema.
              </div>
            </div>
          </div>

          <VBtn
            color="primary"
            prepend-icon="mdi-plus"
            @click="router.push({ name: 'employees-new' })"
          >
            Novo funcionário
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VForm @submit.prevent="submit">
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="filterModel.name"
                  label="Nome"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="filterModel.cpf"
                  label="CPF"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="filterModel.phone"
                  label="Telefone"
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
          :items="employees"
          :loading="loading"
          loading-text="Carregando... Aguarde"
          class="text-no-wrap"
          hide-default-footer
        >
          <template #[`item.id`]="{ item }">
            <RouterLink :to="{ name: 'employees-details', params: { id: item.id } }">
              <strong class="text-primary">#{{ item.id }}</strong>
            </RouterLink>
          </template>

          <template #[`item.name`]="{ item }">
            <div>
              <h6 class="text-sm font-weight-bold mb-0">
                {{ item.name }}
              </h6>

              <span class="text-caption text-medium-emphasis">
                {{ item.cpf || 'CPF não informado' }}
              </span>
            </div>
          </template>

          <template #[`item.phone`]="{ item }">
            {{ item.phone || '-' }}
          </template>

          <template #[`item.position`]="{ item }">
            <VChip
              size="small"
              variant="tonal"
              color="primary"
            >
              {{ item.position || 'Não informado' }}
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
                  @click="openEdit(item)"
                >
                  <VListItemTitle>Editar</VListItemTitle>
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
            @update:model-value="getEmployees"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { employeesApi } from '@/api/employees-api';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import { toast } from 'vue3-toastify';

const router = useRouter()
const loading = ref(false)
const employees = ref([])

const filterModel = ref({
  page: 1,
  name: '',
  cpf: '',
  phone: '',
})

const paginationData = ref({
  page: 1,
  totalPages: 1,
  itensPerPage: 20,
  count: 0,
})

const headers = [
  { title: 'Id', key: 'id', sortable: true },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Telefone', key: 'phone', sortable: true },
  { title: 'Cargo', key: 'position', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false },
]

const getResponseData = response => response?.data?.data ?? response?.data

const getEmployees = async () => {
  loading.value = true

  try {
    filterModel.value.page = paginationData.value.page

    const ret = await employeesApi.filter(filterModel.value)
    const data = getResponseData(ret)

    employees.value =
      data?.employees
      ?? data?.itens
      ?? data?.items
      ?? data?.data
      ?? []

    paginationData.value.page = data?.page ?? 1
    paginationData.value.count = data?.count ?? employees.value.length
    paginationData.value.totalPages = data?.totalPages ?? 1
    paginationData.value.itensPerPage = data?.itensPerPage ?? 20
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error)
    toast.error('Não foi possível buscar os funcionários.')
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  paginationData.value.page = 1
  await getEmployees()
}

const cleanFilters = async () => {
  filterModel.value = {
    page: 1,
    name: '',
    cpf: '',
    phone: '',
  }

  paginationData.value.page = 1

  await getEmployees()
}

const openDetails = item => {
  router.push({
    name: 'employees-details',
    params: { id: item.id },
  })
}

const openEdit = item => {
  router.push({
    name: 'employees-update',
    params: { id: item.id },
  })
}

onMounted(() => {
  getEmployees()
})
</script>
