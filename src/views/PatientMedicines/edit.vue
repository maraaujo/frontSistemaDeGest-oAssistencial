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
              Editar prescrição de medicamento
            </div>

            <div class="text-body-2 text-medium-emphasis">
              Atualize o medicamento vinculado à condição clínica de um acolhido.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VAlert
            v-if="loadError"
            type="warning"
            variant="tonal"
            class="mb-6"
          >
            {{ loadError }}
          </VAlert>

          <VForm ref="formRef" @submit.prevent="submit">
            <VRow>
              <VCol cols="12" md="4">
                <VSelect
                  v-model="model.patientId"
                  label="Acolhido"
                  :items="patientOptions"
                  item-title="title"
                  item-value="id"
                  :loading="loading"
                  :rules="requiredRules"
                  clearable
                  @update:model-value="onPatientSelected"
                />
              </VCol>

              <VCol cols="12" md="4">
                <VSelect
                  v-model="model.patientClinicalConditionId"
                  label="Condição clínica"
                  :items="patientConditionOptions"
                  item-title="title"
                  item-value="id"
                  :loading="loadingConditions"
                  :disabled="!model.patientId"
                  :rules="requiredRules"
                  clearable
                />
              </VCol>

              <VCol cols="12" md="4">
                <VSelect
                  v-model="model.medicineId"
                  label="Medicamento"
                  :items="medicineOptions"
                  item-title="title"
                  item-value="id"
                  :loading="loading"
                  :rules="requiredRules"
                  clearable
                />
              </VCol>

              <VCol cols="12" md="4">
                <VSelect
                  v-model="model.responsibleEmployeeId"
                  label="Responsável"
                  :items="employeeOptions"
                  item-title="title"
                  item-value="id"
                  :loading="loading"
                  :rules="requiredRules"
                  clearable
                />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField
                  v-model="model.prescribedDosage"
                  label="Dosagem prescrita"
                  placeholder="Ex.: 1 comprimido"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField
                  v-model="model.frequency"
                  label="Frequência"
                  placeholder="Ex.: A cada 8 horas"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField
                  v-model="model.administrationTime"
                  label="Horário de administração"
                  type="time"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField
                  v-model="model.startDate"
                  label="Data inicial"
                  type="datetime-local"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField
                  v-model="model.endDate"
                  label="Data final"
                  type="datetime-local"
                  :rules="endDateRules"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="model.observations"
                  label="Observações"
                  placeholder="Informações adicionais sobre a prescrição"
                  rows="3"
                  auto-grow
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-end gap-3">
                  <VBtn
                    variant="outlined"
                    color="secondary"
                    :disabled="saving"
                    @click="router.push({ name: 'patient-medicines' })"
                  >
                    Cancelar
                  </VBtn>

                  <VBtn
                    type="submit"
                    color="primary"
                    prepend-icon="mdi-content-save"
                    :loading="saving"
                    :disabled="loading"
                  >
                    Salvar alterações
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { employeesApi } from '@/api/employees-api'
import { medicinePatientClinicalConditionsApi } from '@/api/medicine-patient-clinical-conditions-api'
import { medicinesApi } from '@/api/medicines-api'
import { patientClinicalConditionsApi } from '@/api/patient-clinical-conditions-api'
import { patientsApi } from '@/api/patients-api'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const saving = ref(false)
const loading = ref(false)
const loadingConditions = ref(false)
const loadError = ref('')

const medicineOptions = ref([])
const patientOptions = ref([])
const patientConditionOptions = ref([])
const employeeOptions = ref([])

const model = reactive({
  id: null,
  patientId: null,
  medicineId: null,
  patientClinicalConditionId: null,
  prescribedDosage: '',
  frequency: '',
  administrationTime: '',
  responsibleEmployeeId: null,
  startDate: '',
  endDate: '',
  observations: '',
})

const requiredRules = [
  value => value !== null && value !== undefined && value !== '' || 'Campo obrigatório',
]

const endDateRules = [
  value => !model.startDate || !value || new Date(value) >= new Date(model.startDate)
    || 'A data final deve ser igual ou posterior à data inicial',
]

