<script setup>
import { adminOverviewApi, formatRenewalText, SUBSCRIPTION_STATUS_META } from '@/api/admin-overview-api'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import InstitutionsTable from './InstitutionsTable.vue'
import RevenueByPlanChart from './RevenueByPlanChart.vue'
import RevenueTrendChart from './RevenueTrendChart.vue'
import SubscriptionMovementChart from './SubscriptionMovementChart.vue'
import SubscriptionStatusChart from './SubscriptionStatusChart.vue'

const periods = [
  { title: '30 dias', value: '30d' },
  { title: '90 dias', value: '90d' },
  { title: '12 meses', value: '12m' },
]

const period = ref('90d')
const lastUpdatedAt = ref(new Date())
const now = ref(Date.now())

let clockTimer = null

const defaultKpis = () => ({
  revenue: { value: 0, prev: 0, change_pct: null },
  active_subscriptions: { value: 0, net_change: 0, trials: 0 },
  new_subscriptions: { value: 0, prev: 0, change_pct: null },
  managed_residents: { value: 0, avg_per_institution: 0 },
  doses_this_month: { value: 0, on_time_pct: 0 },
  avg_adherence_pct: 0,
  active_caregivers: 0,
})

const kpis = ref(defaultKpis())
const kpisLoading = ref(false)
const kpisError = ref('')

const revenueTrend = ref([])
const revenueTrendLoading = ref(false)
const revenueTrendError = ref('')

const movement = ref([])
const movementLoading = ref(false)
const movementError = ref('')

const byPlan = ref([])
const byPlanLoading = ref(false)
const byPlanError = ref('')

const statusData = ref([])
const statusLoading = ref(false)
const statusError = ref('')

const institutions = ref([])
const institutionsLoading = ref(false)
const institutionsError = ref('')
const institutionsQuery = ref({ search: '', status: '', plan: '', sort: 'revenue_desc' })
const institutionsPagination = ref({ page: 1, totalPages: 1, count: 0, perPage: 10 })

// Planos reais carregados do backend (usados no filtro da tabela de instituições).
const plans = ref([])

const anyLoading = computed(() =>
  kpisLoading.value
  || revenueTrendLoading.value
  || movementLoading.value
  || byPlanLoading.value
  || statusLoading.value
  || institutionsLoading.value,
)

const minutesSinceUpdate = computed(() => Math.max(Math.round((now.value - lastUpdatedAt.value.getTime()) / 60000), 0))

