// Calcula a contagem da proxima dose AO VIVO, a partir do nextDoseDateTime
// (que o backend envia com fuso explicito, ex.: "2026-10-14T15:48:00-03:00")
// comparado com o relogio atual. Assim a tela nao fica "congelada" no
// minutesRemaining calculado no momento da ultima busca (que defasava ate 1 min).
//
// Regra de arredondamento:
//   - faltando tempo      -> arredonda para CIMA (1min50s => 2 min)
//   - no primeiro minuto  -> 0 ("Agora")
//   - atrasado            -> minutos completos de atraso
/**
 * Minutos até a próxima dose do item (lembrete). Se nextDoseDateTime for inválido,
 * usa o minutesRemaining vindo do backend; se nem ele existir, devolve null.
 * @param {{ nextDoseDateTime?: string, minutesRemaining?: number }} item - lembrete de medicamento
 * @param {number} [nowMs=Date.now()] - instante de referência em milissegundos
 * @returns {number|null} positivo = faltam N min; 0 = agora; negativo = atrasado N min
 */
export const minutesUntilDose = (item, nowMs = Date.now()) => {
  const doseMs = new Date(item?.nextDoseDateTime).getTime()

  if (Number.isNaN(doseMs)) {
    const fallback = Number(item?.minutesRemaining)

    return Number.isFinite(fallback) ? fallback : null
  }

  const diff = (doseMs - nowMs) / 60_000

  if (diff > 0)
    return Math.ceil(diff)
  if (diff > -1)
    return 0

  return -Math.floor(-diff)
}

/**
 * Converte minutos em texto legível: "2h 05min", "3h" ou "45 min".
 * @param {number} totalMinutes - valor não negativo
 * @returns {string}
 */
const formatDuration = totalMinutes => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0)
    return `${hours}h ${String(minutes).padStart(2, '0')}min`
  if (hours > 0)
    return `${hours}h`

  return `${minutes} min`
}

/**
 * Monta o texto exibido no lembrete a partir do resultado de minutesUntilDose:
 * "Em 1h 30min", "Agora", "Atrasado 15 min" ou "Não informado" (null/undefined).
 * @param {number|null|undefined} minutes
 * @returns {string}
 */
export const formatRemaining = minutes => {
  if (minutes === null || minutes === undefined)
    return 'Não informado'
  if (minutes === 0)
    return 'Agora'
  if (minutes < 0)
    return `Atrasado ${formatDuration(Math.abs(minutes))}`

  return `Em ${formatDuration(minutes)}`
}
