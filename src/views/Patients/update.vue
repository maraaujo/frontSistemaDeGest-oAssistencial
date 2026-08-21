<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VAvatar
            color="primary"
            variant="tonal"
          >
            <VIcon icon="mdi-account-edit" />
          </VAvatar>

          <div>
            <div class="text-h5 font-weight-bold">
              Editar acolhido
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Atualize os dados do acolhido, responsáveis, condições clínicas e medicamentos.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VAlert
            v-if="loadError"
            type="error"
            variant="tonal"
            class="mb-6"
          >
            {{ loadError }}
          </VAlert>

          <VSkeletonLoader
            v-if="loading"
            type="article, actions"
          />

          <VForm
            v-else
            ref="formRef"
            @submit.prevent="submit"
          >
            <VStepper
              v-model="currentStep"
              flat
            >
              <VStepperHeader>
                <template
                  v-for="(step, index) in steps"
                  :key="step.value"
                >
                  <VStepperItem
                    :value="step.value"
                    :title="step.title"
                    :icon="step.icon"
                    editable
                  />
                  <VDivider v-if="index < steps.length - 1" />
                </template>
              </VStepperHeader>

              <VDivider />

              <VStepperWindow v-model="currentStep">
                <VStepperWindowItem :value="1">
                  <div class="text-h6 mb-4 mt-4">
                    Dados do acolhido
                  </div>

                  <VRow>
                    <VCol
                      cols="12"
                      md="6"
                    >
                      <VTextField
                        v-model="model.name"
                        label="Nome completo"
                        :rules="requiredRules"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="3"
                    >
                      <VTextField
                        v-model="model.birthDate"
                        label="Data de nascimento"
                        type="date"
                        :rules="requiredRules"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="3"
                    >
                      <VSelect
                        v-model="model.gender"
                        label="Sexo"
                        :items="genderOptions"
                        :rules="requiredRules"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <VTextField
                        v-model="model.phone"
                        label="Telefone"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <VTextField
                        v-model="model.cpf"
                        label="CPF"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <VTextField
                        v-model="model.document"
                        label="Documento"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <VAutocomplete
                        v-model="model.bloodTypeId"
                        label="Tipo sanguíneo"
                        :items="bloodTypeOptions"
                        item-title="title"
                        item-value="id"
                        :loading="loadingOptions"
                        :rules="requiredRules"
                        clearable
                      />
                    </VCol>

                    <VCol cols="12">
                      <VTextarea
                        v-model="model.observations"
                        label="Observações"
                        rows="3"
                        auto-grow
                      />
                    </VCol>
                  </VRow>

                  <div class="d-flex justify-end gap-3 mt-4">
                    <VBtn
                      variant="outlined"
                      color="secondary"
                      :disabled="saving"
                      @click="cancel"
                    >
                      Cancelar
                    </VBtn>

                    <VBtn
                      color="primary"
                      append-icon="mdi-arrow-right"
                      @click="goNext"
                    >
                      Próximo
                    </VBtn>
                  </div>
                </VStepperWindowItem>

                <VStepperWindowItem :value="2">
                  <div class="d-flex align-center justify-space-between mb-4 mt-4">
                    <div>
                      <div class="text-h6">
                        Responsáveis
                      </div>
                      <div class="text-body-2 text-medium-emphasis">
                        Atualize os responsáveis vinculados ao acolhido.
                      </div>
                    </div>

                    <VBtn
                      color="primary"
                      variant="tonal"
                      prepend-icon="mdi-plus"
                      @click="addResponsible"
                    >
                      Adicionar responsável
                    </VBtn>
                  </div>

                  <VCard
                    v-for="(responsible, index) in model.responsibles"
                    :key="index"
                    variant="outlined"
                    class="mb-4"
                  >
                    <VCardTitle class="d-flex align-center justify-space-between text-subtitle-1">
                      Responsável {{ index + 1 }}
                      <VBtn
                        v-if="model.responsibles.length > 1"
                        icon="mdi-delete-outline"
                        color="error"
                        variant="text"
                        size="small"
                        @click="removeResponsible(index)"
                      />
                    </VCardTitle>

                    <VCardText>
                      <VRow>
                        <VCol
                          cols="12"
                          md="6"
                        >
                          <VTextField
                            v-model="responsible.name"
                            label="Nome completo"
                            :rules="requiredRules"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="responsible.phone"
                            label="Telefone"
                            :rules="requiredRules"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="responsible.relationship"
                            label="Parentesco"
                            :rules="requiredRules"
                          />
                        </VCol>

                        <VCol cols="12">
                          <VTextField
                            v-model="responsible.address"
                            label="Endereço"
                            :rules="requiredRules"
                          />
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>

                  <div class="d-flex justify-space-between gap-3 mt-4">
                    <VBtn
                      variant="outlined"
                      color="secondary"
                      prepend-icon="mdi-arrow-left"
                      @click="goBack"
                    >
                      Voltar
                    </VBtn>

                    <VBtn
                      color="primary"
                      append-icon="mdi-arrow-right"
                      @click="goNext"
                    >
                      Próximo
                    </VBtn>
                  </div>
                </VStepperWindowItem>

                <VStepperWindowItem :value="3">
                  <div class="text-h6 mt-4">
                    Condições clínicas
                  </div>
                  <div class="text-body-2 text-medium-emphasis mb-4">
                    Adicione ou remova as condições clínicas do acolhido.
                  </div>

                  <VCard
                    variant="outlined"
                    class="mb-4"
                  >
                    <VCardText>
                      <VRow>
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VAutocomplete
                            v-model="selectedClinicalCondition"
                            label="Condição clínica"
                            :items="clinicalConditionOptions"
                            item-title="name"
                            item-value="id"
                            :loading="loadingOptions"
                            return-object
                            clearable
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="conditionForm.diagnosisDate"
                            label="Data do diagnóstico"
                            type="date"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VTextField
                            v-model="conditionForm.observations"
                            label="Observações"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="1"
                          class="d-flex align-center"
                        >
                          <VBtn
                            icon="mdi-plus"
                            color="primary"
                            variant="tonal"
                            @click="addClinicalCondition"
                          />
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>

                  <VDataTable
                    :headers="conditionHeaders"
                    :items="model.clinicalConditions"
                    no-data-text="Nenhuma condição clínica adicionada"
                    hide-default-footer
                  >
                    <template #[`item.actions`]="{ index }">
                      <VBtn
                        icon="mdi-delete-outline"
                        color="error"
                        variant="text"
                        size="small"
                        @click="removeClinicalCondition(index)"
                      />
                    </template>
                  </VDataTable>

                  <div class="d-flex justify-space-between gap-3 mt-4">
                    <VBtn
                      variant="outlined"
                      color="secondary"
                      prepend-icon="mdi-arrow-left"
                      @click="goBack"
                    >
                      Voltar
                    </VBtn>

                    <VBtn
                      color="primary"
                      append-icon="mdi-arrow-right"
                      @click="goNext"
                    >
                      Próximo
                    </VBtn>
                  </div>
                </VStepperWindowItem>

                <VStepperWindowItem :value="4">
                  <div class="text-h6 mt-4">
                    Medicamentos programados
                  </div>
                  <div class="text-body-2 text-medium-emphasis mb-4">
                    Adicione ou remova os medicamentos programados para o acolhido.
                  </div>

                  <VCard
                    variant="outlined"
                    class="mb-4"
                  >
                    <VCardText>
                      <VRow>
                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VAutocomplete
                            v-model="selectedMedicine"
                            label="Medicamento"
                            :items="medicineOptions"
                            item-title="name"
                            item-value="id"
                            :loading="loadingOptions"
                            return-object
                            clearable
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VAutocomplete
                            v-model="selectedMedicineClinicalCondition"
                            label="Condição clínica relacionada"
                            :items="medicineClinicalConditionOptions"
                            item-title="clinicalConditionName"
                            item-value="clinicalConditionId"
                            no-data-text="Adicione uma condição clínica na etapa anterior"
                            return-object
                            clearable
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="4"
                        >
                          <VAutocomplete
                            v-model="selectedEmployee"
                            label="Funcionário responsável"
                            :items="employeeOptions"
                            item-title="name"
                            item-value="id"
                            :loading="loadingOptions"
                            return-object
                            clearable
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="medicineForm.prescribedDosage"
                            label="Dosagem prescrita"
                            placeholder="Ex.: 50mg"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="medicineForm.frequency"
                            label="Frequência"
                            placeholder="Ex.: 1 vez ao dia"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="medicineForm.administrationTime"
                            label="Horário de administração"
                            type="time"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="medicineForm.startDate"
                            label="Data inicial"
                            type="date"
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="3"
                        >
                          <VTextField
                            v-model="medicineForm.endDate"
                            label="Data final"
                            type="date"
                            clearable
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="8"
                        >
                          <VTextarea
                            v-model="medicineForm.observations"
                            label="Observações"
                            rows="2"
                            auto-grow
                          />
                        </VCol>

                        <VCol
                          cols="12"
                          md="1"
                          class="d-flex align-center"
                        >
                          <VBtn
                            icon="mdi-plus"
                            color="primary"
                            variant="tonal"
                            @click="addScheduledMedicine"
                          />
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>

                  <VDataTable
                    :headers="medicineHeaders"
                    :items="model.scheduledMedicines"
                    no-data-text="Nenhum medicamento adicionado"
                    hide-default-footer
                  >
                    <template #[`item.actions`]="{ index }">
                      <VBtn
                        icon="mdi-delete-outline"
                        color="error"
                        variant="text"
                        size="small"
                        @click="removeScheduledMedicine(index)"
                      />
                    </template>
                  </VDataTable>

                  <div class="d-flex justify-space-between gap-3 mt-4">
                    <VBtn
                      variant="outlined"
                      color="secondary"
                      prepend-icon="mdi-arrow-left"
                      @click="goBack"
                    >
                      Voltar
                    </VBtn>

                    <VBtn
                      type="submit"
                      color="primary"
                      prepend-icon="mdi-content-save"
                      :loading="saving"
                      :disabled="loadingOptions"
                    >
                      Salvar alterações
                    </VBtn>
                  </div>
                </VStepperWindowItem>
              </VStepperWindow>
            </VStepper>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { bloodTypesApi } from '@/api/blood-types-api'
