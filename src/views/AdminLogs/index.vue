<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
          <div class="d-flex align-center gap-3">
            <VAvatar
              color="primary"
              variant="tonal"
            >
              <VIcon icon="mdi-text-box-search-outline" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">
                Logs de auditoria
              </div>
              <div class="text-body-2 text-medium-emphasis text-wrap">
                Quem fez o quê, quando e de qual IP — criações, alterações e exclusões de todas as instituições.
              </div>
            </div>
          </div>

          <VChip
            color="primary"
            variant="tonal"
            prepend-icon="mdi-counter"
          >
            {{ pagination.count }} registro(s)
          </VChip>
        </VCardTitle>

        <VDivider />

        <!-- Filtros -->
        <VCardText class="pa-6">
          <VForm @submit.prevent="search">
            <VRow>
              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="filters.userEmail"
                  label="E-mail do usuário"
                  placeholder="parte do e-mail"
                  prepend-inner-icon="mdi-email-outline"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="filters.action"
                  label="Ação"
                  placeholder="ex.: Excluiu, Acolhido, Zerou"
                  prepend-inner-icon="mdi-gesture-tap"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="filters.date"
                  label="Data"
                  type="date"
                  clearable
                />
              </VCol>

              <VCol
                cols="12"
                class="d-flex justify-end gap-3"
              >
                <VBtn
                  color="secondary"
                  variant="outlined"
                  prepend-icon="mdi-filter-remove"
                  :disabled="loading"
                  @click="clearFilters"
                >
                  Limpar
                </VBtn>
                <VBtn
                  color="primary"
                  prepend-icon="mdi-magnify"
                  :loading="loading"
                  type="submit"
                >
                  Pesquisar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="logs"
          :loading="loading"
          loading-text="Carregando logs..."
          no-data-text="Nenhum registro de auditoria encontrado."
          class="text-no-wrap"
          :items-per-page="-1"
          hide-default-footer
        >
          <template #[`item.dateTime`]="{ item }">
            {{ formatDateTime(item.dateTime) }}
          </template>

          <template #[`item.userName`]="{ item }">
            <div>
              <h6 class="text-sm font-weight-bold">
                {{ item.userName || 'Usuário não identificado' }}
              </h6>
              <span class="text-caption text-medium-emphasis">
                {{ item.userEmail || '-' }}
              </span>
            </div>
          </template>

          <template #[`item.userType`]="{ item }">
            <VChip
              size="small"
              variant="tonal"
              color="secondary"
            >
              {{ item.userType || '-' }}
            </VChip>
          </template>

          <template #[`item.action`]="{ item }">
            <VChip
              size="small"
              variant="tonal"
              :color="getActionColor(item.action)"
            >
              {{ item.action || '-' }}
            </VChip>
          </template>

          <template #[`item.observation`]="{ item }">
            <span class="text-medium-emphasis">{{ summarize(item.observation) }}</span>
          </template>

          <template #[`item.actions`]="{ item }">
            <VBtn
              icon="mdi-eye-outline"
              size="small"
              variant="text"
              color="primary"
              title="Ver detalhes"
              @click="openDetails(item)"
            />
          </template>
        </VDataTable>

        <VDivider />

        <VCardText class="d-flex justify-center">
          <VPagination
            v-model="pagination.page"
            :length="pagination.totalPages"
            :total-visible="7"
            :disabled="loading"
            @update:model-value="changePage"
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- Detalhes de um registro -->
    <VDialog
      v-model="detailsOpen"
      max-width="640"
    >
      <VCard v-if="selectedLog">
        <VCardTitle class="d-flex align-center justify-space-between pa-6">
          <span>Registro #{{ selectedLog.id }}</span>
          <VBtn
            icon="mdi-close"
            variant="text"
            @click="detailsOpen = false"
          />
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VRow dense>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Data e hora
              </div>
              <div>{{ formatDateTime(selectedLog.dateTime) }}</div>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Endereço IP
              </div>
              <div>{{ selectedLog.ipAddress || '-' }}</div>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Usuário
              </div>
              <div>{{ selectedLog.userName || 'Usuário não identificado' }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ selectedLog.userEmail || '-' }}
              </div>
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <div class="text-caption text-medium-emphasis">
                Perfil
              </div>
              <div>{{ selectedLog.userType || '-' }}</div>
            </VCol>
            <VCol cols="12">
              <div class="text-caption text-medium-emphasis">
                Ação
              </div>
              <div class="font-weight-bold">
                {{ selectedLog.action || '-' }}
              </div>
            </VCol>
            <VCol cols="12">
              <div class="text-caption text-medium-emphasis">
                Detalhes
              </div>
              <div class="log-details">
                {{ selectedLog.observation || 'Sem detalhes registrados.' }}
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </VRow>
</template>

