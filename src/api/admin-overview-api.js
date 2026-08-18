// API fake para a tela de Visão geral do painel administrativo (src/especificacao-painel-admin.md).
// Quando o backend estiver pronto, troque o corpo de cada função por chamadas via apiService
// (ex.: `await apiService.get('/admin/overview/kpis?period=' + period)'), mantendo a mesma assinatura.

const NETWORK_DELAY_MS = 450

const mockResponse = data => new Promise(resolve => {
  setTimeout(() => resolve({ data }), NETWORK_DELAY_MS)
})

const round = (value, decimals = 0) => {
  const factor = 10 ** decimals

  return Math.round(value * factor) / factor
}

export const PLANS = [
  { id: 'basico', name: 'Básico', monthlyPrice: 1900 },
  { id: 'profissional', name: 'Profissional', monthlyPrice: 3900 },
  { id: 'enterprise', name: 'Enterprise', monthlyPrice: 8900 },
]

export const SUBSCRIPTION_STATUS_META = {
  active: { code: 'active', label: 'Ativa', color: 'success', icon: 'mdi-check-circle' },
  trial: { code: 'trial', label: 'Trial', color: 'info', icon: 'mdi-flask-outline' },
  past_due: { code: 'past_due', label: 'Inadimplente', color: 'warning', icon: 'mdi-alert-circle-outline' },
  canceling: { code: 'canceling', label: 'Cancelando', color: 'error', icon: 'mdi-close-circle-outline' },
}

// Valores monetários em centavos de real (R$ 19,00 -> 1900) para evitar erros de ponto flutuante.
const FAKE_INSTITUTIONS = [
  { id: 1, name: 'Residencial Vida Plena', planId: 'enterprise', status: 'active', residents: 62, adherencePct: 97.8, renewsAt: '2026-09-14' },
  { id: 2, name: 'Lar dos Idosos Bom Pastor', planId: 'profissional', status: 'active', residents: 34, adherencePct: 95.2, renewsAt: '2026-09-02' },
  { id: 3, name: 'Instituto Recanto Feliz', planId: 'basico', status: 'trial', residents: 12, adherencePct: 88.0, trialEndsAt: '2026-08-30' },
  { id: 4, name: 'Casa da Vovó Assistencial', planId: 'profissional', status: 'past_due', residents: 28, adherencePct: 91.4, pastDueSince: '2026-07-20' },
  { id: 5, name: 'ILPI Novo Amanhecer', planId: 'enterprise', status: 'active', residents: 74, adherencePct: 98.5, renewsAt: '2026-10-05' },
  { id: 6, name: 'Lar São Vicente', planId: 'basico', status: 'active', residents: 15, adherencePct: 93.1, renewsAt: '2026-08-25' },
  { id: 7, name: 'Residencial Flor da Serra', planId: 'profissional', status: 'canceling', residents: 22, adherencePct: 84.2, cancelsAt: '2026-09-10' },
  { id: 8, name: 'Instituto Bem Viver', planId: 'basico', status: 'trial', residents: 9, adherencePct: 90.0, trialEndsAt: '2026-09-05' },
  { id: 9, name: 'Lar dos Idosos Esperança', planId: 'enterprise', status: 'active', residents: 81, adherencePct: 96.9, renewsAt: '2026-11-01' },
  { id: 10, name: 'Casa Tranquilidade', planId: 'profissional', status: 'active', residents: 31, adherencePct: 94.7, renewsAt: '2026-09-18' },
  { id: 11, name: 'ILPI Raízes', planId: 'basico', status: 'past_due', residents: 11, adherencePct: 87.5, pastDueSince: '2026-08-01' },
  { id: 12, name: 'Residencial Águas Claras', planId: 'enterprise', status: 'active', residents: 68, adherencePct: 99.1, renewsAt: '2026-09-27' },
  { id: 13, name: 'Lar Cantinho do Céu', planId: 'profissional', status: 'active', residents: 26, adherencePct: 92.0, renewsAt: '2026-10-12' },
  { id: 14, name: 'Instituto Renascer', planId: 'basico', status: 'active', residents: 14, adherencePct: 90.8, renewsAt: '2026-08-22' },
  { id: 15, name: 'ILPI Porto Seguro', planId: 'enterprise', status: 'canceling', residents: 55, adherencePct: 80.3, cancelsAt: '2026-08-28' },
  { id: 16, name: 'Casa Feliz Idade', planId: 'profissional', status: 'trial', residents: 18, adherencePct: 89.4, trialEndsAt: '2026-08-24' },
  { id: 17, name: 'Residencial Girassol', planId: 'basico', status: 'active', residents: 10, adherencePct: 96.4, renewsAt: '2026-09-08' },
  { id: 18, name: 'Lar Pôr do Sol', planId: 'enterprise', status: 'active', residents: 77, adherencePct: 97.2, renewsAt: '2026-10-20' },
  { id: 19, name: 'ILPI Novos Tempos', planId: 'profissional', status: 'past_due', residents: 24, adherencePct: 85.6, pastDueSince: '2026-07-29' },
  { id: 20, name: 'Instituto Acolher', planId: 'basico', status: 'active', residents: 13, adherencePct: 94.9, renewsAt: '2026-09-30' },
]

