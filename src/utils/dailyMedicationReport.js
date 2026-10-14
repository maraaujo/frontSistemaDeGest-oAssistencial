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
export const formatTime = (value, fallback) => {
  const date = value ? new Date(value) : null

  if (date && !Number.isNaN(date.getTime()))
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return typeof fallback === 'string' ? fallback.substring(0, 5) : '-'
}

export const getStatusColor = status => {
  if (status === 'Administrado') return 'success'
  if (status === 'Atrasado') return 'error'

  return 'secondary'
}

export const getReportList = response => {
  const value = response?.data?.data ?? response?.data

  if (Array.isArray(value))
    return value

  return value?.$values ?? value?.items ?? []
}

export const summarizeByStatus = items => items.reduce(
  (acc, item) => {
    if (item.status in acc)
      acc[item.status]++

    return acc
  },
  { Administrado: 0, Atrasado: 0, Pendente: 0 },
)

// A resposta já vem ordenada por acolhido e horário; o agrupamento preserva essa ordem
export const groupByPatient = items => {
  const groups = new Map()

  items.forEach(item => {
    if (!groups.has(item.patientId))
      groups.set(item.patientId, { patientId: item.patientId, patientName: item.patientName, items: [] })

    groups.get(item.patientId).items.push(item)
  })

  return [...groups.values()]
}
