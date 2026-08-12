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
              <VIcon icon="mdi-medical-bag" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">
                Condições clínicas
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Consulte e mantenha as condições clínicas disponíveis no sistema.
              </div>
            </div>
          </div>

          <VBtn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreate"
          >
            Nova condição clínica
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VTextField
            v-model="search"
            label="Pesquisar condição clínica"
            prepend-inner-icon="mdi-magnify"
            placeholder="Nome, tipo ou descrição"
            clearable
            hide-details
          />
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="filteredClinicalConditions"
          :loading="loading"
          loading-text="Carregando condições clínicas..."
          no-data-text="Nenhuma condição clínica encontrada."
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
        <span>{{ editing ? 'Editar condição clínica' : 'Nova condição clínica' }}</span>
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
                v-model="model.type"
                label="Tipo"
                placeholder="Ex.: Clínica, Psiquiátrica"
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
        Excluir condição clínica
      </VCardTitle>
      <VCardText>
        Deseja excluir <strong>{{ selectedClinicalCondition?.name }}</strong>? Essa ação não poderá ser desfeita.
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
          @click="removeClinicalCondition"
        >
          Excluir
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { clinicalConditionsApi } from '@/api/clinical-conditions-api';
import { computed, onMounted, ref } from 'vue';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
import { toast } from 'vue3-toastify';

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const search = ref('')
const clinicalConditions = ref([])
const formDialog = ref(false)
const deleteDialog = ref(false)
const selectedClinicalCondition = ref(null)
const formRef = ref()

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Tipo', key: 'type', sortable: true },
  { title: 'Descrição', key: 'description', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false },
]

const requiredRules = [value => Boolean(String(value ?? '').trim()) || 'Campo obrigatório']

const emptyModel = () => ({
  id: 0,
  name: '',
  description: '',
  type: '',
})

const model = ref(emptyModel())
const editing = computed(() => model.value.id > 0)

const getData = response => response?.data?.data ?? response?.data ?? []
const extractList = data => Array.isArray(data) ? data : data?.items ?? data?.data ?? data?.$values ?? []

const filteredClinicalConditions = computed(() => {
  const term = search.value?.trim().toLocaleLowerCase('pt-BR')

  if (!term)
    return clinicalConditions.value

  return clinicalConditions.value.filter(item => [item.name, item.type, item.description]
    .some(value => String(value ?? '').toLocaleLowerCase('pt-BR').includes(term)))
})

const loadClinicalConditions = async () => {
  loading.value = true

  try {
    clinicalConditions.value = extractList(getData(await clinicalConditionsApi.getAll()))
  } catch (error) {
    console.error('Erro ao carregar condições clínicas:', error)
    toast.error('Não foi possível carregar as condições clínicas.')
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
    type: item.type ?? '',
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
    if (editing.value) {
      const payload = {
        id: Number(model.value.id),
        name: model.value.name.trim(),
        description: model.value.description?.trim() || '',
        type: model.value.type.trim(),
      }

      await clinicalConditionsApi.update(payload)
    } else {
      const payload = {
        name: model.value.name.trim(),
        description: model.value.description?.trim() || '',
        type: model.value.type.trim(),
      }

      await clinicalConditionsApi.create(payload)
    }

    toast.success(editing.value ? 'Condição clínica atualizada com sucesso.' : 'Condição clínica cadastrada com sucesso.')
    formDialog.value = false
    await loadClinicalConditions()
  } catch (error) {
    console.error('Erro ao salvar condição clínica:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? 'Não foi possível salvar a condição clínica.')
  } finally {
    saving.value = false
  }
}

const openDelete = item => {
  selectedClinicalCondition.value = item
  deleteDialog.value = true
}

const removeClinicalCondition = async () => {
  if (!selectedClinicalCondition.value?.id)
    return

  deleting.value = true

  try {
    await clinicalConditionsApi.remove(selectedClinicalCondition.value.id)
    toast.success('Condição clínica excluída com sucesso.')
    deleteDialog.value = false
    selectedClinicalCondition.value = null
    await loadClinicalConditions()
  } catch (error) {
    console.error('Erro ao excluir condição clínica:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? 'Não foi possível excluir a condição clínica.')
  } finally {
    deleting.value = false
  }
}

onMounted(loadClinicalConditions)
</script>