import { clinicalConditionsApi } from '@/api/clinical-conditions-api'
import { employeesApi } from '@/api/employees-api'
import { medicinesApi } from '@/api/medicines-api'
import { patientClinicalConditionsApi } from '@/api/patient-clinical-conditions-api'
import { patientsApi } from '@/api/patients-api'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(true)
const loadingOptions = ref(false)
const saving = ref(false)
const loadError = ref('')

const currentStep = ref(1)

const steps = [
  { value: 1, title: 'Dados do acolhido', icon: 'mdi-account' },
  { value: 2, title: 'Responsáveis', icon: 'mdi-account-group' },
  { value: 3, title: 'Condições clínicas', icon: 'mdi-medical-bag' },
  { value: 4, title: 'Medicamentos', icon: 'mdi-pill' },
]

const bloodTypeOptions = ref([])
const clinicalConditionOptions = ref([])
const medicineOptions = ref([])
const employeeOptions = ref([])

const genderOptions = ['Feminino', 'Masculino', 'Outro']
const requiredRules = [value => value !== null && value !== undefined && value !== '' || 'Campo obrigatório']

const conditionHeaders = [
  { title: 'Condição', key: 'clinicalConditionName' },
  { title: 'Data do diagnóstico', key: 'diagnosisDate' },
  { title: 'Observações', key: 'observations' },
  { title: '', key: 'actions', sortable: false },
]

