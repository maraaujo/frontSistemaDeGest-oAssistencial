<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex flex-wrap align-center justify-space-between gap-4 pa-6">
          <div class="d-flex align-center gap-3">
            <VAvatar color="primary" variant="tonal">
              <VIcon icon="mdi-account-key-outline" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">Usuários com acesso</div>
              <div class="text-body-2 text-medium-emphasis">
                Consulte e gerencie as contas que podem acessar o sistema.
              </div>
            </div>
          </div>

          <VBtn
            color="primary"
            prepend-icon="mdi-account-plus-outline"
            @click="router.push({ name: 'admin-account-new' })"
          >
            Nova conta
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VTextField
            v-model="search"
            label="Pesquisar usuário"
            placeholder="Nome, e-mail, tipo ou instituição"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="filteredAccounts"
          :loading="loading"
          loading-text="Carregando usuários..."
          no-data-text="Nenhum usuário com acesso encontrado."
          class="text-no-wrap"
        >
          <template #[`item.id`]="{ item }">
            <strong class="text-primary">#{{ item.id }}</strong>
          </template>

          <template #[`item.name`]="{ item }">
            <div>
              <div class="font-weight-bold">{{ item.name || '-' }}</div>
              <span class="text-caption text-medium-emphasis">{{ item.email || '-' }}</span>
            </div>
          </template>

          <template #[`item.userType`]="{ item }">
            <VChip color="primary" variant="tonal" size="small">
              {{ item.userType || 'Não informado' }}
            </VChip>
          </template>

          <template #[`item.institutionName`]="{ item }">
            {{ item.institutionName || institutionLabel(item.institutionId) }}
          </template>

          <template #[`item.actions`]="{ item }">
            <VMenu>
              <template #activator="{ props }">
                <VBtn color="primary" size="small" v-bind="props">
                  <VIcon icon="mdi-cog" />
                </VBtn>
              </template>

              <VList>
                <VListItem link @click="openEdit(item)">
                  <template #prepend><VIcon icon="mdi-pencil-outline" /></template>
                  <VListItemTitle>Editar</VListItemTitle>
                </VListItem>
                <VListItem link @click="openDelete(item)">
                  <template #prepend><VIcon icon="mdi-delete-outline" color="error" /></template>
                  <VListItemTitle class="text-error">Excluir</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </template>
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <VDialog v-model="editDialog" max-width="760" persistent>
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pa-6">
        <span>Editar usuário</span>
        <VBtn icon="mdi-close" variant="text" :disabled="saving" @click="closeEdit" />
      </VCardTitle>
      <VDivider />

      <VCardText class="pa-6">
        <VForm ref="formRef" @submit.prevent="saveAccount">
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model.trim="model.nome" label="Nome completo" :rules="requiredRules" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model.trim="model.email" label="E-mail" type="email" :rules="emailRules" />
            </VCol>
            <VCol cols="12" md="6">
              <VCombobox v-model="model.userType" label="Tipo de usuário" :items="userTypeOptions" :rules="requiredRules" />
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="model.institutionId"
                label="Instituição"
                :items="institutions"
                item-title="name"
                item-value="id"
                :loading="loadingInstitutions"
                :disabled="!isPlatformAdmin"
                clearable
                no-data-text="Nenhuma instituição encontrada"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="model.password"
                label="Nova senha (opcional)"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                hint="Deixe em branco para manter a senha atual."
                persistent-hint
                :rules="passwordRules"
                @click:append-inner="showPassword = !showPassword"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VDivider />
      <VCardActions class="pa-6 justify-end">
        <VBtn variant="outlined" color="secondary" :disabled="saving" @click="closeEdit">Cancelar</VBtn>
        <VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="saveAccount">Salvar</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VDialog v-model="deleteDialog" max-width="480" persistent>
    <VCard>
      <VCardTitle class="pa-6">Excluir usuário</VCardTitle>
      <VCardText>
        Deseja excluir o acesso de <strong>{{ selectedAccount?.name || selectedAccount?.email }}</strong>?
        Essa ação não poderá ser desfeita.
      </VCardText>
      <VCardActions class="pa-6 justify-end">
        <VBtn variant="outlined" color="secondary" :disabled="deleting" @click="deleteDialog = false">Cancelar</VBtn>
        <VBtn color="error" :loading="deleting" @click="removeAccount">Excluir</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { institutionsApi } from '@/api/institutions-api'
import { loginAccountsApi } from '@/api/login-accounts-api'
import auth from '@/auth'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const router = useRouter()
const currentUser = auth.getUserStorage()

