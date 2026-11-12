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
                        placeholder="(00) 00000-0000"
                        :rules="phoneRules()"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="4"
                    >
                      <VTextField
                        v-model="model.cpf"
                        label="CPF"
                        placeholder="000.000.000-00"
                        :rules="cpfRules()"
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
                            :rules="[...requiredRules, ...phoneRules()]"
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
import { ensureSuccessfulResponse } from '@/utils/apiResponse'
import { cpfRules, formatCpf, formatPhone, phoneRules } from '@/utils/validators'
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

/**
 * Cria um responsável vazio (id 0) já vinculado ao acolhido da rota,
 * usado como linha nova na etapa "Responsáveis".
 */
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

/**
 * Extrai o conteúdo útil da resposta da API (`data.data`, senão `data`).
 */
const getData = response => response?.data?.data ?? response?.data

/**
 * Normaliza o valor para array: aceita array puro, o formato `$values` do .NET
 * ou um objeto único (vira array de um item); vazio vira [].
 */
const getList = value => {
  if (Array.isArray(value))
    return value

  if (value?.$values)
    return value.$values

  return value ? [value] : []
}

/**
 * Converte uma data vinda da API para o formato "aaaa-mm-dd" aceito pelo input de data.
 * A API devolve o horário de parede (ex.: "2026-05-10T23:59:59"), então o dia é lido
 * direto do texto. Converter para UTC (toISOString) aqui empurraria as datas de fim
 * de dia para o dia seguinte.
 */