const formatCurrency = value => Number(value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatNumber = value => Number(value ?? 0).toLocaleString('pt-BR')

const trendMeta = changePct => {
  if (changePct === null || changePct === undefined)
    return { icon: 'mdi-minus', color: 'secondary', text: '— vs. período anterior' }

  const isUp = changePct >= 0

  return {
    icon: isUp ? 'mdi-arrow-up' : 'mdi-arrow-down',
    color: isUp ? 'success' : 'error',
    text: `${isUp ? '+' : ''}${changePct.toFixed(1)}% vs. período anterior`,
  }
}

const netChangeMeta = netChange => {
  if (!netChange)
    return { icon: 'mdi-minus', color: 'secondary', text: 'Estável no período' }

  const isUp = netChange > 0

  return {
    icon: isUp ? 'mdi-arrow-up' : 'mdi-arrow-down',
    color: isUp ? 'success' : 'error',
    text: `${isUp ? '+' : ''}${netChange} no período`,
  }
}

const mainCards = computed(() => [
  {
    key: 'revenue',
    title: 'Faturamento (período)',
    icon: 'mdi-cash-multiple',
    color: 'primary',
    value: formatCurrency(kpis.value.revenue.value),
    comparison: trendMeta(kpis.value.revenue.change_pct),
  },
  {
    key: 'active_subscriptions',
    title: 'Assinaturas ativas',
    icon: 'mdi-domain',
    color: 'success',
    value: formatNumber(kpis.value.active_subscriptions.value),
    comparison: netChangeMeta(kpis.value.active_subscriptions.net_change),
    subtitle: `${kpis.value.active_subscriptions.trials} em trial`,
  },
  {
    key: 'new_subscriptions',
    title: 'Novas assinaturas',
    icon: 'mdi-account-plus-outline',
    color: 'info',
    value: formatNumber(kpis.value.new_subscriptions.value),
    comparison: trendMeta(kpis.value.new_subscriptions.change_pct),
  },
  {
    key: 'managed_residents',
    title: 'Idosos gerenciados',
    icon: 'mdi-account-heart-outline',
    color: 'secondary',
    value: formatNumber(kpis.value.managed_residents.value),
    subtitle: `Média de ${kpis.value.managed_residents.avg_per_institution} por instituição`,
  },
])

const secondaryCards = computed(() => [
  {
    key: 'doses_this_month',
    title: 'Doses administradas (mês)',
    icon: 'mdi-pill',
    color: 'warning',
    value: formatNumber(kpis.value.doses_this_month.value),
    subtitle: `${kpis.value.doses_this_month.on_time_pct.toFixed(1)}% no horário previsto`,
  },
  {
    key: 'trials',
    title: 'Instituições em trial',
    icon: 'mdi-flask-outline',
    color: 'info',
    value: formatNumber(kpis.value.active_subscriptions.trials),
  },
  {
    key: 'avg_adherence',
    title: 'Adesão média',
    icon: 'mdi-clipboard-check-outline',
    color: 'success',
    value: `${kpis.value.avg_adherence_pct.toFixed(1)}%`,
  },
  {
    key: 'active_caregivers',
    title: 'Cuidadores ativos',
    icon: 'mdi-account-tie-outline',
    color: 'primary',
    value: formatNumber(kpis.value.active_caregivers),
  },
])

const getData = response => response?.data?.data ?? response?.data

const loadKpis = async () => {
  kpisLoading.value = true
  kpisError.value = ''
  try {
    const response = await adminOverviewApi.getKpis(period.value)

    kpis.value = getData(response)
  } catch (error) {
    console.error('Erro ao carregar os indicadores do painel administrativo:', error)
    kpisError.value = 'Não foi possível carregar os indicadores.'
  } finally {
    kpisLoading.value = false
  }
}

const loadRevenueTrend = async () => {
  revenueTrendLoading.value = true
  revenueTrendError.value = ''
  try {
    const response = await adminOverviewApi.getRevenueTrend(period.value)

    revenueTrend.value = getData(response)
  } catch (error) {
    console.error('Erro ao carregar a evolução do faturamento:', error)
    revenueTrendError.value = 'Não foi possível carregar o gráfico de faturamento.'
  } finally {
    revenueTrendLoading.value = false
  }
}

const loadMovement = async () => {
  movementLoading.value = true
  movementError.value = ''
  try {
    const response = await adminOverviewApi.getSubscriptionMovement(period.value)

    movement.value = getData(response)
  } catch (error) {
    console.error('Erro ao carregar o movimento de assinaturas:', error)
    movementError.value = 'Não foi possível carregar o gráfico de movimento.'
  } finally {
    movementLoading.value = false
  }
}

const loadByPlan = async () => {
  byPlanLoading.value = true
  byPlanError.value = ''
  try {
    const response = await adminOverviewApi.getRevenueByPlan(period.value)

    byPlan.value = getData(response)
  } catch (error) {
    console.error('Erro ao carregar o faturamento por plano:', error)
    byPlanError.value = 'Não foi possível carregar o gráfico de planos.'
  } finally {
    byPlanLoading.value = false
  }
}

const loadStatus = async () => {
  statusLoading.value = true
  statusError.value = ''
  try {
    const response = await adminOverviewApi.getSubscriptionStatus()

    statusData.value = getData(response)
  } catch (error) {
    console.error('Erro ao carregar a situação das assinaturas:', error)
    statusError.value = 'Não foi possível carregar o gráfico de situação.'
  } finally {
    statusLoading.value = false
  }
}

const loadInstitutions = async (page = institutionsPagination.value.page) => {
  institutionsLoading.value = true
  institutionsError.value = ''
  try {
    const response = await adminOverviewApi.getInstitutions({
      ...institutionsQuery.value,
      page,
      perPage: institutionsPagination.value.perPage,
    })

    const data = getData(response)

    institutions.value = (data.items ?? []).map(item => ({
      ...item,
      statusMeta: SUBSCRIPTION_STATUS_META[item.status],
      renewalText: formatRenewalText(item),
    }))

    institutionsPagination.value = {
      page: data.page,
      totalPages: data.totalPages,
      count: data.count,
      perPage: data.perPage,
    }
  } catch (error) {
    console.error('Erro ao carregar a lista de instituições:', error)
    institutionsError.value = 'Não foi possível carregar as instituições.'
  } finally {
    institutionsLoading.value = false
  }
}

const loadPlans = async () => {
  try {
    const response = await adminOverviewApi.getPlans()

    plans.value = getData(response) ?? []
  } catch (error) {
    console.error('Erro ao carregar os planos:', error)
  }
}

const onInstitutionsSearch = filters => {
  institutionsQuery.value = {
    ...institutionsQuery.value,
    search: filters.search ?? '',
    status: filters.status ?? '',
    plan: filters.plan ?? '',
  }
  loadInstitutions(1)
}

const onInstitutionsPageChange = page => loadInstitutions(page)

const loadAll = async () => {
  lastUpdatedAt.value = new Date()
  now.value = Date.now()

  await Promise.allSettled([
    loadKpis(),
    loadRevenueTrend(),
    loadMovement(),
    loadByPlan(),
    loadStatus(),
    loadInstitutions(1),
  ])
}

const exportOverview = () => {
  toast.warning('A exportação estará disponível quando a integração com o backend for concluída.')
}

onMounted(() => {
  loadPlans()
  loadAll()
  clockTimer = setInterval(() => {
    now.value = Date.now()
  }, 30000)
})

onUnmounted(() => {
  if (clockTimer)
    clearInterval(clockTimer)
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
          <div>
            <div class="text-caption text-medium-emphasis mb-1">
              Gestão / Visão geral
            </div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Painel Administrativo
            </h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Atualizado há {{ minutesSinceUpdate }} min
            </p>
          </div>

          <div class="d-flex align-center flex-wrap gap-3">
            <VBtnToggle
              v-model="period"
              mandatory
              divided
              color="primary"
              density="comfortable"
              @update:model-value="loadAll"
            >
              <VBtn
                v-for="option in periods"
                :key="option.value"
                :value="option.value"
              >
                {{ option.title }}
              </VBtn>
            </VBtnToggle>

            <VBtn
              variant="tonal"
              color="secondary"
              prepend-icon="mdi-tray-arrow-down"
              @click="exportOverview"
            >
              Exportar
            </VBtn>

            <VBtn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-refresh"
              :loading="anyLoading"
              @click="loadAll"
            >
              Atualizar
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      v-if="kpisError"
      cols="12"
    >
      <VCard>
        <VCardText class="d-flex flex-column align-center justify-center gap-3 pa-8 text-center">
          <VIcon
            icon="mdi-alert-circle-outline"
            size="32"
            color="error"
          />
          <span class="text-body-2 text-medium-emphasis">{{ kpisError }}</span>
          <VBtn
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-refresh"
            @click="loadKpis"
          >
            Tentar novamente
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <template v-else>
      <VCol
        v-for="card in mainCards"
        :key="card.key"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard height="100%">
          <VCardText class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-body-2 text-medium-emphasis">{{ card.title }}</span>
              <VAvatar
                :color="card.color"
                variant="tonal"
                size="40"
              >
                <VIcon
                  :icon="card.icon"
                  size="22"
                />
              </VAvatar>
            </div>

            <div
              v-if="kpisLoading"
              class="d-flex align-center"
              style="height: 40px;"
            >
              <VProgressCircular
                indeterminate
                size="20"
                width="2"
                color="primary"
              />
            </div>

            <template v-else>
              <div
                class="text-h4 font-weight-bold mb-1"
                style="font-variant-numeric: tabular-nums;"
              >
                {{ card.value }}
              </div>

              <div
                v-if="card.comparison"
                class="d-flex align-center gap-1 text-caption"
                :class="`text-${card.comparison.color}`"
              >
                <VIcon
                  :icon="card.comparison.icon"
                  size="14"
                />
                {{ card.comparison.text }}
              </div>

              <div
                v-if="card.subtitle"
                class="text-caption text-medium-emphasis"
              >
                {{ card.subtitle }}
              </div>
            </template>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        v-for="card in secondaryCards"
        :key="card.key"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard height="100%">
          <VCardText class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-body-2 text-medium-emphasis">{{ card.title }}</span>
              <VAvatar
                :color="card.color"
                variant="tonal"
                size="40"
              >
                <VIcon
                  :icon="card.icon"
                  size="22"
                />
              </VAvatar>
            </div>

            <div
              v-if="kpisLoading"
              class="d-flex align-center"
              style="height: 40px;"
            >
              <VProgressCircular
                indeterminate
                size="20"
                width="2"
                color="primary"
              />
            </div>

            <template v-else>
              <div
                class="text-h4 font-weight-bold mb-1"
                style="font-variant-numeric: tabular-nums;"
              >
                {{ card.value }}
              </div>

              <div
                v-if="card.subtitle"
                class="text-caption text-medium-emphasis"
              >
                {{ card.subtitle }}
              </div>
            </template>
          </VCardText>
        </VCard>
      </VCol>
    </template>

    <VCol
      cols="12"
      lg="7"
    >
      <RevenueTrendChart
        :data="revenueTrend"
        :loading="revenueTrendLoading"
        :error="revenueTrendError"
        @retry="loadRevenueTrend"
      />
    </VCol>

    <VCol
      cols="12"
      lg="5"
    >
      <SubscriptionStatusChart
        :data="statusData"
        :loading="statusLoading"
        :error="statusError"
        @retry="loadStatus"
      />
    </VCol>

    <VCol
      cols="12"
      lg="6"
    >
      <SubscriptionMovementChart
        :data="movement"
        :loading="movementLoading"
        :error="movementError"
        @retry="loadMovement"
      />
    </VCol>

    <VCol
      cols="12"
      lg="6"
    >
      <RevenueByPlanChart
        :data="byPlan"
        :loading="byPlanLoading"
        :error="byPlanError"
        @retry="loadByPlan"
      />
    </VCol>

    <VCol cols="12">
      <InstitutionsTable
        :items="institutions"
        :loading="institutionsLoading"
        :error="institutionsError"
        :page="institutionsPagination.page"
        :total-pages="institutionsPagination.totalPages"
        :count="institutionsPagination.count"
        :plans="plans"
        @search="onInstitutionsSearch"
        @retry="() => loadInstitutions(institutionsPagination.page)"
        @page-change="onInstitutionsPageChange"
      />
    </VCol>
  </VRow>
</template>
