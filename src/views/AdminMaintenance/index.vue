<template>
  <VRow justify="center">
    <VCol
      cols="12"
      md="9"
    >
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VAvatar
            color="error"
            variant="tonal"
          >
            <VIcon icon="mdi-alert-octagon-outline" />
          </VAvatar>

          <div>
            <div class="text-h5 font-weight-bold">
              Manutenção de dados
            </div>
            <div class="text-body-2 text-medium-emphasis text-wrap">
              Ações administrativas de limpeza — exclusivas do administrador da plataforma.
              Todas valem para <strong>todas as instituições</strong> e são <strong>irreversíveis</strong>.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <!-- O que existe hoje no sistema -->
        <VCardText class="pa-6 pb-0">
          <div class="text-subtitle-2 text-medium-emphasis mb-3">
            Registros cadastrados hoje (todas as instituições)
          </div>

          <VProgressLinear
            v-if="loadingSummary"
            indeterminate
            color="error"
            class="mb-3"
          />

          <div
            v-else-if="summary"
            class="d-flex flex-wrap gap-2"
          >
            <VChip
              v-for="item in summaryItems"
              :key="item.key"
              variant="tonal"
              :color="item.value > 0 ? 'error' : 'secondary'"
              size="small"
              :prepend-icon="item.icon"
            >
              {{ item.label }}: {{ item.value }}
            </VChip>
          </div>

          <VAlert
            v-else
            type="warning"
            variant="tonal"
            density="compact"
          >
            Não foi possível carregar a contagem de registros.
          </VAlert>
        </VCardText>

        <!-- Uma área de perigo por ação -->
        <VCardText class="pa-6 d-flex flex-column gap-4">
          <VCard
            v-for="action in actions"
            :key="action.key"
            variant="outlined"
            color="error"
          >
            <VCardText>
              <div class="d-flex flex-wrap align-center justify-space-between gap-4">
                <div class="action-text">
                  <div class="d-flex align-center gap-2 text-subtitle-1 font-weight-bold">
                    <VIcon
                      :icon="action.icon"
                      size="22"
                    />
                    {{ action.title }}
                  </div>

                  <div class="text-body-2 text-medium-emphasis mt-1">
                    {{ action.description }}
                  </div>

                  <div class="text-body-2 mt-2">
                    <strong>Apaga:</strong> {{ action.removes }}
                  </div>
                  <div
                    v-if="action.keeps"
                    class="text-body-2 mt-1"
                  >
                    <strong>Mantém:</strong> {{ action.keeps }}
                  </div>
                </div>

                <VBtn
                  color="error"
                  :prepend-icon="action.icon"
                  :disabled="running"
                  @click="openConfirm(action)"
                >
                  {{ action.button }}
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Diálogo de confirmação (o mesmo para as três ações) -->
    <VDialog
      v-model="confirmOpen"
      max-width="540"
      persistent
    >
      <VCard v-if="selectedAction">
        <VCardTitle class="d-flex align-center gap-2 text-error text-wrap">
          <VIcon icon="mdi-alert" />
          {{ selectedAction.title }}
        </VCardTitle>

        <VCardText>
          <p class="mb-3">
            Esta ação é <strong>permanente</strong> e vale para <strong>todas as instituições</strong>.
            Não há como desfazer.
          </p>

          <p class="mb-2 text-body-2">
            <strong>Será apagado:</strong> {{ selectedAction.removes }}
          </p>
          <p
            v-if="selectedAction.keeps"
            class="mb-4 text-body-2"
          >
            <strong>Será mantido:</strong> {{ selectedAction.keeps }}
          </p>

          <p class="mb-2 text-body-2">
            Para confirmar, digite <strong>{{ selectedAction.confirmWord }}</strong> no campo abaixo:
          </p>

          <VTextField
            v-model="confirmText"
            :placeholder="selectedAction.confirmWord"
            variant="outlined"
            density="compact"
            autocomplete="off"
            :disabled="running"
          />
        </VCardText>

        <VCardActions class="px-4 pb-4">
          <VSpacer />
          <VBtn
            variant="text"
            color="secondary"
            :disabled="running"
            @click="confirmOpen = false"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="error"
            variant="flat"
            prepend-icon="mdi-trash-can-outline"
            :loading="running"
            :disabled="!confirmationMatches"
            @click="runSelectedAction"
          >
            {{ selectedAction.confirmButton }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>

<script setup>
import { maintenanceApi } from '@/api/maintenance-api'
import { medicinePatientClinicalConditionsApi } from '@/api/medicine-patient-clinical-conditions-api'
import { ensureSuccessfulResponse } from '@/utils/apiResponse'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const summary = ref(null)
const loadingSummary = ref(false)
const confirmOpen = ref(false)
const confirmText = ref('')
const running = ref(false)
const selectedAction = ref(null)

/**
 * As três limpezas disponíveis. Cada uma informa o que apaga, o que mantém, a palavra que o
 * administrador precisa digitar para confirmar e a chamada de API que executa a exclusão.
 */
const actions = [
  {
    key: 'scheduled-medicines',
    icon: 'mdi-pill-off',
    title: 'Apagar todos os medicamentos programados',
    description: 'Limpa a tela "Administração de medicamentos" e o histórico de doses. Acolhidos, funcionários e o cadastro de medicamentos continuam.',
    removes: 'medicamentos programados (prescrições) e administrações de medicamento.',
    keeps: null,
    button: 'Apagar medicamentos',
    confirmWord: 'APAGAR',
    confirmButton: 'Apagar definitivamente',
    run: () => medicinePatientClinicalConditionsApi.deleteAll(),
  },
  {
    key: 'patients',
    icon: 'mdi-account-multiple-remove-outline',
    title: 'Apagar todos os acolhidos',
    description: 'Remove todos os acolhidos e tudo o que está ligado a eles.',
    removes: 'acolhidos, responsáveis, condições clínicas dos acolhidos, medicamentos programados, administrações de medicamento, agendamentos, pagamentos e vínculos com funcionários.',
    keeps: 'funcionários, departamentos, cadastro de medicamentos e de condições clínicas, contas de acesso e instituições.',
    button: 'Apagar acolhidos',
    confirmWord: 'APAGAR',
    confirmButton: 'Apagar definitivamente',
    run: () => maintenanceApi.deleteAllPatients(),
  },
  {
    key: 'reset',
    icon: 'mdi-database-remove-outline',
    title: 'Zerar todos os dados do sistema',
    description: 'Deixa o sistema como recém-instalado: todas as instituições ficam sem nenhum dado de operação.',
    removes: 'tudo da opção anterior e também funcionários, departamentos e o cadastro de medicamentos.',
    keeps: 'contas de acesso (inclusive a sua), instituições, planos e assinaturas, tipos sanguíneos, cadastro de condições clínicas e os logs de auditoria.',
    button: 'Zerar o sistema',
    confirmWord: 'ZERAR',
    confirmButton: 'Zerar definitivamente',
    run: () => maintenanceApi.resetSystemData(),
  },
]

/**
 * Contadores exibidos no topo, na ordem em que aparecem na tela.
 */
const summaryItems = computed(() => {
  const data = summary.value ?? {}
  const count = key => Number(data[key]) || 0

  return [
    { key: 'patients', label: 'Acolhidos', icon: 'mdi-account-multiple-outline', value: count('patients') },
    { key: 'responsibles', label: 'Responsáveis', icon: 'mdi-account-heart-outline', value: count('responsibles') },
    { key: 'scheduledMedicines', label: 'Medicamentos programados', icon: 'mdi-clock-outline', value: count('scheduledMedicines') },
    { key: 'medicationAdministrations', label: 'Administrações', icon: 'mdi-history', value: count('medicationAdministrations') },
    { key: 'appointments', label: 'Agendamentos', icon: 'mdi-calendar-clock-outline', value: count('appointments') },
    { key: 'employees', label: 'Funcionários', icon: 'mdi-account-tie', value: count('employees') },
    { key: 'departments', label: 'Departamentos', icon: 'mdi-office-building-outline', value: count('departments') },
    { key: 'medicines', label: 'Medicamentos', icon: 'mdi-pill', value: count('medicines') },
  ]
})

/** Só libera o botão de confirmar quando a palavra digitada é exatamente a pedida. */
const confirmationMatches = computed(() =>
  !!selectedAction.value
  && confirmText.value.trim().toUpperCase() === selectedAction.value.confirmWord,
)

/**
 * Carrega a contagem de registros de cada tabela (todas as instituições).
 * Em erro, a tela mostra um aviso no lugar dos contadores e as ações continuam disponíveis.
 */
const loadSummary = async () => {
  loadingSummary.value = true
  try {
    const response = await maintenanceApi.getSummary()

    ensureSuccessfulResponse(response, 'Não foi possível carregar a contagem de registros.')
    summary.value = response?.data?.data ?? null
  } catch (error) {
    console.error('Erro ao carregar o resumo de manutenção:', error)
    summary.value = null
  } finally {
    loadingSummary.value = false
  }
}

/** Abre o diálogo de confirmação para a ação escolhida, com o campo de digitação vazio. */
const openConfirm = action => {
  selectedAction.value = action
  confirmText.value = ''
  confirmOpen.value = true
}

/**
 * Executa a limpeza confirmada, mostra a mensagem devolvida pelo backend (quantos registros
 * foram removidos) e atualiza os contadores.
 */
const runSelectedAction = async () => {
  if (!confirmationMatches.value || running.value)
    return

  const action = selectedAction.value

  running.value = true
  try {
    const response = await action.run()

    ensureSuccessfulResponse(response, 'Não foi possível concluir a exclusão.')

    toast.success(response?.data?.message ?? 'Dados removidos com sucesso.')
    confirmOpen.value = false
    await loadSummary()
  } catch (error) {
    console.error(`Erro na manutenção (${action.key}):`, error)
    toast.error(
      error.response?.data?.errorMessage
      ?? error.response?.data?.message
      ?? error.message
      ?? 'Não foi possível concluir a exclusão.',
    )
  } finally {
    running.value = false
  }
}

onMounted(loadSummary)
</script>

<style scoped>
.action-text {
  flex: 1 1 320px;
  min-inline-size: 0;
}
</style>
