<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VAvatar color="primary" variant="tonal">
            <VIcon icon="mdi-pill" />
          </VAvatar>

          <div>
            <div class="text-h5 font-weight-bold">
              Novo medicamento programado
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Cadastre um medicamento que deverá ser administrado ao acolhido.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VAlert v-if="loadError" type="warning" variant="tonal" class="mb-6">
            {{ loadError }}
          </VAlert>

          <VForm ref="formRef" @submit.prevent="submit">
            <VRow>
              <VCol cols="12" md="4">
                <VAutocomplete v-model="model.patientId" label="Acolhido" :items="patientOptions" item-title="title"
                  item-value="id" :loading="loadingOptions" :rules="requiredRules" clearable
                  @update:model-value="onPatientSelected" />
              </VCol>

              <VCol cols="12" md="4">
                <div class="d-flex gap-2">
                  <VAutocomplete v-model="model.patientClinicalConditionId" label="Condição clínica"
                    :items="patientConditionOptions" item-title="title" item-value="id" :loading="loadingConditions"
                    :disabled="!model.patientId" :rules="requiredRules" clearable class="flex-grow-1"
                    placeholder="Selecione uma condição clínica" />

                  <VBtn icon="mdi-plus" color="primary" variant="tonal" :disabled="!model.patientId"
                    @click="conditionDialog = true" />
                </div>
              </VCol>

              <VCol cols="12" md="4">
                <div class="d-flex gap-2">
                  <VAutocomplete v-model="model.medicineId" label="Medicamento" :items="medicineOptions"
                    item-title="title" item-value="id" :loading="loadingOptions" :rules="requiredRules" clearable
                    class="flex-grow-1" placeholder="Selecione um medicamento" />

                  <VBtn icon="mdi-plus" color="primary" variant="tonal" @click="medicineDialog = true" />
                </div>
              </VCol>

              <VCol cols="12" md="4">
                <VAutocomplete v-model="model.responsibleEmployeeId" label="Responsável pela administração"
                  :items="employeeOptions" item-title="title" item-value="id" :loading="loadingOptions"
                  :rules="requiredRules" clearable />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.prescribedDosage" label="Dosagem prescrita"
                  placeholder="Ex.: 50mg, 1 comprimido, 10ml" :rules="requiredRules" />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.frequency" label="Frequência" placeholder="Ex.: 1 vez ao dia"
                  :rules="requiredRules" />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.administrationTime" label="Horário de administração" type="time"
                  :rules="requiredRules" />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.startDate" label="Data inicial" type="datetime-local"
                  :rules="requiredRules" />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.endDate" label="Data final" type="datetime-local" :rules="endDateRules"
                  clearable />
              </VCol>

              <VCol cols="12">
                <VTextarea v-model="model.observations" label="Observações"
                  placeholder="Ex.: Administrar após o café da manhã." rows="3" auto-grow />
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-end gap-3">
                  <VBtn variant="outlined" color="secondary" :disabled="saving"
                    @click="router.push({ name: 'patient-medicines' })">
                    Cancelar
                  </VBtn>

                  <VBtn type="submit" color="primary" prepend-icon="mdi-content-save" :loading="saving"
                    :disabled="loadingOptions || loadingConditions">
                    Salvar medicamento programado
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VDialog v-model="conditionDialog" max-width="600">
    <VCard>
      <VCardTitle class="pa-6">
        Nova condição clínica
      </VCardTitle>

      <VDivider />

      <VCardText class="pa-6">
        <VRow>
          <VCol cols="12">
            <VTextField v-model="newCondition.name" label="Nome da condição" placeholder="Ex.: Hipertensão" />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="newCondition.type" label="Tipo" placeholder="Ex.: Clínica" />
          </VCol>

          <VCol cols="12">
            <VTextarea v-model="newCondition.description" label="Descrição" placeholder="Descreva a condição clínica"
              rows="3" auto-grow />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-6 justify-end">
        <VBtn variant="outlined" color="secondary" @click="conditionDialog = false">
          Cancelar
        </VBtn>

        <VBtn color="primary" @click="addNewCondition">
          Adicionar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="medicineDialog" max-width="600">
    <VCard>
      <VCardTitle class="pa-6">
        Novo medicamento
      </VCardTitle>

      <VDivider />

      <VCardText class="pa-6">
        <VRow>
          <VCol cols="12" md="6">
            <VTextField v-model="newMedicine.name" label="Nome" placeholder="Ex.: Losartana" />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="newMedicine.dosage" label="Dosagem" placeholder="Ex.: 50mg" />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect v-model="newMedicine.administrationRoute" label="Via de administração"
              :items="administrationRouteOptions" clearable />
          </VCol>

          <VCol cols="12">
            <VTextarea v-model="newMedicine.description" label="Descrição" placeholder="Descrição do medicamento"
              rows="3" auto-grow />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-6 justify-end">
        <VBtn variant="outlined" color="secondary" @click="medicineDialog = false">
          Cancelar
        </VBtn>

        <VBtn color="primary" @click="addNewMedicine">
          Adicionar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { clinicalConditionsApi } from '@/api/clinical-conditions-api'
