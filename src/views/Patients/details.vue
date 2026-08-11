<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="pa-6">
          <div class="d-flex justify-space-between align-center flex-wrap gap-4">
            <div class="d-flex align-center gap-4">
              <VAvatar
                color="primary"
                variant="tonal"
                size="64"
              >
                <VIcon
                  icon="mdi-account-heart"
                  size="34"
                />
              </VAvatar>

              <div>
                <div class="text-h4 font-weight-bold">
                  {{ patient.name || 'Acolhido' }}
                </div>

                <div class="text-body-2 text-medium-emphasis">
                  CPF: {{ patient.document || 'Não informado' }} 
                </div>
              </div>
            </div>

            <div class="d-flex gap-3">
              <VBtn
                variant="outlined"
                color="secondary"
                prepend-icon="mdi-arrow-left"
                @click="router.push({ name: 'patients' })"
              >
                Voltar
              </VBtn>

              <VBtn
                color="primary"
                prepend-icon="mdi-pencil"
                @click="router.push({ name: 'patient-update', params: { id: patient.id } })"
              >
                Editar
              </VBtn>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="3">
      <VCard>
        <VCardText>
          <div class="text-body-2 text-medium-emphasis">
            Idade
          </div>

          <div class="text-h5 font-weight-bold">
            {{ ageText }}
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="3">
      <VCard>
        <VCardText>
          <div class="text-body-2 text-medium-emphasis">
            Tipo sanguíneo
          </div>

          <div class="text-h5 font-weight-bold">
            {{ bloodType.name || '-' }}
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="3">
      <VCard>
        <VCardText>
          <div class="text-body-2 text-medium-emphasis">
            Condições clínicas
          </div>

          <div class="text-h5 font-weight-bold">
            {{ clinicalConditions.length }}
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="3">
      <VCard>
        <VCardText>
          <div class="text-body-2 text-medium-emphasis">
            Medicamentos
          </div>

          <div class="text-h5 font-weight-bold">
            {{ medicines.length }}
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VTabs v-model="tab" color="primary">
          <VTab value="general">
            Dados gerais
          </VTab>

          <VTab value="responsibles">
            Responsáveis
          </VTab>

          <VTab value="health">
            Saúde
          </VTab>

          <VTab value="medicines">
            Medicamentos
          </VTab>

          <VTab value="appointments">
            Agendamentos
          </VTab>

          <VTab value="services">
            Atendimentos
          </VTab>
        </VTabs>

        <VDivider />

        <VCardText>
          <VWindow v-model="tab">
            <VWindowItem value="general">
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    label="Nome"
                    :model-value="patient.name"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    label="CPF"
                    :model-value="patient.cpf"
                    readonly
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <VTextField
                    label="Documento"
                    :model-value="patient.document"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    label="Data de nascimento"
                    :model-value="formatDate(patient.birthDate)"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    label="Sexo"
                    :model-value="patient.gender"
                    readonly
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <VTextField
                    label="Tipo sanguíneo"
                    :model-value="bloodType.name || '-'"
                    readonly
                  />
                </VCol>

                <VCol cols="12">
                  <VTextarea
                    label="Observações"
                    :model-value="patient.observations"
                    readonly
                    rows="3"
                    auto-grow
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <VWindowItem value="responsibles">
              <VDataTable
                :headers="responsibleHeaders"
                :items="responsibles"
                :loading="loading"
                loading-text="Carregando..."
              >
                <template #[`item.phone`]="{ item }">
                  {{ item.phone || '-' }}
                </template>

                <template #[`item.relationship`]="{ item }">
                  {{ item.relationship || '-' }}
                </template>
              </VDataTable>
            </VWindowItem>

            <VWindowItem value="health">
              <VRow>
                <VCol cols="12" md="12">
                  <VCard variant="outlined">
                    <VCardTitle>
                      Condições clínicas
                    </VCardTitle>

                    <VDataTable
                      :headers="conditionHeaders"
                      :items="clinicalConditions"
                      :loading="loading"
                      hide-default-footer
                    >
                      <template #[`item.diagnosisDate`]="{ item }">
                        {{ formatDate(item.diagnosisDate) }}
                      </template>
                    </VDataTable>
                  </VCard>
                </VCol>

               
              </VRow>
            </VWindowItem>

            <VWindowItem value="medicines">
              <div class="d-flex justify-end mb-4">
                <VBtn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="router.push({ name: 'patient-medicines-new', query: { patientId: patient.id } })"
                >
                  Novo medicamento
                </VBtn>
              </div>

              <VDataTable
                :headers="medicineHeaders"
                :items="medicines"
                :loading="loading"
                loading-text="Carregando..."
              >
                <template #[`item.administrationTime`]="{ item }">
                  {{ formatTime(item.administrationTime) }}
                </template>

                <template #[`item.startDate`]="{ item }">
                  {{ formatDate(item.startDate) }}
                </template>

                <template #[`item.endDate`]="{ item }">
                  {{ formatDate(item.endDate) || "sem data final" }} 
                </template>
              </VDataTable>
            </VWindowItem>

            <VWindowItem value="appointments">
              <VDataTable
                :headers="appointmentHeaders"
                :items="appointments"
                :loading="loading"
                loading-text="Carregando..."
              >
                <template #[`item.date`]="{ item }">
                  {{ formatDateTime(item.date || item.appointmentDate) }}
                </template>
              </VDataTable>
            </VWindowItem>

            <VWindowItem value="services">
              <VDataTable
                :headers="careServiceHeaders"
                :items="careServices"
                :loading="loading"
                loading-text="Carregando..."
              >
                <template #[`item.date`]="{ item }">
                  {{ formatDateTime(item.date || item.serviceDate) }}
                </template>
              </VDataTable>
            </VWindowItem>
          </VWindow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { patientsApi } from '@/api/patients-api';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const tab = ref('general')

