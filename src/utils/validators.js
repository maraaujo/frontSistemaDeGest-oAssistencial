// Validações e formatações de CPF, CEP e telefone no frontend.
// Espelham as regras do backend (SistemaDeCadastro.Domain/Validators):
// aceitam entrada com ou sem máscara e as mensagens são idênticas às da API.

/**
 * Remove tudo o que não for dígito (pontos, traços, parênteses, espaços).
 * Valores vazios/nulos viram string vazia. Ex.: "123.456.789-09" -> "12345678909".
 * @returns {string}
 */
export const onlyDigits = value => (value ? String(value).replace(/\D/g, '') : '')

// ---------------------------------------------------------------------------
// CPF
// ---------------------------------------------------------------------------

/**
 * Valida um CPF (com ou sem máscara): exige 11 dígitos, rejeita sequências repetidas
 * e confere os dois dígitos verificadores pelo cálculo de módulo 11.
 * @returns {boolean}
 */
export const isValidCpf = value => {
  const digits = onlyDigits(value)

  if (digits.length !== 11)
    return false

  // Rejeita CPFs com todos os dígitos iguais (ex.: 11111111111).
  if (/^(\d)\1{10}$/.test(digits))
    return false

  const numbers = digits.split('').map(Number)

  /**
   * Calcula um dígito verificador: soma os primeiros `length` dígitos multiplicados por pesos
   * decrescentes a partir de `startWeight`; resto < 2 dá 0, senão 11 - resto.
   */
  const checkDigit = (length, startWeight) => {
    let sum = 0
    let weight = startWeight

    for (let i = 0; i < length; i++) {
      sum += numbers[i] * weight
      weight--
    }

    const remainder = sum % 11

    return remainder < 2 ? 0 : 11 - remainder
  }

  if (numbers[9] !== checkDigit(9, 10))
    return false

  if (numbers[10] !== checkDigit(10, 11))
    return false

  return true
}

/**
 * Aplica a máscara 000.000.000-00 ao CPF. Se não tiver exatamente 11 dígitos,
 * devolve o valor original sem alterar (ou '' se for nulo).
 */
export const formatCpf = value => {
  const digits = onlyDigits(value)

  if (digits.length !== 11)
    return value ?? ''

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// ---------------------------------------------------------------------------
// CEP
// ---------------------------------------------------------------------------

/**
 * Valida um CEP (com ou sem máscara): precisa ter 8 dígitos e não pode ser 00000000.
 * Não consulta se o CEP existe de fato.
 * @returns {boolean}
 */
export const isValidCep = value => {
  const digits = onlyDigits(value)

  if (digits.length !== 8)
    return false

  if (/^0{8}$/.test(digits))
    return false

  return true
}

/**
 * Aplica a máscara 00000-000 ao CEP. Se não tiver exatamente 8 dígitos,
 * devolve o valor original sem alterar (ou '' se for nulo).
 */
export const formatCep = value => {
  const digits = onlyDigits(value)

  if (digits.length !== 8)
    return value ?? ''

  return digits.replace(/(\d{5})(\d{3})/, '$1-$2')
}

// ---------------------------------------------------------------------------
// Telefone
// ---------------------------------------------------------------------------

// DDDs válidos no Brasil (Plano Nacional de Discagem da Anatel).
const VALID_AREA_CODES = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
])

/**
 * Valida um telefone brasileiro com DDD (com ou sem máscara): 10 dígitos (fixo, assinante
 * começando de 2 a 5) ou 11 dígitos (celular, começando com 9), e DDD na lista oficial.
 * @returns {boolean}
 */
export const isValidPhone = value => {
  const digits = onlyDigits(value)

  if (digits.length !== 10 && digits.length !== 11)
    return false

  const areaCode = Number(digits.slice(0, 2))
  if (!VALID_AREA_CODES.has(areaCode))
    return false

  const subscriberFirstDigit = digits[2]

  // Celular: nono dígito deve iniciar em 9.
  if (digits.length === 11)
    return subscriberFirstDigit === '9'

  // Fixo: primeiro dígito do assinante entre 2 e 5.
  return subscriberFirstDigit >= '2' && subscriberFirstDigit <= '5'
}

/**
 * Aplica a máscara de telefone: (00) 00000-0000 para celular (11 dígitos) ou
 * (00) 0000-0000 para fixo (10 dígitos). Outros tamanhos voltam sem alteração.
 */
export const formatPhone = value => {
  const digits = onlyDigits(value)

  if (digits.length === 11)
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')

  if (digits.length === 10)
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')

  return value ?? ''
}

// ---------------------------------------------------------------------------
// Regras para VForm / VTextField (Vuetify). Mensagens iguais às do backend.
// ---------------------------------------------------------------------------

/**
 * Gera as regras de validação de CPF para o atributo :rules de um VTextField.
 * Campo vazio só gera erro ("Campo obrigatório") se required for true; preenchido, precisa ser CPF válido.
 * @param {{ required?: boolean }} [options]
 * @returns {Array<(value: string) => true|string>}
 */
export const cpfRules = ({ required = false } = {}) => [
  value => {
    if (!value)
      return required ? 'Campo obrigatório' : true

    return isValidCpf(value) || 'CPF inválido.'
  },
]

/**
 * Gera as regras de validação de CEP para o atributo :rules de um VTextField.
 * Campo vazio só gera erro se required for true; preenchido, precisa ser CEP válido.
 * @param {{ required?: boolean }} [options]
 * @returns {Array<(value: string) => true|string>}
 */
export const cepRules = ({ required = false } = {}) => [
  value => {
    if (!value)
      return required ? 'Campo obrigatório' : true

    return isValidCep(value) || 'CEP inválido.'
  },
]

/**
 * Gera as regras de validação de telefone para o atributo :rules de um VTextField.
 * Campo vazio só gera erro se required for true; preenchido, precisa ser telefone válido.
 * @param {{ required?: boolean }} [options]
 * @returns {Array<(value: string) => true|string>}
 */
export const phoneRules = ({ required = false } = {}) => [
  value => {
    if (!value)
      return required ? 'Campo obrigatório' : true

    return isValidPhone(value) || 'Telefone inválido.'
  },
]