import { employeesApi } from '@/api/employees-api'
import { medicinePatientClinicalConditionsApi } from '@/api/medicine-patient-clinical-conditions-api'
import { medicinesApi } from '@/api/medicines-api'
import { patientClinicalConditionsApi } from '@/api/patient-clinical-conditions-api'
import { patientsApi } from '@/api/patients-api'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()

const formRef = ref()
const saving = ref(false)
const loadingOptions = ref(false)
const loadingConditions = ref(false)
const loadError = ref('')

const conditionDialog = ref(false)
const medicineDialog = ref(false)

const patientOptions = ref([])
const patientConditionOptions = ref([])
const medicineOptions = ref([])
const employeeOptions = ref([])

const administrationRouteOptions = [
  'Oral',
  'Sublingual',
  'Tópica',
  'Inalatória',
  'Injetável',
  'Oftálmica',
  'Otológica',
  'Nasal',
]

const toDateTimeLocal = date => {
  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const now = new Date()

const model = reactive({
  patientId: null,

  medicineId: null,
  medicineName: '',
  medicineDosage: '',
  medicineDescription: '',
  medicineAdministrationRoute: '',

  patientClinicalConditionId: null,
  clinicalConditionName: '',
  clinicalConditionType: '',
  clinicalConditionDescription: '',

  prescribedDosage: '',
  frequency: '',
  administrationTime: '',
  responsibleEmployeeId: null,
  startDate: toDateTimeLocal(now),
  endDate: '',
  observations: '',
})

const newCondition = reactive({
  name: '',
  type: 'Clínica',
  description: '',
})

const newMedicine = reactive({
  name: '',
  dosage: '',
  description: '',
  administrationRoute: 'Oral',
})

const requiredRules = [
  value => value !== null && value !== undefined && value !== '' || 'Campo obrigatório',
]

const endDateRules = [
  value => !model.startDate || !value || new Date(value) >= new Date(model.startDate)
    || 'A data final deve ser igual ou posterior à data inicial',
]

const extractList = response => {
  const data = response?.data
  const nestedData = data?.data

  const list =
    Array.isArray(data)
      ? data
      : Array.isArray(nestedData)
        ? nestedData
        : nestedData?.items
        ?? nestedData?.patients
        ?? nestedData?.patientClinicalConditions
        ?? nestedData?.medicinePatientClinicalConditions
        ?? nestedData?.medicines
        ?? nestedData?.employees
        ?? data?.$values
        ?? []

  if (Array.isArray(list))
    return list

  return list?.$values ?? []
}

const getEntityId = response => {
  const data = response?.data?.data ?? response?.data

  return data?.id ?? data?.entityId ?? data
}

const getConditionTitle = item => {
  return item.clinicalConditionName
    ?? item.clinicalCondition?.name
    ?? item.clinicalCondition?.description
    ?? item.name
    ?? item.description
    ?? `Condição #${item.id}`
}

const onPatientSelected = async patientId => {
  model.patientId = patientId
  model.patientClinicalConditionId = null
  model.clinicalConditionName = ''
  model.clinicalConditionType = ''
  model.clinicalConditionDescription = ''

  await loadPatientConditions(patientId)
}

const loadPatientConditions = async patientId => {
  patientConditionOptions.value = []

  if (!patientId)
    return

  loadingConditions.value = true

  try {
    const ret = await patientClinicalConditionsApi.filter({
      page: 1,
      patientId: Number(patientId),
    })

    const conditions = extractList(ret)

    patientConditionOptions.value = conditions.map(item => ({
      id: Number(item.id),
      title: getConditionTitle(item),
      raw: item,
    }))

    if (!patientConditionOptions.value.length) {
      toast.warning('Esse acolhido ainda não possui condição clínica cadastrada. Você pode criar uma nova no botão +.')
    }
  } catch (error) {
    console.error('Erro ao carregar condições clínicas:', error)

    toast.error(
      error.response?.data?.errorMessage ??
      error.response?.data?.message ??
      'Não foi possível carregar as condições clínicas do acolhido.'
    )
  } finally {
    loadingConditions.value = false
  }
}

const loadOptions = async () => {
  loadingOptions.value = true
  loadError.value = ''

  const requests = await Promise.allSettled([
    patientsApi.getAll(),
    medicinesApi.getAll(),
    employeesApi.getAll(),
  ])

  const [patientsResult, medicinesResult, employeesResult] = requests

  if (patientsResult.status === 'fulfilled') {
    patientOptions.value = extractList(patientsResult.value).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.fullName ?? `Acolhido #${item.id}`,
    }))
  }

  if (medicinesResult.status === 'fulfilled') {
    medicineOptions.value = extractList(medicinesResult.value).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.description ?? `Medicamento #${item.id}`,
      raw: item,
    }))
  }

  if (employeesResult.status === 'fulfilled') {
    employeeOptions.value = extractList(employeesResult.value).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.fullName ?? `Responsável #${item.id}`,
    }))
  }

  if (requests.some(result => result.status === 'rejected')) {
    loadError.value = 'Não foi possível carregar todas as opções. Tente atualizar a página.'
  }

  loadingOptions.value = false
}