const medicineHeaders = [
  { title: 'Medicamento', key: 'medicineName' },
  { title: 'Condição clínica', key: 'clinicalConditionName' },
  { title: 'Dosagem', key: 'prescribedDosage' },
  { title: 'Frequência', key: 'frequency' },
  { title: 'Horário', key: 'administrationTime' },
  { title: 'Responsável', key: 'employeeName' },
  { title: 'Início', key: 'startDate' },
  { title: 'Fim', key: 'endDate' },
  { title: '', key: 'actions', sortable: false },
]

const newResponsible = () => ({
  id: 0,
  patientId: Number(route.params.id),
  name: '',
  phone: '',
  relationship: '',
  address: '',
})

const model = ref({
  id: 0,
  name: '',
  birthDate: '',
  phone: '',
  document: '',
  gender: '',
  cpf: '',
  observations: '',
  bloodTypeId: null,
  responsibles: [],
  clinicalConditions: [],
  scheduledMedicines: [],
})

const selectedClinicalCondition = ref(null)
const conditionForm = ref({ diagnosisDate: '', observations: '' })

const selectedMedicine = ref(null)
const selectedMedicineClinicalCondition = ref(null)
const selectedEmployee = ref(null)

//losta cpmputada para o seletor de me3dicamentos
const medicineClinicalConditionOptions = computed(() => model.value.clinicalConditions.map(condition => ({
  ...condition,
  clinicalConditionId: Number(condition.clinicalConditionId),
})))

