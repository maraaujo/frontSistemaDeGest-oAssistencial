<template>
  <VRow>
    <VCol cols="12">
      <VCard class="reminders-panel">
        <VCardText class="pa-6">
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <div class="d-flex align-center gap-4">
              <VAvatar color="primary" variant="tonal" size="56">
                <VIcon icon="mdi-pill" size="32" />
              </VAvatar>

              <div>
                <h1 class="text-h4 font-weight-bold mb-1">
                  Próximos medicamentos
                </h1>
                <p class="text-body-1 text-medium-emphasis mb-0">
                  Acompanhamento dos medicamentos que devem ser administrados em breve
                </p>
              </div>
            </div>

            <div class="d-flex align-center gap-3 flex-wrap">
              <VChip color="primary" variant="tonal" size="large">
                <VIcon start icon="mdi-format-list-bulleted" />
                {{ sortedReminders.length }} lembrete{{ sortedReminders.length === 1 ? '' : 's' }}
              </VChip>

              <VBtn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-refresh"
                :loading="loading"
                @click="getPatientReminders"
              >
                Atualizar
              </VBtn>

              <VBtn
                variant="outlined"
                color="primary"
                prepend-icon="mdi-fullscreen"
                @click="toggleFullscreen"
              >
                Tela cheia
              </VBtn>
            </div>
          </div>

          <div class="text-caption text-medium-emphasis mt-4">
            <VIcon icon="mdi-update" size="16" class="me-1" />
            Atualização automática a cada minuto
            <span v-if="lastUpdated"> · Última atualização: {{ lastUpdated }}</span>
          </div>
        </VCardText>

        <VDivider />

        <VDataTable
          :headers="headers"
          :items="sortedReminders"
          :loading="loading"
          loading-text="Carregando lembretes..."
          no-data-text="Nenhum medicamento previsto para os próximos minutos."
          class="reminders-table text-no-wrap"
          hide-default-footer
          :items-per-page="90"
        >
          <template #item.patientName="{ item }">
            <div class="py-2">
              <div class="text-h6 font-weight-bold">
                {{ item.patientName || 'Acolhido não informado' }}
              </div>
              <span v-if="item.patientId" class="text-caption text-medium-emphasis">
                ID: {{ item.patientId }}
              </span>
            </div>
          </template>

          <template #item.medicineName="{ item }">
            <div class="py-2">
              <div class="text-h6 font-weight-bold">
                {{ item.medicineName || 'Medicamento não informado' }}
              </div>
              <span class="text-body-2 text-medium-emphasis">
                {{ item.dosage || item.prescribedDosage || 'Dose não informada' }}
              </span>
            </div>
          </template>

          <template #item.administrationTime="{ item }">
            <VChip color="primary" size="large" variant="tonal">
              <VIcon start icon="mdi-clock-outline" />
              {{ formatTime(item.administrationTime) }}
            </VChip>
          </template>

          <template #item.nextDoseDateTime="{ item }">
            <span class="text-body-1 font-weight-medium">
              {{ formatDateTime(item.nextDoseDateTime) }}
            </span>
          </template>

          <template #item.responsibleEmployeeName="{ item }">
            {{ item.responsibleEmployeeName || 'Não informado' }}
          </template>

          <template #item.minutesRemaining="{ item }">
            <VChip size="large" :color="getReminderColor(item.minutesRemaining)">
              <VIcon start :icon="item.minutesRemaining < 0 ? 'mdi-alert-circle' : 'mdi-timer-outline'" />
              {{ getReminderText(item.minutesRemaining) }}
            </VChip>
          </template>
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { patientsApi } from "@/api/patients-api";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

const loading = ref(false)
const lastUpdated = ref("")
const listPatientReminders = ref([])
let refreshInterval

const headers = [
  { title: "Acolhido", key: "patientName", sortable: true },
  { title: "Medicamento", key: "medicineName", sortable: true },
  { title: "Frequência", key: "frequency", sortable: true },
  { title: "Horário", key: "administrationTime", sortable: true },
  { title: "Próxima dose", key: "nextDoseDateTime", sortable: true },
  { title: "Responsável", key: "responsibleEmployeeName", sortable: true },
  { title: "Tempo restante", key: "minutesRemaining", sortable: true },
]

const sortedReminders = computed(() => [...listPatientReminders.value].sort((a, b) => {
  const minutesA = Number.isFinite(Number(a.minutesRemaining)) ? Number(a.minutesRemaining) : Infinity
  const minutesB = Number.isFinite(Number(b.minutesRemaining)) ? Number(b.minutesRemaining) : Infinity

  return minutesA - minutesB
}))

const getPatientReminders = async () => {
  try {
    loading.value = true
    const ret = await patientsApi.getMedicineReminders()

    if (!ret?.data) {
      toast.error("Não foi possível buscar os lembretes.")
      return
    }

    const responseData = ret.data.data || ret.data
    const reminders =
      responseData.patientReminders ||
      responseData.medicineReminders ||
      responseData.reminders ||
      responseData.items ||
      responseData

    listPatientReminders.value = Array.isArray(reminders) ? reminders : []
    lastUpdated.value = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  } catch (error) {
    console.error(error)
    toast.error("Erro ao carregar lembretes de medicação.")
  } finally {
    loading.value = false
  }
}

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement)
      await document.documentElement.requestFullscreen()
    else
      await document.exitFullscreen()
  } catch (error) {
    console.error("Não foi possível alternar o modo de tela cheia.", error)
  }
}

const formatDateTime = value => {
  if (!value) return "-"

  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatTime = value => typeof value === "string" ? value.substring(0, 5) : "-"

const getReminderColor = minutesRemaining => {
  if (minutesRemaining === null || minutesRemaining === undefined) return "grey"
  if (minutesRemaining < 0) return "error"
  if (minutesRemaining <= 15) return "warning"
  return "success"
}

// Função para formatar o texto do lembrete com base no tempo restante
const getReminderText = minutesRemaining => {
  if (minutesRemaining === null || minutesRemaining === undefined) return "Não informado"
  if (minutesRemaining < 0) return `Atrasado ${Math.abs(minutesRemaining)} min`
  if (minutesRemaining === 0) return "Agora"
  return `Em ${minutesRemaining} min`
}

onMounted(() => {
  getPatientReminders()
  // Atualiza os lembretes a cada minuto
 // refreshInterval = window.setInterval(getPatientReminders, 60_000)
})

onBeforeUnmount(() => window.clearInterval(refreshInterval))
</script>

<style lang="scss">
@import "vue3-toastify/dist/index.css";
@import "@styles/libs/toastify";

.reminders-panel {
  min-block-size: calc(100vh - 140px);
}

.reminders-table :deep(th) {
  font-size: 0.875rem;
}

.reminders-table :deep(td) {
  font-size: 1rem;
}
</style>
