const apiMessage = (body, fallback) => {
  const validationMessages = body?.errors && typeof body.errors === 'object'
    ? Object.values(body.errors).flat().filter(Boolean)
    : []

  return body?.errorMessage ?? body?.message ?? body?.title ?? validationMessages[0] ?? fallback
}

export const ensureSuccessfulResponse = (response, fallback) => {
  const body = response?.data

  if (body?.success === false || body?.isOk === false || body?.succeeded === false)
    throw new Error(apiMessage(body, fallback))
}
