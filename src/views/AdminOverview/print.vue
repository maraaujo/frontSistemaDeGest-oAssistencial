<template>
  <div class="print-report">
    <div class="print-actions no-print">
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
        prepend-icon="mdi-printer"
        :disabled="loading || error"
        @click="print"
      >
        Imprimir / Salvar PDF
      </VBtn>
    </div>

    <header class="print-header">
      <h1>Painel Administrativo</h1>
      <div class="print-meta">
        <span><strong>Período:</strong> {{ periodLabel }}</span>
        <span><strong>Filtros das instituições:</strong> {{ filtersLabel }}</span>
        <span><strong>Gerado em:</strong> {{ generatedAt }}</span>
      </div>
    </header>

    <div
      v-if="loading"
      class="print-state no-print"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
      <span>Carregando... Aguarde</span>
    </div>

    <VAlert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="no-print"
    >
      Não foi possível carregar o painel administrativo.
      <template #append>
        <VBtn
          color="error"
          variant="text"
          prepend-icon="mdi-refresh"
          @click="loadReport"
        >
          Tentar novamente
        </VBtn>
      </template>
    </VAlert>

    <template v-else>
      <section class="print-group">
        <h2>Indicadores</h2>
        <table>
          <thead>
            <tr>
              <th>Indicador</th>
              <th class="num">
                Valor
              </th>
              <th>Detalhe</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in kpiRows"
              :key="row.label"
            >
              <td>{{ row.label }}</td>
              <td class="num">
                {{ row.value }}
              </td>
              <td>{{ row.detail || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="print-columns">
        <section class="print-group">
          <h2>Faturamento por mês</h2>
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th class="num">
                  Faturamento
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!revenueTrend.length">
                <td colspan="2">
                  Sem dados
                </td>
              </tr>
              <tr
                v-for="point in revenueTrend"
                :key="point.month"
              >
                <td>{{ point.month }}</td>
                <td class="num">
                  {{ formatCurrency(point.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="print-group">
          <h2>Novas assinaturas x cancelamentos</h2>
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th class="num">
                  Novas
                </th>
                <th class="num">
                  Canceladas
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!movement.length">
                <td colspan="3">
                  Sem dados
                </td>
              </tr>
              <tr
                v-for="point in movement"
                :key="point.month"
              >
                <td>{{ point.month }}</td>
                <td class="num">
                  {{ formatNumber(point.new) }}
                </td>
                <td class="num">
                  {{ formatNumber(point.canceled) }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="print-group">
          <h2>Faturamento por plano</h2>
          <table>
            <thead>
              <tr>
                <th>Plano</th>
                <th class="num">
                  Faturamento
                </th>
                <th class="num">
                  Contas
                </th>
                <th class="num">
                  Participação
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!byPlan.length">
                <td colspan="4">
                  Sem dados
                </td>
              </tr>
              <tr
                v-for="item in byPlan"
                :key="item.plan"
              >
                <td>{{ item.plan }}</td>
                <td class="num">
                  {{ formatCurrency(item.amount) }}
                </td>
                <td class="num">
                  {{ formatNumber(item.accounts) }}
                </td>
                <td class="num">
                  {{ formatPercent(item.percentage) }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="print-group">
          <h2>Situação das assinaturas</h2>
          <table>
            <thead>
              <tr>
                <th>Situação</th>
                <th class="num">
                  Quantidade
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!statusData.length">
                <td colspan="2">
                  Sem dados
                </td>
              </tr>
              <tr
                v-for="item in statusData"
                :key="item.status"
              >
                <td>{{ statusLabel(item.status) }}</td>
                <td class="num">
                  {{ formatNumber(item.count) }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section class="print-group print-group--wide">
        <h2>Instituições ({{ institutions.length }})</h2>
        <table>
          <thead>
            <tr>
              <th>Instituição</th>
              <th>Plano</th>
              <th>Situação</th>
              <th class="num">
                Faturamento mensal
              </th>
              <th class="num">
                Idosos
              </th>
              <th class="num">
                Adesão
              </th>
              <th>Renovação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!institutions.length">
              <td colspan="7">
                Nenhuma instituição encontrada
              </td>
            </tr>
            <tr
              v-for="item in institutions"
              :key="item.id"
            >
              <td>{{ item.name || '-' }}</td>
              <td>{{ item.plan?.name || '-' }}</td>
              <td>{{ statusLabel(item.status) }}</td>
              <td class="num">
                {{ formatCurrency(item.monthlyRevenue) }}
              </td>
              <td class="num">
                {{ formatNumber(item.residents) }}
              </td>
              <td class="num">
                {{ formatPercent(item.adherencePct) }}
              </td>
              <td>{{ formatRenewalText(item) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script setup>
import { adminOverviewApi, formatRenewalText, SUBSCRIPTION_STATUS_META } from '@/api/admin-overview-api'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const PERIOD_LABELS = { '30d': '30 dias', '90d': '90 dias', '12m': '12 meses' }

// Período e filtros da tabela de instituições chegam pela URL (vindos do botão Exportar do painel).
const period = PERIOD_LABELS[route.query.period] ? route.query.period : '90d'

const filters = {
  search: String(route.query.search ?? ''),
  status: String(route.query.status ?? ''),
  plan: String(route.query.plan ?? ''),
  sort: String(route.query.sort ?? 'revenue_desc'),
}

const loading = ref(false)
const error = ref(false)
const kpis = ref({})
const revenueTrend = ref([])
const movement = ref([])
const byPlan = ref([])
const statusData = ref([])
const institutions = ref([])
const generatedAt = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const periodLabel = PERIOD_LABELS[period]

/** Formata um valor em reais (ex.: R$ 1.234,50). */
const formatCurrency = value => Number(value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/** Formata um número inteiro no padrão brasileiro (ex.: 1.234). */
const formatNumber = value => Number(value ?? 0).toLocaleString('pt-BR')

/** Formata um percentual com 1 casa decimal (ex.: 87,5%); sem valor, devolve "-". */
const formatPercent = value => (value === null || value === undefined || Number.isNaN(Number(value)))
  ? '-'
  : `${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

/** Traduz o código da situação (active, trial...) para o rótulo exibido (Ativa, Trial...). */
const statusLabel = code => SUBSCRIPTION_STATUS_META[code]?.label ?? code ?? '-'

// Texto dos filtros aplicados à lista de instituições, mostrado no cabeçalho.
const filtersLabel = computed(() => {
  const parts = []

  if (filters.search)
    parts.push(`busca "${filters.search}"`)
  if (filters.status)
    parts.push(`situação ${statusLabel(filters.status)}`)
  if (filters.plan)
    parts.push(`plano ${route.query.planName || `#${filters.plan}`}`)

  return parts.length ? parts.join(', ') : 'Nenhum'
})

// Linhas da tabela de indicadores, com os mesmos números dos cards do painel.
const kpiRows = computed(() => {
  const value = kpis.value ?? {}
  const revenueChange = value.revenue?.change_pct

  return [
    {
      label: 'Faturamento no período',
      value: formatCurrency(value.revenue?.value),
      detail: `Período anterior: ${formatCurrency(value.revenue?.prev)}${revenueChange === null || revenueChange === undefined ? '' : ` (${formatPercent(revenueChange)})`}`,
    },
    {
      label: 'Assinaturas ativas',
      value: formatNumber(value.active_subscriptions?.value),
      detail: `Variação líquida: ${formatNumber(value.active_subscriptions?.net_change)} • Em trial: ${formatNumber(value.active_subscriptions?.trials)}`,
    },
    {
      label: 'Novas assinaturas',
      value: formatNumber(value.new_subscriptions?.value),
      detail: `Período anterior: ${formatNumber(value.new_subscriptions?.prev)}`,
    },
    {
      label: 'Idosos gerenciados',
      value: formatNumber(value.managed_residents?.value),
      detail: `Média por instituição: ${formatNumber(value.managed_residents?.avg_per_institution)}`,
    },
    {
      label: 'Doses administradas no mês',
      value: formatNumber(value.doses_this_month?.value),
      detail: `No horário previsto: ${formatPercent(value.doses_this_month?.on_time_pct)}`,
    },
    { label: 'Adesão média', value: formatPercent(value.avg_adherence_pct), detail: '' },
    { label: 'Cuidadores ativos', value: formatNumber(value.active_caregivers), detail: '' },
  ]
})

/** Extrai o conteúdo útil da resposta do axios (`data.data`, senão `data`). */
const getData = response => response?.data?.data ?? response?.data

/**
 * Busca TODAS as instituições que atendem aos filtros (GET /AdminOverview/Institutions),
 * percorrendo as páginas de 100 em 100.
 */
const fetchAllInstitutions = async () => {
  const all = []
  let page = 1
  let totalPages = 1

  do {
    const data = getData(await adminOverviewApi.getInstitutions({ ...filters, page, perPage: 100 }))

    all.push(...(data?.items ?? []))
    totalPages = data?.totalPages ?? 1
    page++
  } while (page <= totalPages)

  return all
}

/** Abre a janela de impressão do navegador (onde dá para "Salvar como PDF"). */
const print = () => window.print()

/** Volta para a página anterior do histórico; se não houver, vai para o painel administrativo. */
const goBack = () => {
  if (window.history.state?.back)
    router.back()
  else
    router.push({ name: 'admin-overview' })
}

/**
 * Carrega em paralelo indicadores, gráficos e a lista completa de instituições do período e filtros da URL.
 * Se qualquer parte falhar, marca `error` (o que impede a impressão automática).
 */
const loadReport = async () => {
  loading.value = true
  error.value = false

  try {
    const [kpisResponse, trendResponse, movementResponse, planResponse, statusResponse, allInstitutions] = await Promise.all([
      adminOverviewApi.getKpis(period),
      adminOverviewApi.getRevenueTrend(period),
      adminOverviewApi.getSubscriptionMovement(period),
      adminOverviewApi.getRevenueByPlan(period),
      adminOverviewApi.getSubscriptionStatus(),
      fetchAllInstitutions(),
    ])

    kpis.value = getData(kpisResponse) ?? {}
    revenueTrend.value = getData(trendResponse) ?? []
    movement.value = getData(movementResponse) ?? []
    byPlan.value = getData(planResponse) ?? []
    statusData.value = getData(statusResponse) ?? []
    institutions.value = allInstitutions
  } catch (err) {
    console.error('Erro ao carregar o painel administrativo para impressão:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const previousTitle = document.title

// Ao abrir a tela, troca o título da aba, carrega os dados e, se não houver erro, abre a impressão automaticamente.
onMounted(async () => {
  // O título vira o nome sugerido do arquivo ao "Salvar como PDF"
  document.title = `painel-administrativo-${period}-${new Date().toLocaleDateString('sv-SE')}`
  window.addEventListener('afterprint', () => { document.title = previousTitle }, { once: true })
  await loadReport()

  if (!error.value) {
    await nextTick()
    print()
  }
})

// Ao sair da tela, restaura o título original da aba.
onBeforeUnmount(() => { document.title = previousTitle })
</script>

<style lang="scss" scoped>
.print-report {
  min-block-size: 100vh;
  padding: 32px;
  background: #fff;
  color: #212121;
  font-size: 13px;
}

.print-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-block-end: 24px;
}

.print-header {
  padding-block-end: 12px;
  border-block-end: 2px solid #212121;
  margin-block-end: 16px;

  h1 {
    margin: 0 0 8px;
    font-size: 20px;
  }
}

.print-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
}

.print-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #616161;
}

.print-columns {
  display: grid;
  gap: 0 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.print-group {
  margin-block-end: 20px;
  break-inside: avoid;

  h2 {
    margin: 0 0 6px;
    font-size: 15px;
  }
}

table {
  inline-size: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 6px 8px;
  border: 1px solid #bdbdbd;
  text-align: start;
  vertical-align: top;
}

th {
  background: #f5f5f5;
  font-weight: 600;
}

.num {
  text-align: end;
  white-space: nowrap;
}

tr {
  break-inside: avoid;
}

@media screen and (max-width: 600px) {
  .print-report {
    padding: 16px;
  }

  .print-columns {
    grid-template-columns: 1fr;
  }

  .print-group {
    overflow-x: auto;
  }
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-report {
    min-block-size: auto;
    padding: 0;
  }

  .print-group--wide {
    break-inside: auto;
  }
}

@page {
  margin: 12mm;
  size: A4 landscape;
}
</style>