const formatDateInput = value => {
  if (!value)
    return ''

  const text = String(value)

  if (/^\d{4}-\d{2}-\d{2}/.test(text))
    return text.slice(0, 10)

  const date = new Date(value)

  if (Number.isNaN(date.getTime()))
    return text.slice(0, 10)

  const pad = number => String(number).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Converte um horário em texto para "HH:mm" (formato do input de hora),
 * ex.: "08:00:00" vira "08:00"; vazio vira ''.
 */
const formatTimeInput = value => {
  if (!value)
    return ''

  if (typeof value === 'string')
    return value.slice(0, 5)

  return value
}

/**
 * Avança para a próxima etapa da edição (sem validar o formulário), se não estiver na última.
 */
const goNext = () => {
  if (currentStep.value < steps.length)
    currentStep.value += 1
}

/**
 * Volta para a etapa anterior da edição, se não estiver na primeira.
 */
const goBack = () => {
  if (currentStep.value > 1)
    currentStep.value -= 1
}

/**
 * Busca os tipos sanguíneos na API e preenche as opções do select ({ id, title }).
 * Em caso de erro, preenche `loadError`.
 */
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

/**
 * Busca todas as condições clínicas cadastradas e preenche as opções ({ id, name })
 * para adicionar ao acolhido. Em caso de erro, preenche `loadError`.
 */
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

/**
 * Busca os medicamentos cadastrados e preenche as opções ({ id, name }) da
 * etapa "Medicamentos". Em caso de erro, preenche `loadError`.
 */
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

/**
 * Busca os funcionários e preenche as opções ({ id, name }) do responsável pela
 * administração do medicamento. Em caso de erro, preenche `loadError`.
 */
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

/**
 * Busca os detalhes do acolhido da rota (`patientsApi.getPatientDetails`) e preenche
 * o formulário: dados pessoais (CPF e telefone com máscara, datas no formato do input),
 * responsáveis e medicamentos programados (cada um com o id da sua prescrição).
 * Em erro, preenche `loadError`.
 */
const loadPatient = async () => {
  try {
    const id = route.params.id
    const data = getData(await patientsApi.getPatientDetails(id))
    const patient = data?.data ?? data?.patient ?? data
    const bloodType = data?.bloodType ?? patient?.bloodType

    model.value.id = Number(patient.id ?? id)
    model.value.name = patient.name ?? ''
    model.value.document = patient.document ?? ''

    // O backend agora armazena CPF/telefone só com dígitos; exibe com máscara.
    model.value.phone = formatPhone(patient.phone ?? '')
    model.value.bloodTypeId = Number(bloodType?.id ?? patient.bloodTypeId ?? patient.idBloodType) || null
    model.value.birthDate = formatDateInput(patient.birthDate)
    model.value.gender = patient.gender ?? ''
    model.value.cpf = formatCpf(patient.cpf ?? '')
    model.value.observations = patient.observations ?? ''

    model.value.responsibles = getList(data?.responsibles).map(responsible => ({
      id: Number(responsible.id) || 0,
      patientId: Number(patient.id ?? id),
      name: responsible.name ?? '',
      phone: formatPhone(responsible.phone ?? ''),
      relationship: responsible.relationship ?? '',
      address: responsible.address ?? '',
    }))

    // `scheduledMedicines` traz cada prescrição com o seu próprio id. Esse id volta no
    // payload para o backend ATUALIZAR a prescrição; sem ele (id 0) o backend entende
    // que é um medicamento novo e a prescrição seria duplicada a cada edição.
    // `medicines` é o formato antigo (sem id da prescrição), mantido como reserva.
    const hasScheduledMedicines = data?.scheduledMedicines !== undefined && data?.scheduledMedicines !== null

    model.value.scheduledMedicines = getList(hasScheduledMedicines ? data.scheduledMedicines : data?.medicines).map(medicine => ({
      id: hasScheduledMedicines ? Number(medicine.id) || 0 : 0,
      medicineId: Number(medicine.medicineId ?? medicine.id),
      medicineName: medicine.medicineName ?? medicine.name ?? '',
      patientClinicalConditionId: Number(medicine.patientClinicalConditionId) || 0,
      clinicalConditionId: Number(medicine.clinicalConditionId) || null,
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

/**
 * Busca as condições clínicas já vinculadas ao acolhido
 * (`patientClinicalConditionsApi.getByPatientId`) e preenche a lista do formulário.
 * Em erro, apenas registra no console.
 */
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

/**
 * Adiciona um responsável em branco à lista de responsáveis do acolhido.
 */
const addResponsible = () => model.value.responsibles.push(newResponsible())

/**
 * Remove da lista o responsável na posição informada.
 * @param {number} index Posição do responsável na lista.
 */
const removeResponsible = index => model.value.responsibles.splice(index, 1)

/**
 * Adiciona a condição clínica selecionada (com data de diagnóstico e observações)
 * à lista local e limpa os campos. Avisa se nenhuma condição foi escolhida.
 * Nada é enviado à API aqui; o envio acontece no `submit`.
 */
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

/**
 * Remove da lista local a condição clínica na posição informada.
 * @param {number} index Posição da condição na lista.
 */
const removeClinicalCondition = index => model.value.clinicalConditions.splice(index, 1)

/**
 * Adiciona à lista local um medicamento programado (medicamento, condição clínica
 * relacionada, dosagem, frequência, horário, responsável e período) e limpa o formulário.
 * Exige medicamento e condição clínica selecionados; o envio à API ocorre no `submit`.
 */
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
    patientClinicalConditionId: Number(selectedMedicineClinicalCondition.value.id) || 0,
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

/**
 * Remove da lista local o medicamento programado na posição informada.
 * @param {number} index Posição do medicamento na lista.
 */
const removeScheduledMedicine = index => model.value.scheduledMedicines.splice(index, 1)

/**
 * Cancela a edição e volta para a tela de detalhes do acolhido, sem salvar.
 */
const cancel = () => router.push({ name: 'patient-details', params: { id: model.value.id || route.params.id } })

/**
 * Valida o formulário e, se válido, monta o payload completo do acolhido
 * (dados, responsáveis, condições clínicas e medicamentos, com datas em ISO e
 * horário em HH:mm:ss) e envia para `patientsApi.update`. Se der certo, mostra
 * toast e volta para os detalhes; se a validação falhar, volta para a etapa 1.
 */
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

    const payload = {
      id: patientId,
      name: model.value.name.trim(),
      birthDate: new Date(`${model.value.birthDate}T00:00:00`).toISOString(),
      phone: model.value.phone?.trim() || '',
      document: model.value.document?.trim() || '',
      gender: model.value.gender,
      cpf: model.value.cpf?.trim() || '',
      observations: model.value.observations?.trim() || '',
      bloodTypeId: Number(model.value.bloodTypeId),
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
        patientClinicalConditionId: Number(medicine.patientClinicalConditionId) || 0,
        clinicalConditionId: Number(medicine.clinicalConditionId) || 0,
        prescribedDosage: medicine.prescribedDosage,
        frequency: medicine.frequency,
        administrationTime: medicine.administrationTime
          ? (medicine.administrationTime.length === 5 ? `${medicine.administrationTime}:00` : medicine.administrationTime)
          : null,
        responsibleEmployeeId: Number(medicine.responsibleEmployeeId) || 0,

        // Datas no horário de parede (sem converter para UTC): o backend guarda o
        // horário local, e o fim do período vale até o último segundo do dia.
        startDate: medicine.startDate ? `${medicine.startDate}T00:00:00` : null,
        endDate: medicine.endDate ? `${medicine.endDate}T23:59:59` : null,
        observations: medicine.observations,
      })),
    }

    const response = await patientsApi.update(model.value.id, payload)

    ensureSuccessfulResponse(response, 'Não foi possível atualizar o acolhido.')

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

// Ao abrir a tela, carrega em paralelo as opções dos selects, os dados do acolhido e suas condições clínicas.
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