const addNewCondition = () => {
  if (!model.patientId) {
    toast.warning('Selecione um acolhido antes de adicionar uma condição clínica.')
    return
  }

  if (!newCondition.name?.trim()) {
    toast.warning('Informe o nome da condição clínica.')
    return
  }

  const newItem = {
    id: 0,
    title: `${newCondition.name.trim()} (nova)`,
    name: newCondition.name.trim(),
    type: newCondition.type?.trim() || 'Clínica',
    description: newCondition.description?.trim() || newCondition.name.trim(),
  }

  patientConditionOptions.value = patientConditionOptions.value.filter(item => Number(item.id) !== 0)
  patientConditionOptions.value.push(newItem)

  model.patientClinicalConditionId = 0
  model.clinicalConditionName = newItem.name
  model.clinicalConditionType = newItem.type
  model.clinicalConditionDescription = newItem.description

  conditionDialog.value = false

  newCondition.name = ''
  newCondition.type = 'Clínica'
  newCondition.description = ''

  toast.success('Condição adicionada. Ela será salva ao finalizar o cadastro.')
}

const addNewMedicine = () => {
  if (!newMedicine.name?.trim()) {
    toast.warning('Informe o nome do medicamento.')
    return
  }

  if (!newMedicine.dosage?.trim()) {
    toast.warning('Informe a dosagem do medicamento.')
    return
  }

  if (!newMedicine.administrationRoute) {
    toast.warning('Informe a via de administração.')
    return
  }

  const newItem = {
    id: 0,
    title: `${newMedicine.name.trim()} - ${newMedicine.dosage.trim()} (novo)`,
    name: newMedicine.name.trim(),
    dosage: newMedicine.dosage.trim(),
    description: newMedicine.description?.trim() || newMedicine.name.trim(),
    administrationRoute: newMedicine.administrationRoute,
  }

  medicineOptions.value = medicineOptions.value.filter(item => Number(item.id) !== 0)
  medicineOptions.value.push(newItem)

  model.medicineId = 0
  model.medicineName = newItem.name
  model.medicineDosage = newItem.dosage
  model.medicineDescription = newItem.description
  model.medicineAdministrationRoute = newItem.administrationRoute

  if (!model.prescribedDosage) {
    model.prescribedDosage = newItem.dosage
  }

  medicineDialog.value = false

  newMedicine.name = ''
  newMedicine.dosage = ''
  newMedicine.description = ''
  newMedicine.administrationRoute = 'Oral'

  toast.success('Medicamento adicionado. Ele será salvo ao finalizar o cadastro.')
}