<script setup>
import { accessLogsApi } from '@/api/access-logs-api'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const headers = [
  { title: 'Data e hora', key: 'dateTime', sortable: false },
  { title: 'Usuário', key: 'userName', sortable: false },
  { title: 'Perfil', key: 'userType', sortable: false },
  { title: 'Ação', key: 'action', sortable: false },
  { title: 'IP', key: 'ipAddress', sortable: false },
  { title: 'Detalhes', key: 'observation', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'end' },
]

const loading = ref(false)
const logs = ref([])
const detailsOpen = ref(false)
const selectedLog = ref(null)

/** Filtros da tela, todos opcionais. */
const emptyFilters = () => ({ userEmail: '', action: '', date: '' })
const filters = ref(emptyFilters())

// Paginação feita pelo servidor (15 por página, do mais recente para o mais antigo).
const pagination = ref({ page: 1, totalPages: 1, count: 0 })

/**
 * Formata a data/hora do log como "dd/mm/aaaa HH:mm:ss". O backend grava o horário de
 * parede de São Paulo sem fuso; por isso o texto é reorganizado direto, sem passar por
 * Date (que aplicaria o fuso do navegador de quem está olhando).
 */
const formatDateTime = value => {
  if (!value)
    return '-'

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/)

  if (!match)
    return String(value)

  const [, year, month, day, hour, minute, second = '00'] = match

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`
}

/** Cor do chip conforme o tipo de ação: exclusões e limpezas em vermelho, criações em verde, alterações em azul. */
const getActionColor = action => {
  const text = String(action ?? '').toLowerCase()

  if (text.startsWith('excluiu') || text.startsWith('zerou'))
    return 'error'
  if (text.startsWith('criou'))
    return 'success'
  if (text.startsWith('alterou'))
    return 'info'

  return 'secondary'
}

/** Encurta os detalhes para caber na linha da tabela; o texto completo fica no diálogo. */
const summarize = text => {
  if (!text)
    return '-'

  return text.length > 70 ? `${text.slice(0, 70)}…` : text
}

/**
 * Extrai a lista de logs e os dados de paginação da resposta, aceitando a resposta direta
 * do backend ou embrulhada em `data`, e listas no formato `$values` do .NET.
 */
const readPage = response => {
  const body = response?.data?.data ?? response?.data ?? {}
  const list = body.accessLogs ?? body.items ?? body

  return {
    items: Array.isArray(list) ? list : list?.$values ?? [],
    totalPages: Math.max(1, Number(body.totalPages) || 1),
    count: Number(body.count) || 0,
  }
}

/**
 * Busca a página atual de logs com os filtros preenchidos (POST /AccessLog/GetAccessLogsByFilter).
 * Em erro, esvazia a tabela e mostra um aviso.
 */
const loadLogs = async () => {
  loading.value = true
  try {
    const response = await accessLogsApi.filter({
      userEmail: filters.value.userEmail?.trim() ?? '',
      action: filters.value.action?.trim() ?? '',
      ipAddress: '',
      dateTime: filters.value.date ? `${filters.value.date}T00:00:00` : null,
      page: pagination.value.page,
    })

    const page = readPage(response)

    logs.value = page.items
    pagination.value.totalPages = page.totalPages
    pagination.value.count = page.count
  } catch (error) {
    console.error('Erro ao carregar os logs de auditoria:', error)
    logs.value = []
    pagination.value.totalPages = 1
    pagination.value.count = 0
    toast.error('Não foi possível carregar os logs de auditoria.')
  } finally {
    loading.value = false
  }
}

/** Botão "Pesquisar": volta para a primeira página e aplica os filtros. */
const search = () => {
  pagination.value.page = 1
  loadLogs()
}

/** Limpa os filtros e recarrega a primeira página. */
const clearFilters = () => {
  filters.value = emptyFilters()
  pagination.value.page = 1
  loadLogs()
}

/** Troca de página e busca os registros dessa página no servidor. */
const changePage = page => {
  pagination.value.page = Number(page)
  loadLogs()
}

/** Abre o diálogo com o registro completo (inclusive o texto inteiro dos detalhes). */
const openDetails = item => {
  selectedLog.value = item
  detailsOpen.value = true
}

onMounted(loadLogs)
</script>

<style scoped>
.log-details {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
