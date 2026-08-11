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
                  <VAutocomplete v-model="model.patientClinicalConditionDTO" label="Condição clínica"
                    :items="patientConditionOptions" item-title="title" item-value="id" return-object
                    :loading="loadingConditions" :disabled="!model.patientId" :rules="requiredRules" clearable
                    class="flex-grow-1" placeholder="Selecione uma condição clínica"
                    no-data-text="Nenhuma condição clínica encontrada para este acolhido" />

                  <VBtn icon="mdi-plus" color="primary" variant="tonal" :disabled="!model.patientId"
                    @click="conditionDialog = true" />
                </div>
              </VCol>

              <VCol cols="12" md="4">
                <div class="d-flex gap-2">
                  <VAutocomplete v-model="model.medicineDTO" label="Medicamento" :items="medicineOptions"
                    item-title="title" item-value="id" return-object :loading="loadingOptions" :rules="requiredRules"
                    clearable class="flex-grow-1" placeholder="Selecione um medicamento"
                    @update:model-value="onMedicineSelected" />

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
    <VCard title="Criar nova condição clínica">
      <VCardText>
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

          <VCol cols="12">
            <VBtn variant="tonal" color="secondary" class="me-4" @click="conditionDialog = false">
              Cancelar
            </VBtn>

            <VBtn variant="tonal" color="success" @click="addNewCondition">
              Criar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="medicineDialog" max-width="600">
    <VCard title="Criar novo medicamento">
      <VCardText>
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

          <VCol cols="12">
            <VBtn variant="tonal" color="secondary" class="me-4" @click="medicineDialog = false">
              Cancelar
            </VBtn>

            <VBtn variant="tonal" color="success" @click="addNewMedicine">
              Criar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { employeesApi } from '@/api/employees-api'
import { medicinePatientClinicalConditionsApi } from '@/api/medicine-patient-clinical-conditions-api'
import { medicinesApi } from '@/api/medicines-api'
import { patientClinicalConditionsApi } from '@/api/patient-clinical-conditions-api'
import { patientsApi } from '@/api/patients-api'
import { onMounted, ref } from 'vue'
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

const model = ref({
  patientId: null,

  medicineDTO: null,

  patientClinicalConditionDTO: null,

  responsibleEmployeeId: null,
  prescribedDosage: '',
  frequency: '',
  administrationTime: '',
  startDate: toDateTimeLocal(new Date()),
  endDate: '',
  observations: '',
})

const newCondition = ref({
  name: '',
  type: 'Clínica',
  description: '',
})

const newMedicine = ref({
  name: '',
  dosage: '',
  description: '',
  administrationRoute: 'Oral',
})

const requiredRules = [
  value => value !== null && value !== undefined && value !== '' || 'Campo obrigatório',
]

const endDateRules = [
  value => !model.value.startDate || !value || new Date(value) >= new Date(model.value.startDate)
    || 'A data final deve ser igual ou posterior à data inicial',
]

const getData = response => response.data.data ?? response.data

const getList = response => {
  const data = getData(response)

  if (Array.isArray(data))
    return data

  if (data)
    return [data]

  return []
}

const loadOptions = async () => {
  loadingOptions.value = true
  loadError.value = ''

  try {
    const patientsRet = await patientsApi.getAll()
    const medicinesRet = await medicinesApi.getAll()
    const employeesRet = await employeesApi.getAll()

    patientOptions.value = getList(patientsRet).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.fullName ?? `Acolhido #${item.id}`,
    }))

    medicineOptions.value = getList(medicinesRet).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.description ?? `Medicamento #${item.id}`,
      name: item.name,
      dosage: item.dosage,
      description: item.description,
      administrationRoute: item.administrationRoute,
    }))

    employeeOptions.value = getList(employeesRet).map(item => ({
      id: Number(item.id),
      title: item.name ?? item.fullName ?? `Responsável #${item.id}`,
    }))
  } catch (error) {
    console.error(error)
    loadError.value = 'Não foi possível carregar todas as opções. Tente atualizar a página.'
  } finally {
    loadingOptions.value = false
  }
}

const onPatientSelected = async patientId => {
  model.value.patientId = patientId
  model.value.patientClinicalConditionDTO = null

  await loadPatientConditions(patientId)
}

const loadPatientConditions = async patientId => {
  patientConditionOptions.value = []

  if (!patientId)
    return

  loadingConditions.value = true

  try {
    const ret = await patientClinicalConditionsApi.getByPatientId(patientId)

    patientConditionOptions.value = getList(ret).map(item => ({
      id: Number(item.id),
      clinicalConditionId: Number(item.clinicalConditionId),
      title: item.clinicalCondition ?? `Condição #${item.id}`,
      name: item.clinicalCondition,
      type: '',
      description: item.observations,
    }))

    if (!patientConditionOptions.value.length) {
      toast.warning('Esse acolhido ainda não possui condição clínica cadastrada. Você pode criar uma nova no botão +.')
    }
  } catch (error) {
    console.error(error)
    toast.error('Não foi possível carregar as condições clínicas do acolhido.')
  } finally {
    loadingConditions.value = false
  }
}

