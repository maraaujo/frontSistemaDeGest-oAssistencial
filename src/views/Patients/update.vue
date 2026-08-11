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
              Atualize os dados do acolhido.
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
                  v-model="model.idBloodType"
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

            <VDivider class="my-6" />

            <div class="d-flex align-center justify-space-between mb-4">
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
              :key="responsible.id || `new-${index}`"
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

            <div class="d-flex justify-end gap-3 mt-6">
              <VBtn
                variant="outlined"
                color="secondary"
                :disabled="saving"
                @click="cancel"
              >
                Cancelar
              </VBtn>

              <VBtn
                type="button"
                color="primary"
                prepend-icon="mdi-content-save"
                :loading="saving"
                :disabled="saving || loadingOptions"
                @click="submit"
              >
                Salvar alterações
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { bloodTypesApi } from '@/api/blood-types-api'
import { patientsApi } from '@/api/patients-api'
import { responsiblesApi } from '@/api/responsibles-api'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(true)
const loadingOptions = ref(false)
const saving = ref(false)
const loadError = ref('')
const bloodTypeOptions = ref([])

const genderOptions = ['Feminino', 'Masculino', 'Outro']
const requiredRules = [value => value !== null && value !== undefined && value !== '' || 'Campo obrigatório']

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
  document: '',
  phone: '',
  idBloodType: null,
  birthDate: '',
  gender: '',
  cpf: '',
  observations: '',
  responsibles: [],
})

const getData = response => response?.data?.data ?? response?.data ?? {}

const formatDateInput = value => {
  if (!value)
    return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime()))
    return String(value).slice(0, 10)

  return date.toISOString().slice(0, 10)
}

const loadBloodTypes = async () => {
  loadingOptions.value = true

  try {
    const data = getData(await bloodTypesApi.getAll())
    const items = Array.isArray(data) ? data : data?.items ?? data?.data ?? []

    bloodTypeOptions.value = items.map(item => ({
      id: Number(item.id),
      title: item.name ?? item.description ?? `Tipo #${item.id}`,
    }))
  } catch (error) {
    console.error('Erro ao carregar tipos sanguíneos:', error)
    loadError.value = 'Não foi possível carregar os tipos sanguíneos.'
  } finally {
    loadingOptions.value = false
  }
}

const loadPatient = async () => {
  try {
    const data = getData(await patientsApi.getPatientDetails(route.params.id))
    const patient = data?.data ?? data?.patient ?? data
    const bloodType = data?.bloodType ?? patient?.bloodType

    model.value = {
      id: Number(patient.id ?? route.params.id),
      name: patient.name ?? '',
      document: patient.document ?? '',
      phone: patient.phone ?? '',
      idBloodType: Number(bloodType?.id ?? patient.idBloodType ?? patient.bloodTypeId) || null,
      birthDate: formatDateInput(patient.birthDate),
      gender: patient.gender ?? '',
      cpf: patient.cpf ?? '',
      observations: patient.observations ?? '',
      responsibles: (Array.isArray(data?.responsibles) ? data.responsibles : []).map(responsible => ({
        id: Number(responsible.id),
        patientId: Number(patient.id ?? route.params.id),
        name: responsible.name ?? '',
        phone: responsible.phone ?? '',
        relationship: responsible.relationship ?? '',
        address: responsible.address ?? '',
      })),
    }

    if (!model.value.responsibles.length)
      model.value.responsibles.push(newResponsible())
  } catch (error) {
    console.error('Erro ao carregar acolhido:', error)
    loadError.value = 'Não foi possível carregar os dados do acolhido.'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid) {
    toast.warning('Preencha os campos obrigatórios antes de salvar.')

    return
  }

  saving.value = true

  try {
    const payload = {
      id: Number(model.value.id),
      name: model.value.name.trim(),
      document: model.value.document?.trim() || '',
      responsible: model.value.responsibles[0]?.name?.trim() || '',
      phone: model.value.phone?.trim() || '',
      idBloodType: Number(model.value.idBloodType),
      birthDate: new Date(`${model.value.birthDate}T00:00:00`).toISOString(),
      gender: model.value.gender,
      cpf: model.value.cpf?.trim() || '',
      observations: model.value.observations?.trim() || '',
    }

    await patientsApi.update(model.value.id, payload)

    await Promise.all(model.value.responsibles.map(responsible => {
      const responsiblePayload = {
        id: Number(responsible.id),
        patientId: Number(model.value.id),
        name: responsible.name.trim(),
        phone: responsible.phone.trim(),
        relationship: responsible.relationship.trim(),
        address: responsible.address.trim(),
      }

      return responsible.id
        ? responsiblesApi.update(responsible.id, responsiblePayload)
        : responsiblesApi.create(responsiblePayload)
    }))
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

const addResponsible = () => model.value.responsibles.push(newResponsible())
const removeResponsible = index => model.value.responsibles.splice(index, 1)

const cancel = () => router.push({ name: 'patient-details', params: { id: model.value.id || route.params.id } })

onMounted(async () => {
  await Promise.all([loadBloodTypes(), loadPatient()])
})
</script>