// Indica se o usuário logado é admin da plataforma (conta sem institutionId).
const isPlatformAdmin = computed(() => currentUser?.institutionId === null)
const loading = ref(false)
const loadingInstitutions = ref(false)
const saving = ref(false)
const deleting = ref(false)
const search = ref('')
const accounts = ref([])
const institutions = ref([])
const editDialog = ref(false)
const deleteDialog = ref(false)
const selectedAccount = ref(null)
const formRef = ref()
const showPassword = ref(false)

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Usuário', key: 'name', sortable: true },
  { title: 'Tipo de usuário', key: 'userType', sortable: true },
  { title: 'Instituição', key: 'institutionName', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false },
]
const userTypeOptions = ['Administrador', 'Colaborador']
const requiredRules = [value => Boolean(String(value ?? '').trim()) || 'Campo obrigatório']
const emailRules = [...requiredRules, value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Informe um e-mail válido']
const passwordRules = [value => !value || String(value).length >= 8 || 'A senha deve ter pelo menos 8 caracteres']
const model = ref({ id: 0, nome: '', email: '', userType: '', institutionId: null, password: '' })

/**
 * Extrai o conteúdo útil da resposta do axios: usa `data.data` quando a API
 * embrulha o retorno e, se não houver, o próprio `data`.
 */
const responseData = response => response?.data?.data ?? response?.data

/**
 * Garante que o retorno vire um array: aceita a lista direta ou uma lista dentro de
 * loginAccounts, accounts, institutions, items ou $values; caso contrário, devolve [].
 */
const extractList = data => Array.isArray(data) ? data : data?.loginAccounts ?? data?.accounts ?? data?.institutions ?? data?.items ?? data?.$values ?? []

/**
 * Monta a mensagem de erro para exibir ao usuário a partir de um erro do axios ou do corpo da resposta.
 * Procura, nesta ordem, errorMessage, message, title, a primeira mensagem de validação (errors)
 * e a mensagem do próprio erro; se nada for encontrado, usa o texto de fallback.
 */
const apiMessage = (source, fallback) => {
  const body = source?.response?.data ?? source?.data ?? source
  const validationMessages = body?.errors && typeof body.errors === 'object'
    ? Object.values(body.errors).flat().filter(Boolean)
    : []

  return body?.errorMessage ?? body?.message ?? body?.title ?? validationMessages[0] ?? source?.message ?? fallback
}

/**
 * Verifica se a API respondeu com sucesso mesmo quando o status HTTP é 200:
 * se o corpo trouxer success/isOk/succeeded igual a false, lança um erro com a mensagem da API (ou o fallback).
 */
const ensureSuccessfulResponse = (response, fallback) => {
  const body = response?.data

  if (body?.success === false || body?.isOk === false || body?.succeeded === false)
    throw new Error(apiMessage(body, fallback))
}

/**
 * Padroniza uma conta vinda da API para o formato usado na tabela, aceitando nomes de campos
 * alternativos (ex.: nome/name, tipoUsuario/userType, idInstitution/institutionId).
 */
const normalizeAccount = item => ({
  ...item,
  id: Number(item.id ?? item.idLoginAccount ?? item.loginAccountId),
  name: item.nome ?? item.name ?? '',
  email: item.email ?? '',
  userType: item.userType ?? item.tipoUsuario ?? '',
  institutionId: item.institutionId ?? item.idInstitution ?? null,
  institutionName: item.institutionName ?? item.institution?.name ?? '',
})

/**
 * Retorna o nome da instituição pelo id: "Administração geral" para id vazio ou 0,
 * o nome encontrado na lista carregada ou "Instituição #id" quando não encontrada.
 */
const institutionLabel = id => {
  if (id === null || id === undefined || Number(id) === 0) return 'Administração geral'
  return institutions.value.find(item => Number(item.id) === Number(id))?.name ?? `Instituição #${id}`
}

// Lista de contas filtrada pelo texto da busca (nome, e-mail, tipo de usuário ou instituição), sem diferenciar maiúsculas.
const filteredAccounts = computed(() => {
  const term = search.value?.trim().toLocaleLowerCase('pt-BR')
  if (!term) return accounts.value
  return accounts.value.filter(item => [item.name, item.email, item.userType, item.institutionName, institutionLabel(item.institutionId)]
    .some(value => String(value ?? '').toLocaleLowerCase('pt-BR').includes(term)))
})

/**
 * Busca todas as contas de acesso (GET /LoginAccount/GetAllLoginAccounts) e as normaliza para a tabela.
 * Em caso de erro, mostra um aviso.
 */
const loadAccounts = async () => {
  loading.value = true
  try {
    accounts.value = extractList(responseData(await loginAccountsApi.getAll())).map(normalizeAccount)
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
    toast.error('Não foi possível carregar os usuários com acesso.')
  } finally {
    loading.value = false
  }
}

/**
 * Carrega as instituições usadas no seletor e nos nomes da tabela.
 * Usuário de instituição: busca só a própria (GET /Institution/GetInstitutionById).
 * Admin da plataforma: busca todas (GET /Institution/GetAllInstitutions) e adiciona "Administração geral" (id 0).
 * Em caso de erro, apenas registra no console (sem aviso na tela).
 */
const loadInstitutions = async () => {
  loadingInstitutions.value = true
  try {
    if (!isPlatformAdmin.value) {
      const id = Number(currentUser?.institutionId)
      const data = responseData(await institutionsApi.getById(id))
      institutions.value = [{ id, name: data?.name ?? `Instituição #${id}` }]
      return
    }
    const items = extractList(responseData(await institutionsApi.getAll()))
    institutions.value = [{ id: 0, name: 'Administração geral' }, ...items.filter(item => Number(item.id) !== 0)]
  } catch (error) {
    console.error('Erro ao carregar instituições:', error)
    institutions.value = isPlatformAdmin.value ? [{ id: 0, name: 'Administração geral' }] : []
  } finally {
    loadingInstitutions.value = false
  }
}

/**
 * Abre o diálogo de edição preenchido com os dados da conta escolhida.
 * A senha começa vazia (só é alterada se for digitada uma nova).
 */
const openEdit = item => {
  selectedAccount.value = item
  model.value = {
    id: item.id,
    nome: item.name,
    email: item.email,
    userType: item.userType,
    institutionId: item.institutionId ?? (isPlatformAdmin.value ? 0 : Number(currentUser?.institutionId)),
    password: '',
  }
  editDialog.value = true
}

/**
 * Fecha o diálogo de edição (exceto enquanto está salvando), esconde a senha e limpa as mensagens de validação.
 */
const closeEdit = () => {
  if (saving.value) return
  editDialog.value = false
  showPassword.value = false
  formRef.value?.resetValidation()
}

/**
 * Valida o formulário e atualiza a conta (PUT /LoginAccount/Update/{id}).
 * Envia nome, e-mail em minúsculas, tipo de usuário e instituição; a senha só vai no envio se foi preenchida.
 * Usuário que não é admin da plataforma sempre envia a própria instituição. Depois recarrega a lista.
 */
const saveAccount = async () => {
  if (saving.value) return

  saving.value = true
  const validation = await formRef.value?.validate()
  if (!validation?.valid) {
    saving.value = false
    return toast.warning('Revise os campos informados.')
  }

  try {
    // O backend localiza a conta pelo `id` do corpo e lê o nome em `name`
    // (UpdateLoginAccountDTO). Sem esses dois campos a edição era sempre recusada.
    const payload = {
      id: Number(model.value.id),
      name: model.value.nome.trim(),
      email: model.value.email.trim().toLowerCase(),
      userType: String(model.value.userType).trim(),
      institutionId: isPlatformAdmin.value ? Number(model.value.institutionId ?? 0) : Number(currentUser?.institutionId),
    }
    if (model.value.password) payload.password = model.value.password

    const response = await loginAccountsApi.update(model.value.id, payload)
    ensureSuccessfulResponse(response, 'Não foi possível atualizar o usuário.')
    toast.success('Usuário atualizado com sucesso.')
    editDialog.value = false
    await loadAccounts()
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    toast.error(apiMessage(error, 'Não foi possível atualizar o usuário.'))
  } finally {
    saving.value = false
  }
}

/**
 * Guarda a conta escolhida e abre o diálogo de confirmação de exclusão.
 */
const openDelete = item => {
  selectedAccount.value = item
  deleteDialog.value = true
}

/**
 * Exclui a conta selecionada (DELETE /LoginAccount/DeleteLoginAccount/{id}), fecha o diálogo e recarrega a lista.
 */
const removeAccount = async () => {
  if (!selectedAccount.value?.id || deleting.value) return
  deleting.value = true
  try {
    const response = await loginAccountsApi.remove(selectedAccount.value.id)
    ensureSuccessfulResponse(response, 'Não foi possível excluir o usuário.')
    toast.success('Usuário excluído com sucesso.')
    deleteDialog.value = false
    selectedAccount.value = null
    await loadAccounts()
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
    toast.error(apiMessage(error, 'Não foi possível excluir o usuário.'))
  } finally {
    deleting.value = false
  }
}

// Ao abrir a tela, carrega instituições e contas de acesso ao mesmo tempo.
onMounted(async () => {
  await Promise.all([loadInstitutions(), loadAccounts()])
})
</script>
