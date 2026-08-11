<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VAvatar color="primary" variant="tonal">
            <VIcon icon="mdi-account-plus" />
          </VAvatar>

          <div>
            <div class="text-h5 font-weight-bold">Novo acolhido</div>
            <div class="text-body-2 text-medium-emphasis">
              Cadastre o acolhido e seus responsáveis.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VAlert v-if="loadError" type="warning" variant="tonal" class="mb-6">
            {{ loadError }}
          </VAlert>

          <VForm ref="formRef" @submit.prevent="submit">
            <div class="text-h6 mb-4">Dados do acolhido</div>

            <VRow>
              <VCol cols="12" md="6">
                <VTextField v-model="model.name" label="Nome completo" :rules="requiredRules" />
              </VCol>

              <VCol cols="12" md="3">
                <VTextField v-model="model.birthDate" label="Data de nascimento" type="date" :rules="requiredRules" />
              </VCol>

              <VCol cols="12" md="3">
                <VSelect v-model="model.gender" label="Sexo" :items="genderOptions" :rules="requiredRules" />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.phone" label="Telefone" />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.cpf" label="CPF" />
              </VCol>

              <VCol cols="12" md="4">
                <VTextField v-model="model.document" label="Documento" />
              </VCol>

              <VCol cols="12" md="4">
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
                <VTextarea v-model="model.observations" label="Observações" rows="3" auto-grow />
              </VCol>
            </VRow>

            <VDivider class="my-6" />

            <div class="d-flex align-center justify-space-between mb-4">
              <div>
                <div class="text-h6">Responsáveis</div>
                <div class="text-body-2 text-medium-emphasis">
                  Informe ao menos um responsável pelo acolhido.
                </div>
              </div>

              <VBtn color="primary" variant="tonal" prepend-icon="mdi-plus" @click="addResponsible">
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
                  <VCol cols="12" md="6">
                    <VTextField v-model="responsible.name" label="Nome completo" :rules="requiredRules" />
                  </VCol>

                  <VCol cols="12" md="3">
                    <VTextField v-model="responsible.phone" label="Telefone" :rules="requiredRules" />
                  </VCol>

                  <VCol cols="12" md="3">
                    <VTextField v-model="responsible.relationship" label="Parentesco" :rules="requiredRules" />
                  </VCol>

                  <VCol cols="12">
                    <VTextField v-model="responsible.address" label="Endereço" :rules="requiredRules" />
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>

            <div class="d-flex justify-end gap-3 mt-6">
              <VBtn variant="outlined" color="secondary" :disabled="saving" @click="router.push({ name: 'patients' })">
                Cancelar
              </VBtn>

              <VBtn type="submit" color="primary" prepend-icon="mdi-content-save" :loading="saving" :disabled="loadingOptions">
                Salvar acolhido
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { bloodTypesApi } from '@/api/blood-types-api';
import { patientsApi } from '@/api/patients-api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';
const router = useRouter()
const formRef = ref()
const saving = ref(false)
const loadingOptions = ref(false)
const loadError = ref('')
const bloodTypeOptions = ref([])

const genderOptions = ['Feminino', 'Masculino', 'Outro']
const requiredRules = [value => value !== null && value !== undefined && value !== '' || 'Campo obrigatório']

const newResponsible = () => ({
  patientId: 0,
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
  responsibles: [newResponsible()],
})
const  getBlodTypes = async () => {
  try {
    const response = await bloodTypesApi.getAll()
    const data = response?.data?.data ?? response?.data
    const items = Array.isArray(data) ? data : data?.items ?? data?.data ?? []

    bloodTypeOptions.value = items.map(item => ({
      id: Number(item.id),
      title: item.name ?? item.description ?? `Tipo #${item.id}`,
    }))
  } catch (error) {
    console.error('Erro ao carregar tipos sanguíneos:', error)
    loadError.value = 'Não foi possível carregar os tipos sanguíneos.'
  }
}
const getData = response => response?.data?.data ?? response?.data


const addResponsible = () => model.value.responsibles.push(newResponsible())
const removeResponsible = index => model.value.responsibles.splice(index, 1)

const submit = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid)
    return

  saving.value = true

  try {
    const payload = {
      id: 0,
      name: model.value.name.trim(),
      birthDate: new Date(`${model.value.birthDate}T00:00:00`).toISOString(),
      phone: model.value.phone?.trim() || '',
      document: model.value.document?.trim() || '',
      gender: model.value.gender,
      cpf: model.value.cpf?.trim() || '',
      observations: model.value.observations?.trim() || '',
      bloodTypeId: Number(model.value.bloodTypeId),
      responsibles: model.value.responsibles.map(responsible => ({
        patientId: 0,
        name: responsible.name.trim(),
        phone: responsible.phone.trim(),
        relationship: responsible.relationship.trim(),
        address: responsible.address.trim(),
      })),
    }

    await patientsApi.create(payload)

    toast.success('Acolhido e responsável cadastrados com sucesso.')
    await router.push({ name: 'patients' })
  } catch (error) {
    console.error('Erro ao cadastrar acolhido:', error)
    toast.error(
      error.response?.data?.errorMessage
      ?? error.response?.data?.message
      ?? error.message
      ?? 'Não foi possível cadastrar o acolhido.'
    )
  } finally {
    saving.value = false
  }
}
onMounted(( ) => {
  getBlodTypes()
})

</script>