const medicineForm = ref({
  prescribedDosage: '',
  frequency: '',
  administrationTime: '',
  startDate: '',
  endDate: '',
  observations: '',
})

const getData = response => response?.data?.data ?? response?.data

const getList = value => {
  if (Array.isArray(value))
    return value

  if (value?.$values)
    return value.$values

  return value ? [value] : []
}

const formatDateInput = value => {
  if (!value)
    return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime()))
    return String(value).slice(0, 10)

  return date.toISOString().slice(0, 10)
}

const formatTimeInput = value => {
  if (!value)
    return ''

  if (typeof value === 'string')
    return value.slice(0, 5)

  return value
}

const goNext = () => {
  if (currentStep.value < steps.length)
    currentStep.value += 1
}

const goBack = () => {
  if (currentStep.value > 1)
    currentStep.value -= 1
}

const loadBloodTypes = async () => {
  try {
    const items = getList(getData(await bloodTypesApi.getAll()))

    bloodTypeOptions.value = items.map(item => ({
      id: Number(item.id),
      title: item.name ?? item.description ?? `Tipo #${item.id}`,
    }))
  } catch (error) {
    console.error('Erro ao carregar tipos sanguíneos:', error)
    loadError.value = 'Não foi possível carregar os tipos sanguíneos.'
  }
}

const loadClinicalConditionOptions = async () => {
  try {
    const items = getList(getData(await clinicalConditionsApi.getAll()))

    clinicalConditionOptions.value = items.map(item => ({
      id: Number(item.id),
      name: item.name ?? `Condição #${item.id}`,
    }))
  } catch (error) {
    console.error('Erro ao carregar condições clínicas:', error)
    loadError.value = 'Não foi possível carregar as condições clínicas.'
  }
}

const loadMedicineOptions = async () => {
  try {
    const items = getList(getData(await medicinesApi.getAll()))

    medicineOptions.value = items.map(item => ({
      id: Number(item.id),
      name: item.name ?? `Medicamento #${item.id}`,
    }))
  } catch (error) {
    console.error('Erro ao carregar medicamentos:', error)
    loadError.value = 'Não foi possível carregar os medicamentos.'
  }
}

const loadEmployeeOptions = async () => {
  try {
    const items = getList(getData(await employeesApi.getAll()))

    employeeOptions.value = items.map(item => ({
      id: Number(item.id),
      name: item.name ?? `Funcionário #${item.id}`,
    }))
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error)
    loadError.value = 'Não foi possível carregar os funcionários.'
  }
}