const onMedicineSelected = selected => {
  model.value.medicineDTO = selected

  if (selected?.dosage && !model.value.prescribedDosage) {
    model.value.prescribedDosage = selected.dosage
  }
}

const addNewCondition = () => {
  if (!model.value.patientId) {
    toast.warning('Selecione um acolhido antes de adicionar uma condição clínica.')
    return
  }

  if (!newCondition.value.name?.trim()) {
    toast.warning('Informe o nome da condição clínica.')
    return
  }

  const condition = {
    id: 0,
    clinicalConditionId: 0,
    title: `${newCondition.value.name.trim()} (nova)`,
    name: newCondition.value.name.trim(),
    type: newCondition.value.type?.trim() || 'Clínica',
    description: newCondition.value.description?.trim() || newCondition.value.name.trim(),
  }

  patientConditionOptions.value.push(condition)

  model.value.patientClinicalConditionDTO = condition

  conditionDialog.value = false

  newCondition.value = {
    name: '',
    type: 'Clínica',
    description: '',
  }
}

const addNewMedicine = () => {
  if (!newMedicine.value.name?.trim()) {
    toast.warning('Informe o nome do medicamento.')
    return
  }

  if (!newMedicine.value.dosage?.trim()) {
    toast.warning('Informe a dosagem do medicamento.')
    return
  }

  if (!newMedicine.value.administrationRoute) {
    toast.warning('Informe a via de administração.')
    return
  }

  const medicine = {
    id: 0,
    title: `${newMedicine.value.name.trim()} - ${newMedicine.value.dosage.trim()} (novo)`,
    name: newMedicine.value.name.trim(),
    dosage: newMedicine.value.dosage.trim(),
    description: newMedicine.value.description?.trim() || newMedicine.value.name.trim(),
    administrationRoute: newMedicine.value.administrationRoute,
  }

  medicineOptions.value.push(medicine)

  model.value.medicineDTO = medicine

  if (!model.value.prescribedDosage) {
    model.value.prescribedDosage = medicine.dosage
  }

  medicineDialog.value = false

  newMedicine.value = {
    name: '',
    dosage: '',
    description: '',
    administrationRoute: 'Oral',
  }
}

const submit = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid)
    return

  saving.value = true

  try {
    const administrationTime = model.value.administrationTime.length === 5
      ? `${model.value.administrationTime}:00`
      : model.value.administrationTime

    const selectedCondition = model.value.patientClinicalConditionDTO

    const clinicalConditionDTO = {
      id: Number(selectedCondition.clinicalConditionId),
      name: selectedCondition.name,
      type: selectedCondition.type,
      description: selectedCondition.description,
    }

    const payload = {
      patientId: Number(model.value.patientId),

      medicineDTO: {
        id: Number(model.value.medicineDTO.id),
        name: model.value.medicineDTO.name,
        dosage: model.value.medicineDTO.dosage,
        description: model.value.medicineDTO.description,
        administrationRoute: model.value.medicineDTO.administrationRoute,
      },

      clinicalConditionDTO: {
        id: Number(selectedCondition.clinicalConditionId),
        name: selectedCondition.name,
        description: selectedCondition.description,
        type: selectedCondition.type,
      },

      patientClinicalConditionDTO: {
        id: Number(selectedCondition.id),
        clinicalCondition: selectedCondition.name,
        patientId: Number(model.value.patientId),
        clinicalConditionId: Number(selectedCondition.clinicalConditionId),
        diagnosisDate: new Date().toISOString(),
        observations: selectedCondition.description || '',
      },

      responsibleEmployeeId: Number(model.value.responsibleEmployeeId),
      prescribedDosage: model.value.prescribedDosage.trim(),
      frequency: model.value.frequency.trim(),
      administrationTime,
      startDate: new Date(model.value.startDate).toISOString(),
      endDate: model.value.endDate ? new Date(model.value.endDate).toISOString() : null,
      observations: model.value.observations?.trim() || '',
    }

    await medicinePatientClinicalConditionsApi.create(payload)

    toast.success('Medicamento programado cadastrado com sucesso.')

    await router.push({ name: 'patient-reminders' })
  } catch (error) {
    console.error('Erro ao cadastrar medicamento programado:', error)

    toast.error(
      error.response?.data?.errorMessage
      ?? error.response?.data?.message
      ?? error.message
      ?? 'Não foi possível cadastrar o medicamento programado.'
    )
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadOptions()
})
</script>
