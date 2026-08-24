<template>
  <VRow justify="center">
    <VCol cols="12" lg="9" xl="7">
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VAvatar color="primary" variant="tonal">
            <VIcon icon="mdi-account-plus-outline" />
          </VAvatar>

          <div>
            <h1 class="text-h5 font-weight-bold">Criar conta de acesso</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Cadastre uma conta e defina seu nível de acesso ao sistema.
            </p>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VAlert
            type="info"
            variant="tonal"
            class="mb-6"
            text="A nova conta poderá acessar o sistema imediatamente após o cadastro."
          />

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
              <VCol cols="12" md="6">
                <VTextField
                  v-model.trim="model.nome"
                  label="Nome completo"
                  autocomplete="name"
                  prepend-inner-icon="mdi-account-outline"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField
                  v-model.trim="model.email"
                  label="E-mail"
                  type="email"
                  autocomplete="email"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="emailRules"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VCombobox
                  v-model="model.userType"
                  label="Tipo de usuário"
                  :items="userTypeOptions"
                  prepend-inner-icon="mdi-shield-account-outline"
                  :rules="requiredRules"
                  hint="Selecione uma opção ou informe o tipo aceito pela API."
                  persistent-hint
                />
              </VCol>

              <VCol cols="12" md="6">
                <VAutocomplete
                  v-model="model.institutionId"
                  label="Instituição"
                  :items="institutions"
                  item-title="name"
                  item-value="id"
                  prepend-inner-icon="mdi-domain"
                  :loading="loadingInstitutions"
                  :disabled="!isPlatformAdmin"
                  :rules="institutionRules"
                  clearable
                  no-data-text="Nenhuma instituição encontrada"
                  hint="Use Administração geral para uma conta sem instituição."
                  persistent-hint
                />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField
                  v-model="model.password"
                  label="Senha"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  :rules="passwordRules"
                  counter
                  @click:append-inner="showPassword = !showPassword"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField
                  v-model="passwordConfirmation"
                  label="Confirmar senha"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showPasswordConfirmation ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  :rules="confirmationRules"
                  @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
                />
              </VCol>
            </VRow>

            <VDivider class="my-6" />

            <div class="d-flex flex-column-reverse flex-sm-row justify-end gap-3">
              <VBtn
                variant="outlined"
                color="secondary"
                :disabled="saving"
                @click="router.push({ name: 'admin-accounts' })"
              >
                Cancelar
              </VBtn>

              <VBtn
                type="submit"
                color="primary"
                prepend-icon="mdi-account-check-outline"
                :loading="saving"
              >
                Criar conta
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
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const formRef = ref()
const saving = ref(false)
const loadingInstitutions = ref(false)
const loadError = ref('')
const institutions = ref([])
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const currentUser = auth.getUserStorage()
const isPlatformAdmin = computed(() => currentUser?.institutionId === null)

const emptyModel = () => ({
  nome: '',
  email: '',
  password: '',
  userType: 'Colaborador',
  institutionId: null,
})

const model = ref(emptyModel())
const userTypeOptions = ['Administrador', 'Colaborador']
const requiredRules = [value => !!String(value ?? '').trim() || 'Este campo é obrigatório']
const emailRules = [
  ...requiredRules,
  value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Informe um e-mail válido',
]
const passwordRules = [
  ...requiredRules,
  value => String(value ?? '').length >= 8 || 'A senha deve ter pelo menos 8 caracteres',
]
const confirmationRules = [
  ...requiredRules,
  value => value === model.value.password || 'As senhas não coincidem',
]
const institutionRules = [
  value => model.value.userType === 'Administrador'
    || (value !== null && value !== undefined)
    || 'Selecione a instituição do usuário',
]

const responseData = response => response?.data?.data ?? response?.data

const apiMessage = (source, fallback) => {
  const body = source?.response?.data ?? source?.data ?? source
  const validationMessages = body?.errors && typeof body.errors === 'object'
    ? Object.values(body.errors).flat().filter(Boolean)
    : []

  return body?.errorMessage ?? body?.message ?? body?.title ?? validationMessages[0] ?? source?.message ?? fallback
}

const ensureSuccessfulResponse = response => {
  const body = response?.data

  if (body?.success === false || body?.isOk === false || body?.succeeded === false)
    throw new Error(apiMessage(body, 'Não foi possível criar a conta de acesso.'))
}

const loadInstitutions = async () => {
  loadingInstitutions.value = true
  loadError.value = ''

  try {
    if (!isPlatformAdmin.value) {
      const institutionId = Number(currentUser?.institutionId)
      const data = responseData(await institutionsApi.getById(institutionId))

      institutions.value = [{
        id: institutionId,
        name: data?.name || `Instituição #${institutionId}`,
      }]
      model.value.institutionId = institutionId

      return
    }

    const data = responseData(await institutionsApi.getAll())
    const items = Array.isArray(data)
      ? data
      : data?.institutions ?? data?.items ?? data?.$values ?? []

    institutions.value = [
      { id: 0, name: 'Administração geral' },
      ...items.filter(item => Number(item.id) !== 0),
    ]
  } catch (error) {
    console.error('Erro ao carregar instituições:', error)
    if (isPlatformAdmin.value) {
      institutions.value = [{ id: 0, name: 'Administração geral' }]
      loadError.value = 'Não foi possível carregar as instituições. Você ainda pode criar uma conta administrativa.'
    } else {
      loadError.value = 'Não foi possível carregar os dados da sua instituição.'
    }
  } finally {
    loadingInstitutions.value = false
  }
}

const submit = async () => {
  if (saving.value) return

  saving.value = true
  const { valid } = await formRef.value.validate()
  if (!valid) {
    saving.value = false
    return
  }

  try {
    const payload = {
      nome: model.value.nome.trim(),
      email: model.value.email.trim().toLowerCase(),
      password: model.value.password,
      userType: String(model.value.userType).trim(),
      institutionId: isPlatformAdmin.value
        ? Number(model.value.institutionId ?? 0)
        : Number(currentUser.institutionId),
    }

    const response = await loginAccountsApi.create(payload)
    ensureSuccessfulResponse(response)
    toast.success('Conta de acesso criada com sucesso!')
    await router.push({ name: 'admin-accounts' })
  } catch (error) {
    console.error('Erro ao criar conta de acesso:', error)
    toast.error(apiMessage(error, 'Não foi possível criar a conta de acesso.'))
  } finally {
    saving.value = false
  }
}

onMounted(loadInstitutions)
</script>
