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
                {{ user.userType }}
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
const accountLoaded = ref(false)
const user = ref({})
const institutionName = ref('')

const model = ref({
  id: 0,
  userId: 0,
  name: '',
  email: '',
  password: '',
  userType: '',
  lastLogin: null,
  active: true,
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
    ...model.value,
    name: user.value.name || '',
    email: user.value.email || '',
  }
  formRef.value?.resetValidation()
}

const resolveLoginAccountId = async currentUser => {
  if (currentUser.id) return currentUser.id

  const response = await loginAccountsApi.getAll()
  const data = response?.data?.data ?? response?.data
  const accounts = Array.isArray(data)
    ? data
    : data?.loginAccounts ?? data?.accounts ?? data?.items ?? data?.$values ?? []
  const normalizedEmail = String(currentUser.email ?? '').trim().toLowerCase()
  const account = accounts.find(item =>
    (currentUser.userId && Number(item.userId) === Number(currentUser.userId))
    || (normalizedEmail && String(item.email ?? '').trim().toLowerCase() === normalizedEmail),
  )
  const id = account?.id ?? account?.loginAccountId ?? account?.idLoginAccount

  if (!id) throw new Error('Não foi possível identificar o id da conta de login.')

  const updatedUser = { ...currentUser, id }
  auth._user = updatedUser
  auth.saveUserStorage(updatedUser)
  user.value = updatedUser

  return id
}

const loadLoginAccount = async id => {
  if (!id) throw new Error('Id da conta de login não informado.')

  const response = await loginAccountsApi.getById(id)
  const account = response?.data?.data ?? response?.data

  if (!account) throw new Error('Dados da conta não retornados pela API.')

  model.value = {
    id: account.id ?? id,
    userId: account.userId ?? user.value.userId,
    name: account.name || user.value.name || '',
    email: account.email || user.value.email || '',
    password: account.password || '',
    userType: account.userType || user.value.userType || '',
    lastLogin: account.lastLogin ?? Date.Now,
    active: account.active ?? true,
  }
  accountLoaded.value = true
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
  accountLoaded.value = false
  try {
    const result = await auth.getUser()

    if (!result.isOk) {
      toast.error('Não foi possível carregar os dados do usuário.')
      
      return
    }

    user.value = result.data

    try {
      const loginAccountId = await resolveLoginAccountId(result.data)
      await loadLoginAccount(loginAccountId)
    } catch (error) {
      console.error('Erro ao carregar a conta de login:', error)
      toast.error('Não foi possível carregar os dados completos da conta.')
      resetForm()
    }

    if (result.data.institutionId) {
      await loadInstitution(result.data.institutionId)
    }
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  if (!accountLoaded.value) {
    toast.error('Aguarde o carregamento completo da conta.')

    return
  }

  const { valid } = await formRef.value.validate()

  if (!valid) return

  saving.value = true

  try {
    await loginAccountsApi.update(model.value.id, { ...model.value })

    const updatedUser = {
      ...user.value,
      name: model.value.name,
      email: model.value.email,
      userType: model.value.userType,
    }

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