const loadPatient = async () => {
  try {
    const id = route.params.id
    const data = getData(await patientsApi.getPatientDetails(id))
    const patient = data?.data ?? data?.patient ?? data
    const bloodType = data?.bloodType ?? patient?.bloodType

    model.value.id = Number(patient.id ?? id)
    model.value.name = patient.name ?? ''
    model.value.document = patient.document ?? ''
    model.value.phone = patient.phone ?? ''
    model.value.bloodTypeId = Number(bloodType?.id ?? patient.bloodTypeId ?? patient.idBloodType) || null
    model.value.birthDate = formatDateInput(patient.birthDate)
    model.value.gender = patient.gender ?? ''
    model.value.cpf = patient.cpf ?? ''
    model.value.observations = patient.observations ?? ''

    model.value.responsibles = getList(data?.responsibles).map(responsible => ({
      id: Number(responsible.id) || 0,
      patientId: Number(patient.id ?? id),
      name: responsible.name ?? '',
      phone: responsible.phone ?? '',
      relationship: responsible.relationship ?? '',
      address: responsible.address ?? '',
    }))

    if (!model.value.responsibles.length)
      model.value.responsibles.push(newResponsible())

    model.value.scheduledMedicines = getList(data?.medicines).map(medicine => ({
      id: 0,
      medicineId: Number(medicine.medicineId ?? medicine.id),
      medicineName: medicine.medicineName ?? medicine.name ?? '',
      patientClinicalConditionId: 0,
      clinicalConditionId: Number(medicine.clinicalConditionId ?? medicine.patientClinicalConditionId) || null,
      clinicalConditionName: medicine.clinicalConditionName ?? medicine.clinicalCondition ?? '',
      prescribedDosage: medicine.prescribedDosage ?? medicine.dosage ?? '',
      frequency: medicine.frequency ?? '',
      administrationTime: formatTimeInput(medicine.administrationTime),
      responsibleEmployeeId: Number(medicine.responsibleEmployeeId) || null,
      employeeName: medicine.employeeName ?? medicine.responsibleEmployee ?? '',
      startDate: formatDateInput(medicine.startDate),
      endDate: formatDateInput(medicine.endDate),
      observations: medicine.observations ?? medicine.description ?? '',
    }))
  } catch (error) {
    console.error('Erro ao carregar acolhido:', error)
    loadError.value = 'Não foi possível carregar os dados do acolhido.'
  }
}

const loadPatientClinicalConditions = async () => {
  try {
    const id = route.params.id
    const items = getList(getData(await patientClinicalConditionsApi.getByPatientId(id)))

    model.value.clinicalConditions = items.map(item => ({
      id: Number(item.id) || 0,
      clinicalConditionId: Number(item.clinicalConditionId),
      clinicalConditionName: item.clinicalCondition ?? item.clinicalConditionName ?? '',
      diagnosisDate: formatDateInput(item.diagnosisDate),
      observations: item.observations ?? '',
    }))
  } catch (error) {
    console.error('Erro ao carregar condições clínicas do acolhido:', error)
  }
}

const addResponsible = () => model.value.responsibles.push(newResponsible())
const removeResponsible = index => model.value.responsibles.splice(index, 1)

const addClinicalCondition = () => {
  if (!selectedClinicalCondition.value) {
    toast.warning('Selecione uma condição clínica.')

    return
  }

  const condition = {
    id: 0,
    clinicalConditionId: Number(selectedClinicalCondition.value.id),
    clinicalConditionName: selectedClinicalCondition.value.name,
    diagnosisDate: conditionForm.value.diagnosisDate,
    observations: conditionForm.value.observations,
  }

  model.value.clinicalConditions.push(condition)

  selectedClinicalCondition.value = null
  conditionForm.value = { diagnosisDate: '', observations: '' }
}

const removeClinicalCondition = index => model.value.clinicalConditions.splice(index, 1)

