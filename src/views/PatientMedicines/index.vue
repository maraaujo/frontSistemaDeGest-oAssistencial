<template>
  <VRow>
    <VCol cols="12">
      <VStepper v-model="currentStep">
        <VStepperItem
          :value="1"
          title="Administração de medicamentos"
          color="primary"
          icon="mdi-pill"
          :complete="currentStep > 1"
        />
        <VForm @submit.prevent="submit">
          <VStepperWindow
            v-model="currentStep"
            :touch="false"
          >
            <VStepperWindowItem :value="1">
              <VRow>
                <VCol
                  cols="12"
                  sm="4"
                >
                  <VTextField
                    v-model="filtermodel.patientName"
                    label="Nome do Paciente"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="4"
                >
                  <VAutocomplete
                    v-model="filtermodel.medicineId"
                    label="Medicamento"
                    item-title="name"
                    item-value="id"
                    :items="listMedicine"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="4"
                >
                  <VAutocomplete
                    v-model="filtermodel.responsibleEmployeeId"
                    chips
                    clearable
                    multiple
                    small-chips
                    label="Responsável"
                    :items="listResponsibleEmployee"
                    item-title="name"
                    item-value="id"
                  />
                </VCol>

                <VCol cols="12">
                  <div class="d-flex flex-wrap gap-4 justify-space-between">
                    <VBtn
                      color="primary"
                      @click="router.push({ name: 'patient-medicines-create' })"
                    >
                      Nova ministração programada
                    </VBtn>
                    <VBtn
                      color="secondary"
                      @click="submit"
                    >
                      Procurar
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12">
                  <VDataTable
                    title="Administração de medicamentos"
                    :headers="headers"
                    :items="listmedicinePatientClinicalConditions"
                    :loading="loadingmedicinePatientClinicalConditions"
                    loading-text="Carregando... Aguarde"
                    class="text-no-wrap rounded-t-0"
                    hide-default-footer
                  >
                    <template #[`item.id`]="{ item }">
                      <VBtn
                        type="button"
                        variant="text"
                        color="primary"
                        class="font-weight-bold px-0"
                        @click.stop="goToEdit(item)"
                      >
                        #{{ item.id }}
                      </VBtn>
                    </template>
                    <template #[`item.patientName`]="{ item }">
                      <div>
                        <h6 class="text-sm font-weight-bold">
                          {{ item.patientName || 'Acolhido não informado' }}
                        </h6>

                        <span class="text-caption text-medium-emphasis">
                          ID: {{ item.patientId || '-' }}
                        </span>
                      </div>
                    </template>
                    <template #[`item.medicineName`]="{ item }">
                      <div>
                        <h6 class="text-sm font-weight-bold">
                          {{ item.medicineName || 'Medicamento não informado' }}
                        </h6>

                        <span class="text-caption text-medium-emphasis">
                          {{ item.prescribedDosage || '' }}
                        </span>
                      </div>
                    </template>

                    <template #[`item.actions`]="{ item }">
                      <div class="d-flex align-center justify-center gap-2">
                        <VTooltip text="Registrar administração">
                          <template #activator="{ props }">
                            <VBtn
                              type="button"
                              color="success"
                              size="small"
                              v-bind="props"
                              @click="openAdministrationDialog(item)"
                            >
                              <VIcon
                                dark
                                small
                              >
                                mdi-clipboard-check-outline
                              </VIcon>
                            </VBtn>
                          </template>
                        </VTooltip>

                        <VMenu>
                          <template #activator="{ props }">
                            <VBtn
                              type="button"
                              color="primary"
                              size="small"
                              v-bind="props"
                            >
                              <VIcon
                                dark
                                small
                              >
                                mdi-cog
                              </VIcon>
                            </VBtn>
                          </template>
                          <VList>
                            <VListItem
                              link
                              @click.stop="goToEdit(item)"
                            >
                              <VListItemTitle>Detalhes</VListItemTitle>
                            </VListItem>
                            <VListItem
                              link
                              @click="() => confirmDeleteOffer(item.id)"
                            >
                              <VListItemTitle class="text-red">
                                Apagar
                              </VListItemTitle>
                            </VListItem>
                          </VList>
                        </VMenu>
                      </div>
                    </template>
                  </VDataTable>

                  <VPagination
                    v-model="paginationData.page"
                    :size="size"
                    color="secondary"
                    :total-visible="10"
                    active-color="primary"
                    :length="paginationData.totalPages"
                    :disabled="loadingmedicinePatientClinicalConditions"
                    @update:model-value="changePage"
                  />

                  <VDialog
                    v-model="showDeleteDialog"
                    persistent
                    max-width="500"
                  >
                    <VCard>
                      <VCardTitle>Confirmar exclusão</VCardTitle>
                      <VCardText>Tem certeza que deseja apagar esta ministração programada?</VCardText>
                      <VCardActions>
                        <VSpacer />
                        <VBtn
                          text
                          @click="() => (showDeleteDialog = false, offerToDelete = null)"
                        >
                          Cancelar
                        </VBtn>
                        <VBtn
                          color="red"
                          @click="deleteOffer"
                        >
                          Apagar
                        </VBtn>
                      </VCardActions>
                    </VCard>
                  </VDialog>

                  <VDialog
                    v-model="administrationDialog"
                    max-width="600"
                    persistent
                  >
                    <VCard>
                      <VCardTitle class="d-flex align-center justify-space-between pa-6">
                        <span>Registrar administração de medicamento</span>
                        <VBtn
                          icon="mdi-close"
                          variant="text"
                          :disabled="savingAdministration"
                          @click="closeAdministrationDialog"
                        />
                      </VCardTitle>

                      <VDivider />

                      <VCardText class="pa-6">
                        <VRow>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              label="Paciente"
                              :model-value="selectedItem?.patientName"
                              readonly
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              label="Medicamento"
                              :model-value="selectedItem?.medicineName"
                              readonly
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              label="Condição clínica"
                              :model-value="selectedItem?.clinicalConditionName"
                              readonly
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              label="Dosagem"
                              :model-value="selectedItem?.prescribedDosage"
                              readonly
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              label="Frequência"
                              :model-value="selectedItem?.frequency"
                              readonly
                            />
                          </VCol>
                          <VCol
                            cols="12"
                            md="6"
                          >
                            <VTextField
                              label="Horário previsto"
                              :model-value="formatTime(selectedItem?.administrationTime)"
                              readonly
                            />
                          </VCol>
                          <VCol cols="12">
                            <VTextField
                              label="Responsável"
                              :model-value="selectedItem?.responsibleEmployeeName"
                              readonly
                            />
                          </VCol>
                        </VRow>

                        <VDivider class="my-4" />

                        <VForm ref="administrationFormRef">
                          <VRow>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <VAutocomplete
                                v-model="administrationForm.status"
                                label="Status"
                                :items="statusOptions"
                                :rules="requiredRules"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              md="6"
                            >
                              <VTextField
                                v-model="administrationForm.administeredDateTime"
                                label="Data/hora administrada"
                                type="datetime-local"
                                :rules="requiredRules"
                              />
                            </VCol>
                            <VCol cols="12">
                              <VTextarea
                                v-model="administrationForm.observations"
                                label="Observações"
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
                          :disabled="savingAdministration"
                          @click="closeAdministrationDialog"
                        >
                          Cancelar
                        </VBtn>
                        <VBtn
                          color="primary"
                          prepend-icon="mdi-content-save"
                          :loading="savingAdministration"
                          @click="saveAdministration"
                        >
                          Salvar administração
                        </VBtn>
                      </VCardActions>
                    </VCard>
                  </VDialog>
                </VCol>
              </VRow>
            </VStepperWindowItem>
          </VStepperWindow>
        </VForm>
      </VStepper>
    </VCol>
  </VRow>