const planById = id => PLANS.find(plan => plan.id === id)

const withComputedFields = institution => ({
  ...institution,
  plan: planById(institution.planId),
  monthlyRevenue: planById(institution.planId).monthlyPrice,
})

const INSTITUTIONS = FAKE_INSTITUTIONS.map(withComputedFields)

const ACTIVE_INSTITUTIONS = INSTITUTIONS.filter(item => item.status === 'active')
const MONTHLY_REVENUE_BASE = ACTIVE_INSTITUTIONS.reduce((sum, item) => sum + item.monthlyRevenue, 0)
const MANAGED_RESIDENTS = INSTITUTIONS.reduce((sum, item) => sum + item.residents, 0)
const AVG_ADHERENCE = round(INSTITUTIONS.reduce((sum, item) => sum + item.adherencePct, 0) / INSTITUTIONS.length, 1)

const PERIOD_MONTHS = { '30d': 1, '90d': 3, '12m': 12 }
const REVENUE_GROWTH_PCT = { '30d': 6.4, '90d': 8.3, '12m': 14.7 }
const NEW_SUBSCRIPTIONS = { '30d': 4, '90d': 9, '12m': 27 }
const NEW_SUBSCRIPTIONS_PREV = { '30d': 3, '90d': 6, '12m': 21 }
const CANCELED_SUBSCRIPTIONS = { '30d': 1, '90d': 3, '12m': 9 }

const formatRenewal = institution => {
  const today = new Date()

  const daysBetween = isoDate => Math.round((new Date(isoDate) - today) / 86400000)

  if (institution.status === 'past_due')
    return `vencido há ${Math.abs(daysBetween(institution.pastDueSince))}d`
  if (institution.status === 'trial')
    return `trial · ${Math.max(daysBetween(institution.trialEndsAt), 0)}d rest.`
  if (institution.status === 'canceling')
    return `encerra ${new Date(institution.cancelsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`

  return `renova ${new Date(institution.renewsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`
}

const getKpis = async period => {
  const months = PERIOD_MONTHS[period] ?? PERIOD_MONTHS['90d']
  const revenueChangePct = REVENUE_GROWTH_PCT[period] ?? REVENUE_GROWTH_PCT['90d']
  const revenueValue = round(MONTHLY_REVENUE_BASE * months)
  const revenuePrev = round(revenueValue / (1 + revenueChangePct / 100))

  const newSubs = NEW_SUBSCRIPTIONS[period] ?? NEW_SUBSCRIPTIONS['90d']
  const newSubsPrev = NEW_SUBSCRIPTIONS_PREV[period] ?? NEW_SUBSCRIPTIONS_PREV['90d']
  const canceledSubs = CANCELED_SUBSCRIPTIONS[period] ?? CANCELED_SUBSCRIPTIONS['90d']

  const trials = INSTITUTIONS.filter(item => item.status === 'trial').length
  const activeCount = ACTIVE_INSTITUTIONS.length

  return mockResponse({
    period,
    revenue: { value: revenueValue, prev: revenuePrev, change_pct: revenueChangePct },
    active_subscriptions: { value: activeCount, net_change: newSubs - canceledSubs, trials },
    new_subscriptions: {
      value: newSubs,
      prev: newSubsPrev,
      change_pct: newSubsPrev === 0 ? null : round(((newSubs - newSubsPrev) / newSubsPrev) * 100, 1),
    },
    managed_residents: { value: MANAGED_RESIDENTS, avg_per_institution: round(MANAGED_RESIDENTS / activeCount) },
    doses_this_month: { value: 18420, on_time_pct: 96.8 },
    avg_adherence_pct: AVG_ADHERENCE,
    active_caregivers: 96,
  })
}