const submit = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid)
    return

  saving.value = true

  try {
    let medicineId = model.medicineId
    let patientClinicalConditionId = model.patientClinicalConditionId

    if (Number(model.medicineId) === 0) {
      const medicineResponse = await medicinesApi.create({
        name: model.medicineName,
        dosage: model.medicineDosage,
        description: model.medicineDescription,
        administrationRoute: model.medicineAdministrationRoute,
      })

      medicineId = getEntityId(medicineResponse)

      if (!medicineId)
        throw new Error('Não foi possível criar o medicamento.')
    }

    if (Number(model.patientClinicalConditionId) === 0) {
      const conditionResponse = await clinicalConditionsApi.create({
        name: model.clinicalConditionName,
        type: model.clinicalConditionType || 'Clínica',
        description: model.clinicalConditionDescription || model.clinicalConditionName,
      })

      const clinicalConditionId = getEntityId(conditionResponse)

      if (!clinicalConditionId)
        throw new Error('Não foi possível criar a condição clínica.')

    const patientConditionResponse = await patientClinicalConditionsApi.create({
      entity: {
        patientId: Number(model.patientId),
        clinicalConditionId: Number(clinicalConditionId),
        diagnosisDate: new Date().toISOString(),
        observations: 'Condição criada durante o cadastro do medicamento programado.',
      },
    })

      patientClinicalConditionId = getEntityId(patientConditionResponse)

      if (!patientClinicalConditionId)
        throw new Error('Não foi possível vincular a condição clínica ao acolhido.')
    }

    const administrationTime = model.administrationTime.length === 5
      ? `${model.administrationTime}:00`
      : model.administrationTime

    const payload = {
      medicineId: Number(medicineId),
      patientClinicalConditionId: Number(patientClinicalConditionId),
      prescribedDosage: model.prescribedDosage.trim(),
      frequency: model.frequency.trim(),
      administrationTime,
      responsibleEmployeeId: Number(model.responsibleEmployeeId),
      startDate: new Date(model.startDate).toISOString(),
      endDate: model.endDate ? new Date(model.endDate).toISOString() : null,
      observations: model.observations.trim(),
    }

    await medicinePatientClinicalConditionsApi.create(payload)

    toast.success('Medicamento programado cadastrado com sucesso.')

    await router.push({
      name: 'patient-reminders',
    })
  } catch (error) {
    console.error('Erro ao cadastrar medicamento programado:', error)

    toast.error(
      error.response?.data?.errorMessage ??
      error.response?.data?.message ??
      error.message ??
      'Não foi possível cadastrar o medicamento programado.'
    )
  } finally {
    saving.value = false
  }
}

onMounted(loadOptions)
</script>
