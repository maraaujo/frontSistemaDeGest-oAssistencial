<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VProgressLinear
          v-if="loading"
          indeterminate
        />

        <VCardText
          v-else
          class="pa-6"
        >
          <div class="d-flex flex-column flex-sm-row align-center align-sm-end gap-6">
            <VAvatar
              size="96"
              color="primary"
              variant="tonal"
            >
              <VImg
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
              />
              <span
                v-else
                class="text-h4 font-weight-bold"
              >
                {{ initials }}
              </span>
            </VAvatar>

            <div class="text-center text-sm-start">
              <div class="text-h5 font-weight-bold">
                {{ user.name || 'Usuário' }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ user.email }}
              </div>
              <VChip
                size="small"
                variant="tonal"
                color="primary"
                class="mt-2"
              >
                {{ roleLabel }}
              </VChip>
            </div>
          </div>

          <VDivider class="my-6" />

          <div class="text-h6 mb-4">
            Informações da conta
          </div>

          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                E-mail
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ user.email || 'Não informado' }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Tipo de usuário
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ user.userType || 'Não informado' }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Instituição
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ institutionName || (user.institutionId ? user.institutionId : 'Administração') }}
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

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
              Editar perfil
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Atualize suas informações pessoais.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VProgressLinear
            v-if="loading"
            indeterminate
            class="mb-6"
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
                md="6"
              >
                <VTextField
                  v-model="model.email"
                  label="E-mail"
                  type="email"
                  :rules="[...requiredRules, emailRule]"
                />
              </VCol>
            </VRow>

            <VDivider class="my-6" />

            <div class="d-flex justify-end gap-3">
              <VBtn
                variant="outlined"
                color="secondary"
                :disabled="saving"
                @click="resetForm"
              >
                Cancelar
              </VBtn>

              <VBtn
                color="primary"
                prepend-icon="mdi-content-save"
                :loading="saving"
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
import { institutionsApi } from '@/api/institutions-api'
import { loginAccountsApi } from '@/api/login-accounts-api'
import auth from '@/auth'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const formRef = ref()
const loading = ref(true)
const saving = ref(false)
const user = ref({})
const institutionName = ref('')

const model = ref({
  name: '',
  email: '',
})

const requiredRules = [
  v => !!v || 'Este campo é obrigatório',
]

const emailRule = v => {
  return !v || /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(v) || 'E-mail inválido'
}

const roleLabel = computed(() => user.value.institutionId ? 'Colaborador' : 'Administrador')

const initials = computed(() => {
  const source = user.value.name || user.value.email || ''
  
  return source.trim().charAt(0).toUpperCase() || '?'
})

const resetForm = () => {
  model.value = {
    name: user.value.name || '',
    email: user.value.email || '',
  }
  formRef.value?.resetValidation()
}

const loadInstitution = async institutionId => {
  try {
    const response = await institutionsApi.getById(institutionId)
    const data = response?.data?.data ?? response?.data

    institutionName.value = data?.name || ''
  } catch (error) {
    console.error('Erro ao carregar instituição:', error)
  }
}

const loadProfile = async () => {
  loading.value = true
  try {
    const result = await auth.getUser()

    if (!result.isOk) {
      toast.error('Não foi possível carregar os dados do usuário.')
      
      return
    }

    user.value = result.data
    resetForm()

    if (result.data.institutionId) {
      await loadInstitution(result.data.institutionId)
    }
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  saving.value = true

  try {
    await loginAccountsApi.update(user.value.userId, model.value)

    const updatedUser = { ...user.value, ...model.value }

    auth._user = updatedUser
    auth.saveUserStorage(updatedUser)
    user.value = updatedUser

    toast.success('Perfil atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    toast.error('Não foi possível atualizar o perfil.')
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>
