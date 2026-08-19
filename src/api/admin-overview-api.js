import { apiService } from './api-service'

// Painel administrativo (back-office SaaS) — consome AdminOverviewController (somente leitura,
// policy "SaasAdmin"). Endpoints reais confirmados em Backend/SistemaDeCadastro2.0:
// Controller/V1/AdminOverviewController.cs

const getKpis = async period => await apiService.get(`/AdminOverview/Kpis?period=${encodeURIComponent(period ?? '')}`)

const getRevenueTrend = async period => await apiService.get(`/AdminOverview/RevenueTrend?period=${encodeURIComponent(period ?? '')}`)

const getSubscriptionMovement = async period => await apiService.get(`/AdminOverview/SubscriptionMovement?period=${encodeURIComponent(period ?? '')}`)

const getRevenueByPlan = async period => await apiService.get(`/AdminOverview/RevenueByPlan?period=${encodeURIComponent(period ?? '')}`)

const getSubscriptionStatus = async () => await apiService.get('/AdminOverview/SubscriptionStatus')

const getInstitutions = async ({ search = '', status = '', plan = '', sort = 'revenue_desc', page = 1, perPage = 10 } = {}) => {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (status) params.set('status', status)
  if (plan) params.set('plan', plan)
  if (sort) params.set('sort', sort)
  params.set('page', page)
  params.set('perPage', perPage)

  return await apiService.get(`/AdminOverview/Institutions?${params.toString()}`)
}

const getPlans = async () => await apiService.get('/AdminOverview/Plans')

export const adminOverviewApi = {
  getKpis,
  getRevenueTrend,
  getSubscriptionMovement,
  getRevenueByPlan,
  getSubscriptionStatus,
  getInstitutions,
  getPlans,
}

// Metadados de situação de assinatura para os badges/gráficos (o backend só devolve o
// código normalizado: active | trial | past_due | canceling).
export const SUBSCRIPTION_STATUS_META = {
  active: { code: 'active', label: 'Ativa', color: 'success', icon: 'mdi-check-circle' },
  trial: { code: 'trial', label: 'Trial', color: 'info', icon: 'mdi-flask-outline' },
  past_due: { code: 'past_due', label: 'Inadimplente', color: 'warning', icon: 'mdi-alert-circle-outline' },
  canceling: { code: 'canceling', label: 'Cancelando', color: 'error', icon: 'mdi-close-circle-outline' },
}

// AdminInstitutionRowDTO só traz `status` + `renewsAt` (uma data ISO). O texto de renovação
// varia conforme a situação, mas o backend não distingue "renova em" de "vencido em" —
// isso é decidido aqui no front a partir do status já normalizado.
export const formatRenewalText = row => {
  if (!row?.renewsAt)
    return '—'

  const date = new Date(row.renewsAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  if (row.status === 'past_due')
    return `vencido em ${date}`
  if (row.status === 'trial')
    return `trial até ${date}`
  if (row.status === 'canceling')
    return `encerra ${date}`

  return `renova ${date}`
}