const addScheduledMedicine = () => {
  if (!selectedMedicine.value) {
    toast.warning('Selecione um medicamento.')

    return
  }

  if (!selectedMedicineClinicalCondition.value) {
    toast.warning('Selecione a condição clínica relacionada.')

    return
  }

  const scheduledMedicine = {
    id: 0,
    medicineId: selectedMedicine.value.id,
    medicineName: selectedMedicine.value.name,
    patientClinicalConditionId: 0,
    clinicalConditionId: selectedMedicineClinicalCondition.value.clinicalConditionId,
    clinicalConditionName: selectedMedicineClinicalCondition.value.clinicalConditionName,
    prescribedDosage: medicineForm.value.prescribedDosage,
    frequency: medicineForm.value.frequency,
    administrationTime: medicineForm.value.administrationTime,
    responsibleEmployeeId: selectedEmployee.value?.id ?? null,
    employeeName: selectedEmployee.value?.name ?? '',
    startDate: medicineForm.value.startDate,
    endDate: medicineForm.value.endDate || null,
    observations: medicineForm.value.observations,
  }

  model.value.scheduledMedicines.push(scheduledMedicine)

  selectedMedicine.value = null
  selectedMedicineClinicalCondition.value = null
  selectedEmployee.value = null
  medicineForm.value = {
    prescribedDosage: '',
    frequency: '',
    administrationTime: '',
    startDate: '',
    endDate: '',
    observations: '',
  }
}

const removeScheduledMedicine = index => model.value.scheduledMedicines.splice(index, 1)

const cancel = () => router.push({ name: 'patient-details', params: { id: model.value.id || route.params.id } })

const submit = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid) {
    currentStep.value = 1
    toast.warning('Preencha os campos obrigatórios antes de salvar.')

    return
  }

  saving.value = true

  try {
    const patientId = Number(model.value.id)

    const patient = {
      id: patientId,
      name: model.value.name.trim(),
      birthDate: new Date(`${model.value.birthDate}T00:00:00`).toISOString(),
      phone: model.value.phone?.trim() || '',
      document: model.value.document?.trim() || '',
      gender: model.value.gender,
      cpf: model.value.cpf?.trim() || '',
      observations: model.value.observations?.trim() || '',
      bloodTypeId: Number(model.value.bloodTypeId),
    }


    const payload = {
      patient,
      responsibles: model.value.responsibles.map(responsible => ({
        id: Number(responsible.id) || 0,
        patientId,
        name: responsible.name.trim(),
        phone: responsible.phone.trim(),
        relationship: responsible.relationship.trim(),
        address: responsible.address.trim(),
      })),
      clinicalConditions: model.value.clinicalConditions.map(condition => ({
        id: Number(condition.id) || 0,
        patientId,
        clinicalConditionId: Number(condition.clinicalConditionId),
        diagnosisDate: condition.diagnosisDate ? new Date(`${condition.diagnosisDate}T00:00:00`).toISOString() : null,
        observations: condition.observations,
      })),
      scheduledMedicines: model.value.scheduledMedicines.map(medicine => ({
        id: Number(medicine.id) || 0,
        medicineId: Number(medicine.medicineId),
        patientClinicalConditionId: 0,
        clinicalConditionId: Number(medicine.clinicalConditionId),
        prescribedDosage: medicine.prescribedDosage,
        frequency: medicine.frequency,
        administrationTime: medicine.administrationTime?.length === 5 ? `${medicine.administrationTime}:00` : medicine.administrationTime,
        responsibleEmployeeId: Number(medicine.responsibleEmployeeId) || 0,
        startDate: medicine.startDate ? new Date(`${medicine.startDate}T00:00:00`).toISOString() : null,
        endDate: medicine.endDate ? new Date(`${medicine.endDate}T00:00:00`).toISOString() : null,
        observations: medicine.observations,
      })),
    }

    await patientsApi.update(model.value.id, payload)

    toast.success('Acolhido atualizado com sucesso.')
    await router.push({ name: 'patient-details', params: { id: model.value.id } })
  } catch (error) {
    console.error('Erro ao atualizar acolhido:', error)
    toast.error(
      error.response?.data?.errorMessage
      ?? error.response?.data?.message
      ?? error.message
      ?? 'Não foi possível atualizar o acolhido.',
    )
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loading.value = true
  loadingOptions.value = true

  try {
    await Promise.all([
      loadBloodTypes(),
      loadClinicalConditionOptions(),
      loadMedicineOptions(),
      loadEmployeeOptions(),
      loadPatient(),
      loadPatientClinicalConditions(),
    ])
  } finally {
    loading.value = false
    loadingOptions.value = false
  }
})
</script>