const REVENUE_TREND = [
  { month: 'Set/25', amount: 46200 },
  { month: 'Out/25', amount: 48950 },
  { month: 'Nov/25', amount: 47800 },
  { month: 'Dez/25', amount: 52300 },
  { month: 'Jan/26', amount: 51100 },
  { month: 'Fev/26', amount: 53600 },
  { month: 'Mar/26', amount: 55900 },
  { month: 'Abr/26', amount: 57200 },
  { month: 'Mai/26', amount: 58650 },
  { month: 'Jun/26', amount: 60300 },
  { month: 'Jul/26', amount: 62100 },
  { month: 'Ago/26', amount: MONTHLY_REVENUE_BASE },
]

const getRevenueTrend = async () => mockResponse(REVENUE_TREND)

const SUBSCRIPTION_MOVEMENT = [
  { month: 'Mar/26', new: 6, canceled: 2 },
  { month: 'Abr/26', new: 5, canceled: 1 },
  { month: 'Mai/26', new: 7, canceled: 3 },
  { month: 'Jun/26', new: 8, canceled: 2 },
  { month: 'Jul/26', new: 6, canceled: 1 },
  { month: 'Ago/26', new: 4, canceled: 1 },
]

const getSubscriptionMovement = async () => mockResponse(SUBSCRIPTION_MOVEMENT)

const getRevenueByPlan = async period => {
  const months = PERIOD_MONTHS[period] ?? PERIOD_MONTHS['90d']

  const byPlan = PLANS.map(plan => {
    const accounts = ACTIVE_INSTITUTIONS.filter(item => item.planId === plan.id)
    const baseAmount = accounts.reduce((sum, item) => sum + item.monthlyRevenue, 0)

    return {
      plan: plan.name,
      amount: round(baseAmount * months),
      accounts: accounts.length,
      percentage: round((baseAmount / MONTHLY_REVENUE_BASE) * 100, 1),
    }
  })

  return mockResponse(byPlan.sort((a, b) => b.amount - a.amount))
}

const getSubscriptionStatus = async () => {
  const counts = Object.keys(SUBSCRIPTION_STATUS_META).map(status => ({
    status,
    count: INSTITUTIONS.filter(item => item.status === status).length,
  }))

  return mockResponse(counts)
}

const SORTERS = {
  revenue_desc: (a, b) => b.monthlyRevenue - a.monthlyRevenue,
  revenue_asc: (a, b) => a.monthlyRevenue - b.monthlyRevenue,
  name_asc: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
  name_desc: (a, b) => b.name.localeCompare(a.name, 'pt-BR'),
  residents_desc: (a, b) => b.residents - a.residents,
  adherence_desc: (a, b) => b.adherencePct - a.adherencePct,
}

const getInstitutions = async ({ search = '', status = '', plan = '', sort = 'revenue_desc', page = 1, perPage = 10 } = {}) => {
  const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

  let filtered = INSTITUTIONS.filter(item => {
    const matchesSearch = !normalizedSearch || item.name.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    const matchesStatus = !status || item.status === status
    const matchesPlan = !plan || item.planId === plan

    return matchesSearch && matchesStatus && matchesPlan
  })

  filtered = [...filtered].sort(SORTERS[sort] ?? SORTERS.revenue_desc)

  const count = filtered.length
  const totalPages = Math.max(Math.ceil(count / perPage), 1)
  const safePage = Math.min(Math.max(page, 1), totalPages)

  const items = filtered
    .slice((safePage - 1) * perPage, safePage * perPage)
    .map(item => ({
      ...item,
      statusMeta: SUBSCRIPTION_STATUS_META[item.status],
      renewalText: formatRenewal(item),
    }))

  return mockResponse({ items, page: safePage, perPage, totalPages, count })
}

export const adminOverviewApi = {
  getKpis,
  getRevenueTrend,
  getSubscriptionMovement,
  getRevenueByPlan,
  getSubscriptionStatus,
  getInstitutions,
}