const patient = ref({})

const responsibles = ref([])
const clinicalConditions = ref([])
const illnesses = ref([])
const medicines = ref([])
const appointments = ref([])
const careServices = ref([])
const bloodType = ref({})

const responsibleHeaders = [
  { title: 'Nome', key: 'name' },
  { title: 'Telefone', key: 'phone' },
  { title: 'Parentesco', key: 'relationship' },
  { title: 'Endereço', key: 'address' },
]

const conditionHeaders = [
  { title: 'Condição', key: 'name' },
  { title: 'Categoria', key: 'type' },
  { title: 'Observações', key: 'description' },
]

const illnessHeaders = [
  { title: 'Doença', key: 'name' },
  { title: 'Observações', key: 'description' },
]

const medicineHeaders = [
  { title: 'Medicamento', key: 'name' },
  { title: 'Dosagem', key: 'dosage' },
  { title: 'Via de Administração', key: 'administrationRoute' },
  {title:'Descrição', key:'description'},
  { title: 'Horário', key: 'administrationTime' },
  { title: 'Início', key: 'startDate' },
  { title: 'Fim', key: 'endDate' },
]

const appointmentHeaders = [
  { title: 'Data', key: 'dateTime' },
  { title: 'Descrição', key: 'observations' },
  { title: 'Status', key: 'status' },
  { title: 'Tipo', key: 'appointmentType' },

]

const careServiceHeaders = [
  { title: 'Data', key: 'serviceDate' },
  { title: 'Tipo', key: 'type' },
  {title: 'Indicação', key:'referral'},
  { title: 'Descrição', key: 'description' },
]

const getData = response => response?.data?.data ?? response?.data ?? {}

const getArray = value => {
  if (Array.isArray(value))
    return value

  if (value?.$values)
    return value.$values

  return []
}

const loadPatient = async () => {
  loading.value = true

  try {
    const id = route.params.id
    const ret = await patientsApi.getPatientDetails(id)
    const data = getData(ret)

    patient.value = data.data ?? data.patient ?? data
    bloodType.value = data.bloodType 

    responsibles.value = getArray(data.responsibles)
    clinicalConditions.value = getArray(data.clinicalConditions ?? data.clinicalConditions)
    medicines.value = getArray(data.medicines ?? data.medicines ?? data.medicines)
    appointments.value = getArray(data.appointments)
    illnesses.value = getArray(data.illnesses)

    careServices.value = getArray(data.careService)
  } catch (error) {
    console.error('Erro ao carregar detalhes do acolhido:', error)
    toast.error('Não foi possível carregar os detalhes do acolhido.')
  } finally {
    loading.value = false
  }
}

const formatDate = value => {
  if (!value)
    return '-'

  return new Date(value).toLocaleDateString('pt-BR')
}

const formatDateTime = value => {
  if (!value)
    return '-'

  return new Date(value).toLocaleString('pt-BR')
}

const formatTime = value => {
  if (!value)
    return '-'

  if (typeof value === 'string')
    return value.substring(0, 5)

  return value
}

const ageText = computed(() => {
  if (!patient.value.birthDate)
    return '-'

  const birthDate = new Date(patient.value.birthDate)
  const today = new Date()

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()))
    age--

  return `${age} anos`
})

onMounted(() => {
  loadPatient()
})
</script>