const toDateTimeLocal = value => {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  const offset = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const toTimeInput = value => {
  if (!value) return ''

  if (typeof value === 'string')
    return value.slice(0, 5)

  return toDateTimeLocal(value).slice(11, 16)
}

const extractList = response => {
  const data = response?.data
  const nestedData = data?.data

  const list =
    Array.isArray(data)
      ? data
      : Array.isArray(nestedData)
        ? nestedData
        : nestedData?.items
          ?? nestedData?.patientClinicalConditions
          ?? nestedData?.patients
          ?? nestedData?.medicines
          ?? nestedData?.employees
          ?? data?.$values
          ?? []

  if (Array.isArray(list))
    return list

  return list?.$values ?? []
}

const getConditionTitle = item => {
  return item.clinicalConditionName
    ?? item.clinicalCondition?.name
    ?? item.clinicalCondition?.description
    ?? item.name
    ?? item.description
    ?? `Condição #${item.id}`
}

const loadPatientConditions = async patientId => {
  if (!patientId) {
    patientConditionOptions.value = []
    return
  }

  loadingConditions.value = true

  try {
    const ret = await patientClinicalConditionsApi.filter({
      page: 1,
      patientId,
    })

    const conditions = extractList(ret)

    patientConditionOptions.value = conditions.map(item => ({
      id: Number(item.id),
      title: getConditionTitle(item),
    }))
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar condições clínicas do acolhido.')
  } finally {
    loadingConditions.value = false
  }
}

const onPatientSelected = async patientId => {
  model.patientId = patientId
  model.patientClinicalConditionId = null

  await loadPatientConditions(patientId)
}

const loadOptions = async () => {
  const requests = await Promise.allSettled([
    medicinesApi.getAll(),
    employeesApi.getAll(),
    patientsApi.getAll(),
  ])

  const [medicinesResult, employeesResult, patientsResult] = requests

  if (medicinesResult.status === 'fulfilled') {
    medicineOptions.value = extractList(medicinesResult.value).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.description ?? `Medicamento #${item.id}`,
    }))
  }

  if (employeesResult.status === 'fulfilled') {
    employeeOptions.value = extractList(employeesResult.value).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.fullName ?? `Responsável #${item.id}`,
    }))
  }

  if (patientsResult.status === 'fulfilled') {
    patientOptions.value = extractList(patientsResult.value).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.fullName ?? `Acolhido #${item.id}`,
    }))
  }

  if (requests.some(result => result.status === 'rejected')) {
    loadError.value = 'Não foi possível carregar todas as opções. Tente atualizar a página.'
  }
}

const loadMedicinePatientClinicalCondition = async () => {
  const response = await medicinePatientClinicalConditionsApi.getById(route.params.id)
  const record = response?.data?.data ?? response?.data

  if (!record)
    throw new Error('Registro não encontrado.')

  model.id = Number(record.id)
  model.patientId = Number(record.patientId)
  model.medicineId = Number(record.medicineId)
  model.patientClinicalConditionId = Number(record.patientClinicalConditionId)
  model.prescribedDosage = record.prescribedDosage ?? ''
  model.frequency = record.frequency ?? ''
  model.administrationTime = toTimeInput(record.administrationTime)
  model.responsibleEmployeeId = record.responsibleEmployeeId ? Number(record.responsibleEmployeeId) : null
  model.startDate = record.startDate ? toDateTimeLocal(record.startDate) : ''
  model.endDate = record.endDate ? toDateTimeLocal(record.endDate) : ''
  model.observations = record.observations ?? ''

  return record
}

const loadData = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const record = await loadMedicinePatientClinicalCondition()

    await loadOptions()

    await loadPatientConditions(record.patientId)

    const selectedConditionExists = patientConditionOptions.value.some(
      item => item.id === Number(record.patientClinicalConditionId)
    )

    if (!selectedConditionExists && record.patientClinicalConditionId) {
      patientConditionOptions.value.push({
        id: Number(record.patientClinicalConditionId),
        title: record.clinicalConditionName ?? `Condição #${record.patientClinicalConditionId}`,
      })
    }
  } catch (error) {
    console.error('Erro ao carregar a prescrição:', error)
    loadError.value = 'Não foi possível carregar os dados da prescrição.'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid)
    return

  const administrationTime = model.administrationTime.length === 5
    ? `${model.administrationTime}:00`
    : model.administrationTime

  const payload = {
    id: Number(model.id),
    medicineId: Number(model.medicineId),
    patientClinicalConditionId: Number(model.patientClinicalConditionId),
    prescribedDosage: model.prescribedDosage.trim(),
    frequency: model.frequency.trim(),
    administrationTime,
    responsibleEmployeeId: Number(model.responsibleEmployeeId),
    startDate: new Date(model.startDate).toISOString(),
    endDate: model.endDate ? new Date(model.endDate).toISOString() : null,
    observations: model.observations.trim(),
  }

  saving.value = true

  try {
    await medicinePatientClinicalConditionsApi.update(payload)

    toast.success('Prescrição atualizada com sucesso.')

    await router.push({
      name: 'patient-medicines',
    })
  } catch (error) {
    console.error('Erro ao atualizar prescrição:', error)

    toast.error(
      error.response?.data?.errorMessage ??
      error.response?.data?.message ??
      'Não foi possível atualizar a prescrição.'
    )
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