</template>

<script setup>
import { employeesApi } from "@/api/employees-api"
import { medicationAdministrationsApi } from "@/api/medication-administrations-api"
import { medicinePatientClinicalConditionsApi } from "@/api/medicine-patient-clinical-conditions-api"
import { medicinesApi } from "@/api/medicines-api"
import 'cleave.js/dist/addons/cleave-phone.br'
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { toast } from 'vue3-toastify'
import { VForm } from 'vuetify/components/VForm'

const headers = [
  { title: "Id", key: "id", sortable: true },
  { title: "Nome do Paciente", key: "patientName", sortable: true },
  { title: "Remédio", key: "medicineName", sortable: true },
  { title: "Condição", key: "clinicalConditionName", sortable: true },
  { title: "Dosagem", key: "prescribedDosage", sortable: true },
  { title: "Frequência", key: "frequency", sortable: true },
  { title: "Horário", key: "administrationTime", sortable: true },
  { title: "Responsável", key: "responsibleEmployeeName", sortable: true },
  { title: "Ações", key: "actions", sortable: false, align: "center" },
]

const currentStep = ref(1)
const listmedicinePatientClinicalConditions = ref([])
const size = ref('default')
const filtermodel = ref({})
const loadingmedicinePatientClinicalConditions = ref(false)
const paginationData = ref({ page: 1, totalPages: 1, itensPerPage: 10, count: 0, perPage: 15 })
const periodicity = ref()
const router = useRouter()
const listResponsibleEmployee = ref([])
const listMedicine = ref([])

