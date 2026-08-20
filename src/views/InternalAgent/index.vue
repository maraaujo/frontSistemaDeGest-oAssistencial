<template>
  <VRow>
    <VCol cols="12">
      <div class="d-flex align-center gap-3 mb-4">
        <VAvatar
          color="primary"
          variant="tonal"
          size="48"
        >
          <VIcon icon="mdi-robot-outline" />
        </VAvatar>

        <div>
          <div class="text-h5 font-weight-bold">
            Assistente Interno
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Consulte informações assistenciais do sistema de forma rápida.
          </div>
        </div>
      </div>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-4">
          <span class="text-subtitle-1 font-weight-bold">Conversa</span>

          <VBtn
            variant="text"
            size="small"
            prepend-icon="mdi-broom"
            :disabled="loading"
            @click="clearChat"
          >
            Limpar conversa
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText
          ref="chatBodyRef"
          class="chat-body pa-4"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="d-flex mb-4"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="d-flex gap-3 chat-message"
              :class="message.role === 'user' ? 'flex-row-reverse' : ''"
            >
              <VAvatar
                :color="message.role === 'user' ? 'primary' : 'secondary'"
                size="36"
              >
                <VIcon
                  :icon="message.role === 'user' ? 'mdi-account' : 'mdi-robot-outline'"
                  size="20"
                />
              </VAvatar>

              <VCard
                :color="message.role === 'user' ? 'primary' : undefined"
                variant="tonal"
                rounded="lg"
                class="pa-3"
              >
                <div class="chat-message-text">
                  {{ message.content }}
                </div>
              </VCard>
            </div>
          </div>

          <div
            v-if="loading"
            class="d-flex mb-4 justify-start"
          >
            <div class="d-flex gap-3 chat-message">
              <VAvatar
                color="secondary"
                size="36"
              >
                <VIcon
                  icon="mdi-robot-outline"
                  size="20"
                />
              </VAvatar>

              <VCard
                variant="tonal"
                rounded="lg"
                class="pa-3 d-flex align-center gap-2"
              >
                <VProgressCircular
                  indeterminate
                  size="18"
                  width="2"
                  color="primary"
                />
                <span class="text-body-2">Consultando...</span>
              </VCard>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText class="pa-4">
          <VAutocomplete
            v-model="selectedPatientId"
            label="Paciente (opcional)"
            placeholder="Selecione para perguntar sobre um paciente específico"
            :items="listPatients"
            item-title="name"
            item-value="id"
            :loading="loadingPatients"
            clearable
            class="mb-4"
          />

          <div class="d-flex flex-wrap gap-2 mb-4">
            <VChip
              v-for="(quickQuestion, index) in quickQuestions"
              :key="index"
              variant="outlined"
              color="primary"
              :disabled="loading"
              @click="sendQuickQuestion(quickQuestion)"
            >
              {{ quickQuestion }}
            </VChip>
          </div>

          <div class="d-flex align-end gap-3">
            <VTextarea
              v-model="question"
              label="Digite sua pergunta"
              placeholder="Ex.: Quais medicamentos estão atrasados hoje?"
              rows="1"
              auto-grow
              max-rows="4"
              hide-details
              :disabled="loading"
              @keydown.enter.exact.prevent="sendQuestion"
            />

            <VBtn
              color="primary"
              prepend-icon="mdi-send"
              :loading="loading"
              :disabled="!question.trim()"
              @click="sendQuestion"
            >
              Enviar
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { internalAssistantApi } from '@/api/internal-assistant-api'
import { patientsApi } from '@/api/patients-api'
import { nextTick, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const question = ref('')
const loading = ref(false)
const chatBodyRef = ref()

const listPatients = ref([])
const loadingPatients = ref(false)
const selectedPatientId = ref(null)

const initialMessage = {
  role: 'assistant',
  content: 'Olá! Sou o assistente interno do SGA Assistencial. Posso responder sobre medicamentos atrasados, medicamentos vinculados a um acolhido, administrações feitas hoje e o resumo do dia.',
}

const messages = ref([{ ...initialMessage }])

const quickQuestions = ref([
  'Quais medicamentos estão atrasados hoje?',
  'Quais medicamentos estão vinculados a este paciente?',
  'Quais administrações foram feitas hoje?',
  'Resumo do dia.',
])

const scrollToBottom = () => {
  nextTick(() => {
    const el = chatBodyRef.value?.$el ?? chatBodyRef.value

    if (el)
      el.scrollTop = el.scrollHeight
  })
}

const getData = response => response?.data?.data ?? response?.data

const getList = value => {
  if (Array.isArray(value))
    return value

  if (value?.$values)
    return value.$values

  return value ? [value] : []
}

const loadPatients = async () => {
  loadingPatients.value = true

  try {
    listPatients.value = getList(getData(await patientsApi.getAll()))
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error)
  } finally {
    loadingPatients.value = false
  }
}

const sendQuestion = async () => {
  const trimmedQuestion = question.value.trim()

  if (!trimmedQuestion || loading.value)
    return

  messages.value.push({ role: 'user', content: trimmedQuestion })
  question.value = ''
  scrollToBottom()

  loading.value = true

  try {
    const payload = {
      patientId: selectedPatientId.value ?? null,
      question: trimmedQuestion,
      referenceDate: new Date().toISOString(),
    }

    const response = await internalAssistantApi.ask(payload)
    const body = response?.data ?? {}

    if (body.success) {
      messages.value.push({ role: 'assistant', content: body.data || 'Não foi possível obter uma resposta no momento.' })
    } else {
      const friendlyMessage = body.errorMessage || body.message || 'Não foi possível obter uma resposta no momento.'

      messages.value.push({ role: 'assistant', content: friendlyMessage })
      toast.error(friendlyMessage)
    }
  } catch (error) {
    console.error('Erro ao consultar o assistente interno:', error)

    const friendlyMessage = error.response?.data?.errorMessage
      ?? error.response?.data?.message
      ?? 'Não foi possível falar com o assistente agora. Tente novamente em instantes.'

    messages.value.push({ role: 'assistant', content: friendlyMessage })
    toast.error(friendlyMessage)
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const sendQuickQuestion = text => {
  if (loading.value)
    return

  question.value = text
  sendQuestion()
}

const clearChat = () => {
  messages.value = [{ ...initialMessage }]
}

onMounted(() => {
  loadPatients()
})
</script>

<style scoped>
.chat-body {
  max-block-size: 480px;
  overflow-y: auto;
}

.chat-message {
  max-inline-size: 80%;
}

.chat-message-text {
  white-space: pre-line;
}
</style>
