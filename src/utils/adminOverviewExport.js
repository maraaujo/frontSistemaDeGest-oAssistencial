// Exportação do Painel Administrativo em CSV (abre direto no Excel em português):
// separador ";", decimal com vírgula, BOM UTF-8 para os acentos e uma seção por bloco do painel.

const SEPARATOR = ';'

/**
 * Escapa um valor para uma célula CSV: aspas em volta quando há separador, aspas ou quebra de linha,
 * e um apóstrofo na frente de textos que começam com = + - @ para o Excel não executá-los como fórmula
 * (nomes de instituição vêm de cadastro e não são confiáveis). Números já formatados (ex.: "-5,0")
 * ficam como estão, para continuarem sendo números no Excel.
 * @param {unknown} value
 * @returns {string}
 */
export const csvCell = value => {
  if (value === null || value === undefined)
    return ''

  let text = String(value)

  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text) && !/^-\d+(?:,\d+)?$/.test(text))
    text = `'${text}`

  if (/[";\r\n]/.test(text))
    text = `"${text.replace(/"/g, '""')}"`

  return text
}

/**
 * Formata um número com vírgula decimal e sem separador de milhar, para o Excel em português
 * reconhecer a célula como número (ex.: 1234.5 → "1234,50").
 * @param {number|null|undefined} value
 * @param {number} [decimals=2]
 * @returns {string}
 */
export const csvNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value)))
    return ''

  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: false,
  })
}

/**
 * Monta o texto CSV a partir de seções. Cada seção vira um título, uma linha de cabeçalho e as linhas
 * de dados, separadas da próxima por uma linha em branco. Seções sem linhas recebem "Sem dados".
 * @param {{ title: string, header: string[], rows: unknown[][] }[]} sections
 * @returns {string}
 */
export const buildCsv = sections => {
  const lines = []

  sections.forEach((section, index) => {
    if (index > 0)
      lines.push('')

    lines.push(csvCell(section.title))
    lines.push(section.header.map(csvCell).join(SEPARATOR))

    if (!section.rows.length)
      lines.push(csvCell('Sem dados'))

    section.rows.forEach(row => lines.push(row.map(csvCell).join(SEPARATOR)))
  })

  return lines.join('\r\n')
}

/**
 * Monta as seções do CSV do painel: indicadores, faturamento por mês, novas × canceladas,
 * faturamento por plano, situação das assinaturas e a lista completa de instituições.
 * @param {object} data
 * @param {string} data.periodLabel - período escolhido na tela (ex.: "90 dias")
 * @param {object} data.kpis - indicadores no formato de GET /AdminOverview/Kpis
 * @param {{ month: string, amount: number }[]} data.revenueTrend
 * @param {{ month: string, new: number, canceled: number }[]} data.movement
 * @param {{ plan: string, amount: number, accounts: number, percentage: number }[]} data.byPlan
 * @param {{ status: string, count: number }[]} data.statusData
 * @param {object[]} data.institutions - todas as linhas de GET /AdminOverview/Institutions
 * @param {Record<string, { label: string }>} data.statusMeta - rótulos das situações (SUBSCRIPTION_STATUS_META)
 * @param {Date} [data.generatedAt]
 * @returns {{ title: string, header: string[], rows: unknown[][] }[]}
 */
export const buildOverviewSections = ({ periodLabel, kpis, revenueTrend, movement, byPlan, statusData, institutions, statusMeta, generatedAt = new Date() }) => {
  const statusLabel = code => statusMeta?.[code]?.label ?? code ?? ''

  return [
    {
      title: 'Painel Administrativo',
      header: ['Período', 'Gerado em'],
      rows: [[periodLabel, generatedAt.toLocaleString('pt-BR')]],
    },
    {
      title: 'Indicadores',
      header: ['Indicador', 'Valor', 'Detalhe'],
      rows: [
        ['Faturamento no período (R$)', csvNumber(kpis.revenue?.value), `Período anterior: ${csvNumber(kpis.revenue?.prev)}`],
        ['Variação do faturamento (%)', csvNumber(kpis.revenue?.change_pct, 1), ''],
        ['Assinaturas ativas', kpis.active_subscriptions?.value ?? 0, `Variação líquida: ${kpis.active_subscriptions?.net_change ?? 0}`],
        ['Instituições em trial', kpis.active_subscriptions?.trials ?? 0, ''],
        ['Novas assinaturas', kpis.new_subscriptions?.value ?? 0, `Período anterior: ${kpis.new_subscriptions?.prev ?? 0}`],
        ['Idosos gerenciados', kpis.managed_residents?.value ?? 0, `Média por instituição: ${kpis.managed_residents?.avg_per_institution ?? 0}`],
        ['Doses administradas no mês', kpis.doses_this_month?.value ?? 0, `No horário previsto: ${csvNumber(kpis.doses_this_month?.on_time_pct, 1)}%`],
        ['Adesão média (%)', csvNumber(kpis.avg_adherence_pct, 1), ''],
        ['Cuidadores ativos', kpis.active_caregivers ?? 0, ''],
      ],
    },
    {
      title: 'Faturamento por mês',
      header: ['Mês', 'Faturamento (R$)'],
      rows: (revenueTrend ?? []).map(point => [point.month, csvNumber(point.amount)]),
    },
    {
      title: 'Novas assinaturas x cancelamentos',
      header: ['Mês', 'Novas', 'Canceladas'],
      rows: (movement ?? []).map(point => [point.month, point.new ?? 0, point.canceled ?? 0]),
    },
    {
      title: 'Faturamento por plano',
      header: ['Plano', 'Faturamento (R$)', 'Contas', 'Participação (%)'],
      rows: (byPlan ?? []).map(item => [item.plan, csvNumber(item.amount), item.accounts ?? 0, csvNumber(item.percentage, 1)]),
    },
    {
      title: 'Situação das assinaturas',
      header: ['Situação', 'Quantidade'],
      rows: (statusData ?? []).map(item => [statusLabel(item.status), item.count ?? 0]),
    },
    {
      title: 'Instituições',
      header: ['ID', 'Instituição', 'Plano', 'Situação', 'Faturamento mensal (R$)', 'Idosos', 'Adesão (%)', 'Renovação'],
      rows: (institutions ?? []).map(item => [
        item.id,
        item.name,
        item.plan?.name ?? '',
        statusLabel(item.status),
        csvNumber(item.monthlyRevenue),
        item.residents ?? 0,
        csvNumber(item.adherencePct, 1),
        item.renewsAt ?? '',
      ]),
    },
  ]
}

/**
 * Faz o navegador baixar o CSV: cria um arquivo em memória (com BOM UTF-8 para o Excel ler os acentos),
 * clica num link temporário e libera a memória em seguida.
 * @param {string} csv - conteúdo gerado por buildCsv
 * @param {string} fileName - nome do arquivo, com a extensão .csv
 */
export const downloadCsv = (csv, fileName) => {
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