const requiredRules = [value => value !== null && value !== undefined && value !== '' || 'Campo obrigatório']
const statusOptions = ['Administrado', 'Não administrado', 'Atrasado', 'Cancelado']

const administrationDialog = ref(false)
const administrationFormRef = ref()
const savingAdministration = ref(false)
const selectedItem = ref(null)

const administrationForm = ref({
  status: 'Administrado',
  administeredDateTime: '',
  observations: '',
})

const toDateTimeLocal = date => {
  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const formatDate = value => {
  if (!value)
    return '-'

  return new Date(value).toLocaleDateString('pt-BR')
}

const formatTime = value => {
  if (!value)
    return '-'

  if (typeof value === 'string')
    return value.slice(0, 5)

  return value
}

const goToEdit = async itemOrId => {
  const item = itemOrId?.raw ?? itemOrId
  const id = typeof item === 'object' ? item?.id : item

  if (id === null || id === undefined || id === '') {
    toast.error('Não foi possível identificar o registro para edição.')
    
    return
  }

  await router.push({
    name: 'patient-medicines-edit',
    params: { id: String(id) },
  })
}


// Estado e fluxo de confirmação para exclusão
const showDeleteDialog = ref(false)
const offerToDelete = ref(null)

const confirmDeleteOffer = id => {
  offerToDelete.value = id
  showDeleteDialog.value = true
}

const deleteOffer = async id => {
  const deleteId = id ?? offerToDelete.value

  console.log("Deletando oferta com id:", deleteId)
  try {
    await medicinePatientClinicalConditionsApi.remove(deleteId)
    await getMedicinePatientClinicalCondicions()
    toast.success("Oferta removida com sucesso.")
    showDeleteDialog.value = false
    offerToDelete.value = null
  } catch (error) {
    console.error("Erro ao apagar a oferta:", error)
    toast.error("Não foi possível remover a oferta. Tente novamente mais tarde.")
  }

}


// Métodos assíncronos
const submit = async () => {
  paginationData.value.page = 1
  await getMedicinePatientClinicalCondicions()
}

const changePage = async page => {
  paginationData.value.page = Number(page)
  await getMedicinePatientClinicalCondicions()
}

const getMedicines = async () => {
  const ret = await medicinesApi.getAll()

  listMedicine.value = ret.data.data ?? ret.data
}

const getListEmployees = async () => {
  const ret = await employeesApi.getAll()

  listResponsibleEmployee.value = ret.data.data ?? ret.data
}

const getMedicinePatientClinicalCondicions = async () => {
  loadingmedicinePatientClinicalConditions.value = true
  filtermodel.value.page = paginationData.value.page
  filtermodel.value.perPage = paginationData.value.perPage
  filtermodel.value.itensPerPage = paginationData.value.perPage

  try {
    const ret = await medicinePatientClinicalConditionsApi.filter(filtermodel.value)
    const responseData = ret?.data
    const nestedData = responseData?.data

    const receivedItems = Array.isArray(responseData)
      ? responseData
      : responseData?.medicinePatientClinicalConditions
        ?? nestedData?.medicinePatientClinicalConditions
        ?? responseData?.$values
        ?? nestedData
        ?? []

    const items = Array.isArray(receivedItems)
      ? receivedItems
      : receivedItems?.$values ?? []

    listmedicinePatientClinicalConditions.value = items

    const pagination = responseData?.pagination
      ?? responseData?.paginationData
      ?? (Array.isArray(nestedData) ? responseData : nestedData)
      ?? responseData
      ?? {}

    const itemsPerPage = Number(
      pagination.itensPerPage
      ?? pagination.itemsPerPage
      ?? pagination.perPage
      ?? paginationData.value.perPage,
    )

    const totalCount = Number(
      pagination.count
      ?? pagination.totalCount
      ?? pagination.totalItems
      ?? items.length,
    )

    const totalPages = Number(
      pagination.totalPages
      ?? pagination.pageCount
      ?? Math.ceil(totalCount / itemsPerPage),
    )

    paginationData.value.itensPerPage = itemsPerPage
    paginationData.value.count = totalCount
    paginationData.value.totalPages = Math.max(1, totalPages)

    if (!Array.isArray(items))
      console.error("A API não retornou uma lista de ministrações.", responseData)
  } catch (error) {
    console.error("Não foi possível buscar os remédios e horários.", error)
    listmedicinePatientClinicalConditions.value = []
    toast.error("Não foi possível carregar as ministrações.")
  } finally {
    loadingmedicinePatientClinicalConditions.value = false
  }
}

const openAdministrationDialog = item => {
  selectedItem.value = item
  administrationForm.value = {
    status: 'Administrado',
    administeredDateTime: toDateTimeLocal(new Date()),
    observations: '',
  }
  administrationDialog.value = true
}

const closeAdministrationDialog = () => {
  if (savingAdministration.value)
    return

  administrationDialog.value = false
  administrationFormRef.value?.resetValidation()
}

const saveAdministration = async () => {
  const validation = await administrationFormRef.value?.validate()

  if (!validation?.valid) {
    toast.warning('Preencha os campos obrigatórios.')

    return
  }

  savingAdministration.value = true

  try {
    // TODO: confirme os nomes reais dos campos do seu DTO de MedicationAdministration
    const payload = {
      medicinePatientClinicalConditionId: selectedItem.value.id,
      patientId: selectedItem.value.patientId,
      employeeId: selectedItem.value.responsibleEmployeeId,
      scheduledDateTime: selectedItem.value.startDate || selectedItem.value.administrationTime,
      administeredDateTime: new Date(administrationForm.value.administeredDateTime).toISOString(),
      status: administrationForm.value.status,
      observations: administrationForm.value.observations?.trim() || '',
    }

    await medicationAdministrationsApi.create(payload)

    toast.success('Administração registrada com sucesso.')
    administrationDialog.value = false
    await getMedicinePatientClinicalCondicions()
  } catch (error) {
    console.error('Erro ao registrar administração:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? 'Não foi possível registrar a administração.')
  } finally {
    savingAdministration.value = false
  }
}

onMounted(() => {
  getMedicinePatientClinicalCondicions(),
  getMedicines(),
  getListEmployees()
})
</script>
