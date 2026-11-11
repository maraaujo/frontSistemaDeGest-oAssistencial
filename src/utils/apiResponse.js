/**
 * Escolhe a mensagem de erro a mostrar a partir do corpo da resposta, nesta ordem:
 * errorMessage, message, title, primeira mensagem de validação em errors (formato do
 * ASP.NET) e, por último, o texto fallback.
 * @returns {string}
 */
const apiMessage = (body, fallback) => {
  const validationMessages = body?.errors && typeof body.errors === 'object'
    ? Object.values(body.errors).flat().filter(Boolean)
    : []

  return body?.errorMessage ?? body?.message ?? body?.title ?? validationMessages[0] ?? fallback
}

/**
 * Confere se a resposta do axios indica sucesso. O backend pode responder HTTP 200 com
 * { success: false } (ApiResponse); nesse caso (ou com isOk/succeeded false) lança um Error
 * com a mensagem da API, para a tela tratar no catch. Se estiver tudo certo, não faz nada.
 * @param {object} response - resposta do axios
 * @param {string} fallback - mensagem usada quando a API não informa nenhuma
 * @throws {Error}
 */
export const ensureSuccessfulResponse = (response, fallback) => {
  const body = response?.data

  if (body?.success === false || body?.isOk === false || body?.succeeded === false)
    throw new Error(apiMessage(body, fallback))
}
