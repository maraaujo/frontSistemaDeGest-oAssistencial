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
              <VIcon icon="mdi-pill" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">
                Medicamentos
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Consulte e mantenha os medicamentos disponíveis no sistema.
              </div>
            </div>
          </div>

          <VBtn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreate"
          >
            Novo medicamento
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VTextField
            v-model="search"
            label="Pesquisar medicamento"
            prepend-inner-icon="mdi-magnify"
            placeholder="Nome, dosagem ou via de administração"
            clearable
            hide-details
          />
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="filteredMedicines"
          :loading="loading"
          loading-text="Carregando medicamentos..."
          no-data-text="Nenhum medicamento encontrado."
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
        <span>{{ editing ? 'Editar medicamento' : 'Novo medicamento' }}</span>
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
            <VCol
              cols="12"
              md="8"
            >
              <VTextField
                v-model="model.name"
                label="Nome"
                :rules="requiredRules"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="model.dosage"
                label="Dosagem"
                placeholder="Ex.: 50 mg"
                :rules="requiredRules"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="model.administrationRoute"
                label="Via de administração"
                :items="administrationRoutes"
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
        Excluir medicamento
      </VCardTitle>
      <VCardText>
        Deseja excluir <strong>{{ selectedMedicine?.name }}</strong>? Essa ação não poderá ser desfeita.
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
          @click="removeMedicine"
        >
          Excluir
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { medicinesApi } from '@/api/medicines-api';
import { computed, onMounted, ref } from 'vue';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const search = ref('')
const medicines = ref([])
const formDialog = ref(false)
const deleteDialog = ref(false)
const selectedMedicine = ref(null)
const formRef = ref()

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Dosagem', key: 'dosage', sortable: true },
  { title: 'Via de administração', key: 'administrationRoute', sortable: true },
  { title: 'Descrição', key: 'description', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false },
]

const administrationRoutes = ['Oral', 'Sublingual', 'Intravenosa', 'Intramuscular', 'Subcutânea', 'Tópica', 'Inalatória', 'Retal']
const requiredRules = [value => Boolean(String(value ?? '').trim()) || 'Campo obrigatório']

const emptyModel = () => ({
  id: 0,
  name: '',
  dosage: '',
  description: '',
  administrationRoute: '',
})

const model = ref(emptyModel())
const editing = computed(() => model.value.id > 0)

const getData = response => response?.data?.data ?? response?.data ?? []
const extractList = data => Array.isArray(data) ? data : data?.items ?? data?.data ?? data?.$values ?? []

const filteredMedicines = computed(() => {
  const term = search.value?.trim().toLocaleLowerCase('pt-BR')

  if (!term)
    return medicines.value

  return medicines.value.filter(item => [item.name, item.dosage, item.administrationRoute, item.description]
    .some(value => String(value ?? '').toLocaleLowerCase('pt-BR').includes(term)))
})

const loadMedicines = async () => {
  loading.value = true

  try {
    medicines.value = extractList(getData(await medicinesApi.getAll()))
  } catch (error) {
    console.error('Erro ao carregar medicamentos:', error)
    toast.error('Não foi possível carregar os medicamentos.')
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
    dosage: item.dosage ?? '',
    description: item.description ?? '',
    administrationRoute: item.administrationRoute ?? '',
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
      id: Number(model.value.id),
      name: model.value.name.trim(),
      dosage: model.value.dosage.trim(),
      description: model.value.description?.trim() || '',
      administrationRoute: model.value.administrationRoute,
    }

    if (editing.value)
      await medicinesApi.update(model.value.id, payload)
    else
      await medicinesApi.create(payload)

    toast.success(editing.value ? 'Medicamento atualizado com sucesso.' : 'Medicamento cadastrado com sucesso.')
    formDialog.value = false
    await loadMedicines()
  } catch (error) {
    console.error('Erro ao salvar medicamento:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? 'Não foi possível salvar o medicamento.')
  } finally {
    saving.value = false
  }
}

const openDelete = item => {
  selectedMedicine.value = item
  deleteDialog.value = true
}

const removeMedicine = async () => {
  if (!selectedMedicine.value?.id)
    return

  deleting.value = true

  try {
    await medicinesApi.remove(selectedMedicine.value.id)
    toast.success('Medicamento excluído com sucesso.')
    deleteDialog.value = false
    selectedMedicine.value = null
    await loadMedicines()
  } catch (error) {
    console.error('Erro ao excluir medicamento:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? 'Não foi possível excluir o medicamento.')
  } finally {
    deleting.value = false
  }
}

onMounted(loadMedicines)
</script>
