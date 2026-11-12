// Helpers compartilhados entre a tela do relatório diário e a versão para impressão/PDF

// Data local (YYYY-MM-DD) — toISOString() usaria UTC e poderia trocar o dia
export const getToday = () => {
  const now = new Date()
  const pad = value => String(value).padStart(2, '0')

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

// YYYY-MM-DD -> DD/MM/YYYY sem passar por Date (evita deslocamento de fuso)
export const formatDate = value => {
  if (!value)
    return '-'

  const [year, month, day] = value.split('-')

  return `${day}/${month}/${year}`
}

// new Date() respeita o offset (-03:00) da string e o resultado é exibido no fuso local
/**
 * Formata uma data/hora ISO como HH:mm. Se value for vazio ou inválido, usa os 5 primeiros
 * caracteres de fallback (ex.: administrationTime "08:00:00" -> "08:00") ou devolve "-".
 * @param {string|null} value - data/hora ISO (ex.: scheduledDateTime)
 * @param {string} [fallback] - horário alternativo no formato HH:mm:ss
 * @returns {string}
 */
export const formatTime = (value, fallback) => {
  const date = value ? new Date(value) : null

  if (date && !Number.isNaN(date.getTime()))
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return typeof fallback === 'string' ? fallback.substring(0, 5) : '-'
}

/**
 * Situações em que a dose foi registrada, mas NÃO foi dada ao acolhido
 * (recusa, suspensão, cancelamento). Não contam como "Administrado".
 */
export const NOT_GIVEN_STATUSES = ['Não administrado', 'Cancelado']

/**
 * Cor do Vuetify para o chip de situação: "Administrado" = success (verde),
 * "Atrasado" = error (vermelho), "Não administrado"/"Cancelado" = warning (laranja),
 * qualquer outra (ex.: "Pendente") = secondary.
 * @returns {string}
 */
export const getStatusColor = status => {
  if (status === 'Administrado') return 'success'
  if (status === 'Atrasado') return 'error'
  if (NOT_GIVEN_STATUSES.includes(status)) return 'warning'

  return 'secondary'
}

/**
 * Extrai a lista de itens da resposta do relatório, aceitando vários formatos:
 * ApiResponse (response.data.data), array direto, objeto com $values (serialização .NET)
 * ou com items. Se nada servir, devolve lista vazia.
 * @returns {Array<object>} itens no formato DailyMedicationReportItem (ver api/medication-administrations-api.js)
 */
export const getReportList = response => {
  const value = response?.data?.data ?? response?.data

  if (Array.isArray(value))
    return value

  return value?.$values ?? value?.items ?? []
}

/**
 * Conta quantos itens há em cada situação. "Não administrado" e "Cancelado" são somados
 * em `NaoAdministrado`; situações desconhecidas são ignoradas.
 * @returns {{ Administrado: number, Atrasado: number, Pendente: number, NaoAdministrado: number }}
 */
export const summarizeByStatus = items => items.reduce(
  (acc, item) => {
    if (NOT_GIVEN_STATUSES.includes(item.status))
      acc.NaoAdministrado++
    else if (item.status in acc)
      acc[item.status]++

    return acc
  },
  { Administrado: 0, Atrasado: 0, Pendente: 0, NaoAdministrado: 0 },
)

// A resposta já vem ordenada por acolhido e horário; o agrupamento preserva essa ordem
/**
 * Agrupa os itens do relatório por acolhido (patientId), para exibir um bloco por pessoa.
 * @returns {Array<{ patientId: number, patientName: string, items: Array }>}
 */
export const groupByPatient = items => {
  const groups = new Map()

  items.forEach(item => {
    if (!groups.has(item.patientId))
      groups.set(item.patientId, { patientId: item.patientId, patientName: item.patientName, items: [] })

    groups.get(item.patientId).items.push(item)
  })

  return [...groups.values()]
}
