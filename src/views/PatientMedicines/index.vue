<template>
  <VRow>
    <VCol cols="12">
      <VStepper v-model="currentStep">
        <VStepperItem :value="1" title="Ministração" color="primary" icon="mdi-pill" :complete="currentStep > 1" />
        <VForm @submit.prevent="submit">
          <VStepperWindow v-model="currentStep" :touch="false">
            <VStepperWindowItem :value="1">
              <VRow>
                <VCol cols="12" sm="4">
                  <VTextField v-model="filtermodel.patientName" label="Nome do Paciente" />
                </VCol>
                <VCol cols="12" sm="4">
                  <VAutocomplete v-model="filtermodel.medicineId" label="Remedio" item-title="name"
                    item-value="id"  :items="listMedicine" />
                </VCol>
                <VCol cols="12" sm="4">
                  <VAutocomplete v-model="filtermodel.responsibleEmployeeId" chips clearable multiple small-chips label="Responsável"
                    :items="listResponsibleEmployee" item-title="name" item-value="id" />
                </VCol>

                <VCol cols="12">
                  <div class="d-flex flex-wrap gap-4 justify-space-between">
                    <VBtn color="primary" @click="router.push({ name: 'patient-medicines-create' })">
                      Criar Nova Ministração
                    </VBtn>
                    <VBtn color="secondary" @click="submit">
                      Procurar
                    </VBtn>
                  </div>
                </VCol>

              </VRow>
              <VRow>

                <VCol cols="12">
                  <VDataTable title="Ministrações" :headers="headers" :items="listmedicinePatientClinicalConditions"
                    :loading="loadingmedicinePatientClinicalConditions" loading-text="Carregando... Aguarde"
                    class="text-no-wrap rounded-t-0" hide-default-footer>
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

                           <template #item.actions="{ item }">
                      <VMenu>
                        <template #activator="{ props }">
                          <VBtn type="button" color="primary" size="small" v-bind="props">
                            <VIcon dark small>
                              mdi-cog
                            </VIcon>
                          </VBtn>
                        </template>
                        <VList>
                          <VListItem link @click.stop="goToEdit(item)">
                            <VListItemTitle>Detalhes</VListItemTitle>
                          </VListItem>
                          <VListItem link @click="() => confirmDeleteOffer(item.id)">
                            <VListItemTitle class="text-red">Apagar</VListItemTitle>
                          </VListItem>

                        </VList>

                      </VMenu>
                    </template>
                  </VDataTable>

                  <VPagination :model-value="paginationData.page" :size="size" color="secondary" :total-visible="10"
                    @next="getMedicinePatientClinicalCondicions()" @prev="getMedicinePatientClinicalCondicions()" @click="getMedicinePatientClinicalCondicions()" active-color="primary"
                    :length="paginationData.totalPages"  />

                  <VDialog v-model="showDeleteDialog" persistent max-width="500">
                    <VCard>
                      <VCardTitle>Confirmar exclusão</VCardTitle>
                      <VCardText>Tem certeza que deseja apagar esta oferta?</VCardText>
                      <VCardActions>
                        <VSpacer />
                        <VBtn text @click="() => (showDeleteDialog = false, offerToDelete = null)">Cancelar</VBtn>
                        <VBtn color="red" @click="deleteOffer">Apagar</VBtn>
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
import { medicinePatientClinicalConditionsApi } from "@/api/medicine-patient-clinical-conditions-api"
import { medicinesApi } from "@/api/medicines-api"
import 'cleave.js/dist/addons/cleave-phone.br'
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
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
  { title: "Ações", key: "actions", sortable: false, align: "center" }
]
const currentStep = ref(1)
const listmedicinePatientClinicalConditions = ref([])
const size = ref('default')
const filtermodel = ref({})
const loadingmedicinePatientClinicalConditions = ref(false)
const paginationData = ref({ page: 1, totalPages: 1, itensPerPage: 10, count: 0, perPage: 15 })
const periodicity = ref()
const router = useRouter();
const listResponsibleEmployee = ref([])
const listMedicine = ref([])



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

const confirmDeleteOffer = (id) => {
  offerToDelete.value = id
  showDeleteDialog.value = true
}

const deleteOffer = async (id) => {
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
const onPatientSelected = async patientId => {
  model.patientId = patientId
  model.patientClinicalConditionId = null
  patientConditionOptions.value = []

  if (!patientId) return

  const ret = await patientClinicalConditionsApi.getByPatientId(patientId)
  const responseData = ret?.data?.data ?? ret?.data

  patientConditionOptions.value = Array.isArray(responseData)
    ? responseData
    : responseData?.$values ?? (responseData?.id ? [responseData] : [])

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


onMounted(() => {
  getMedicinePatientClinicalCondicions(),
    getMedicines(),
    getListEmployees()
})
</script>
