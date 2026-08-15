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
              <VIcon icon="mdi-office-building-outline" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">
                Departamentos
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Consulte e mantenha os departamentos disponíveis no sistema.
              </div>
            </div>
          </div>

          <VBtn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreate"
          >
            Novo departamento
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VTextField
            v-model="search"
            label="Pesquisar departamento"
            prepend-inner-icon="mdi-magnify"
            placeholder="Nome ou descrição"
            clearable
            hide-details
          />
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="filteredDepartments"
          :loading="loading"
          loading-text="Carregando departamentos..."
          no-data-text="Nenhum departamento encontrado."
          class="text-no-wrap"
        >
          <template #[`item.id`]="{ item }">
            <strong class="text-primary">#{{ item.id }}</strong>
          </template>

          <template #[`item.description`]="{ item }">
            <span class="text-wrap">{{ item.description || '-' }}</span>
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
                  @click="openEdit(item)"
                >
                  <template #prepend>
                    <VIcon icon="mdi-pencil-outline" />
                  </template>
                  <VListItemTitle>Editar</VListItemTitle>
                </VListItem>

                <VListItem
                  link
                  @click="openDelete(item)"
                >
                  <template #prepend>
                    <VIcon
                      icon="mdi-delete-outline"
                      color="error"
                    />
                  </template>
                  <VListItemTitle class="text-error">
                    Excluir
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </template>
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <VDialog
    v-model="formDialog"
    max-width="650"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-6">
        <span>{{ editing ? 'Editar departamento' : 'Novo departamento' }}</span>
        <VBtn
          icon="mdi-close"
          variant="text"
          :disabled="saving"
          @click="closeForm"
        />
      </VCardTitle>

      <VDivider />

      <VCardText class="pa-6">
        <VForm
          ref="formRef"
          @submit.prevent="submit"
        >
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="model.name"
                label="Nome"
                :rules="requiredRules"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="model.description"
                label="Descrição"
                rows="3"
                auto-grow
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-6 justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          :disabled="saving"
          @click="closeForm"
        >
          Cancelar
        </VBtn>
        <VBtn
          color="primary"
          prepend-icon="mdi-content-save"
          :loading="saving"
          @click="submit"
        >
          Salvar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog
    v-model="deleteDialog"
    max-width="480"
    persistent
  >
    <VCard>
      <VCardTitle class="pa-6">
        Excluir departamento
      </VCardTitle>
      <VCardText>
        Deseja excluir <strong>{{ selectedDepartment?.name }}</strong>? Essa ação não poderá ser desfeita.
      </VCardText>
      <VCardActions class="pa-6 justify-end">
        <VBtn
          variant="outlined"
          color="secondary"
          :disabled="deleting"
          @click="deleteDialog = false"
        >
          Cancelar
        </VBtn>
        <VBtn
          color="error"
          :loading="deleting"
          @click="removeDepartment"
        >
          Excluir
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { departmentsApi } from '@/api/departments-api';
import { computed, onMounted, ref } from 'vue';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import { toast } from 'vue3-toastify';

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const search = ref('')
const departments = ref([])
const formDialog = ref(false)
const deleteDialog = ref(false)
const selectedDepartment = ref(null)
const formRef = ref()

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Descrição', key: 'description', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false },
]

const requiredRules = [value => Boolean(String(value ?? '').trim()) || 'Campo obrigatório']

const emptyModel = () => ({
  id: 0,
  name: '',
  description: '',
})

const model = ref(emptyModel())
const editing = computed(() => model.value.id > 0)

const getData = response => response?.data?.data ?? response?.data ?? []
const extractList = data => Array.isArray(data) ? data : data?.items ?? data?.data ?? data?.$values ?? []

const filteredDepartments = computed(() => {
  const term = search.value?.trim().toLocaleLowerCase('pt-BR')

  if (!term)
    return departments.value

  return departments.value.filter(item => [item.name, item.description]
    .some(value => String(value ?? '').toLocaleLowerCase('pt-BR').includes(term)))
})

const loadDepartments = async () => {
  loading.value = true

  try {
    departments.value = extractList(getData(await departmentsApi.getAll()))
  } catch (error) {
    console.error('Erro ao carregar departamentos:', error)
    toast.error('Não foi possível carregar os departamentos.')
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  model.value = emptyModel()
  formDialog.value = true
}

const openEdit = item => {
  model.value = {
    id: Number(item.id),
    name: item.name ?? '',
    description: item.description ?? '',
  }
  formDialog.value = true
}

const closeForm = () => {
  if (saving.value)
    return

  formDialog.value = false
  formRef.value?.resetValidation()
}

const submit = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid) {
    toast.warning('Preencha os campos obrigatórios.')

    return
  }

  saving.value = true

  try {
    const payload = {
      name: model.value.name.trim(),
      description: model.value.description?.trim() || '',
    }

    if (editing.value)
      await departmentsApi.update({ id: Number(model.value.id), ...payload })
    else
      await departmentsApi.create(payload)

    toast.success(editing.value ? 'Departamento atualizado com sucesso.' : 'Departamento cadastrado com sucesso.')
    formDialog.value = false
    await loadDepartments()
  } catch (error) {
    console.error('Erro ao salvar departamento:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? 'Não foi possível salvar o departamento.')
  } finally {
    saving.value = false
  }
}

const openDelete = item => {
  selectedDepartment.value = item
  deleteDialog.value = true
}

const removeDepartment = async () => {
  if (!selectedDepartment.value?.id)
    return

  deleting.value = true

  try {
    await departmentsApi.remove(selectedDepartment.value.id)
    toast.success('Departamento excluído com sucesso.')
    deleteDialog.value = false
    selectedDepartment.value = null
    await loadDepartments()
  } catch (error) {
    console.error('Erro ao excluir departamento:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? 'Não foi possível excluir o departamento.')
  } finally {
    deleting.value = false
  }
}

onMounted(loadDepartments)
</script>
