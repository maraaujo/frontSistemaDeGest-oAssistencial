// Camada de acesso da tela de Visão geral do back-office administrativo.
// Consome os endpoints reais da API (controller AdminOverview), sobre o banco
// real da aplicação. Nenhum dado é simulado aqui.
import { apiService } from '@/api/api-service'

const BASE = '/AdminOverview'

// Mapeamento de apresentação das situações de assinatura (código -> rótulo/cor/ícone).
// Os códigos são os status reais do domínio já normalizados pelo backend.
export const SUBSCRIPTION_STATUS_META = {
  active: { code: 'active', label: 'Ativa', color: 'success', icon: 'mdi-check-circle' },
  trial: { code: 'trial', label: 'Trial', color: 'info', icon: 'mdi-flask-outline' },
  past_due: { code: 'past_due', label: 'Inadimplente', color: 'warning', icon: 'mdi-alert-circle-outline' },
  canceling: { code: 'canceling', label: 'Cancelando', color: 'error', icon: 'mdi-close-circle-outline' },
}

// O backend responde no padrão ApiResponse ({ success, data, ... }); aqui extraímos o payload.
const unwrap = res => (res?.data?.data !== undefined ? res.data.data : res?.data ?? null)

const statusMetaFor = status =>
  SUBSCRIPTION_STATUS_META[status] ?? { code: status, label: status || '—', color: 'secondary', icon: 'mdi-help-circle-outline' }

// Texto de renovação apresentado na tabela, derivado da situação e da data de término.
const formatRenewal = item => {
  if (!item.renewsAt)
    return item.status === 'active' ? 'assinatura ativa' : '—'

  const date = new Date(item.renewsAt)
  const today = new Date()
  const days = Math.round((date - today) / 86400000)
  const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  if (item.status === 'canceling')
    return `encerra ${label}`
  if (days < 0)
    return `vencido há ${Math.abs(days)}d`

  return `renova ${label}`
}

const getPlans = async () => {
  const res = await apiService.get(`${BASE}/Plans`)

  return { data: unwrap(res) ?? [] }
}

const getKpis = async period => {
  const res = await apiService.get(`${BASE}/Kpis?period=${encodeURIComponent(period)}`)

  return { data: unwrap(res) }
}

const getRevenueTrend = async period => {
  const res = await apiService.get(`${BASE}/RevenueTrend?period=${encodeURIComponent(period)}`)

  return { data: unwrap(res) ?? [] }
}

const getSubscriptionMovement = async period => {
  const res = await apiService.get(`${BASE}/SubscriptionMovement?period=${encodeURIComponent(period)}`)

  return { data: unwrap(res) ?? [] }
}

const getRevenueByPlan = async period => {
  const res = await apiService.get(`${BASE}/RevenueByPlan?period=${encodeURIComponent(period)}`)

  return { data: unwrap(res) ?? [] }
}

const getSubscriptionStatus = async () => {
  const res = await apiService.get(`${BASE}/SubscriptionStatus`)

  return { data: unwrap(res) ?? [] }
}

const getInstitutions = async ({ search = '', status = '', plan = '', sort = 'revenue_desc', page = 1, perPage = 10 } = {}) => {
  const params = new URLSearchParams()

  if (search)
    params.set('search', search)
  if (status)
    params.set('status', status)
  if (plan !== '' && plan !== null && plan !== undefined)
    params.set('plan', plan)
  if (sort)
    params.set('sort', sort)
  params.set('page', page)
  params.set('perPage', perPage)

  const res = await apiService.get(`${BASE}/Institutions?${params.toString()}`)
  const data = unwrap(res) ?? { items: [], page: 1, perPage, totalPages: 1, count: 0 }

  // Decoração de apresentação (situação e texto de renovação) feita no cliente.
  const items = (data.items ?? []).map(item => ({
    ...item,
    statusMeta: statusMetaFor(item.status),
    renewalText: formatRenewal(item),
  }))

  return { data: { ...data, items } }
}

export const adminOverviewApi = {
  getKpis,
  getRevenueTrend,
  getSubscriptionMovement,
  getRevenueByPlan,
  getSubscriptionStatus,
  getInstitutions,
  getPlans,
}
