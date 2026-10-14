<template>
  <div class="print-report">
    <div class="print-actions no-print">
      <VBtn
        variant="outlined"
        color="secondary"
        prepend-icon="mdi-arrow-left"
        @click="goBack"
      >
        Voltar
      </VBtn>

      <VBtn
        color="primary"
        prepend-icon="mdi-printer"
        :disabled="loading || error"
        @click="print"
      >
        Imprimir / Salvar PDF
      </VBtn>
    </div>

    <header class="print-header">
      <h1>Relatório de Medicamentos do Dia</h1>
      <div class="print-meta">
        <span><strong>Data:</strong> {{ formatDate(date) }}</span>
        <span><strong>Acolhido:</strong> {{ patientLabel }}</span>
        <span><strong>Gerado em:</strong> {{ generatedAt }}</span>
      </div>
      <div
        v-if="!loading && !error"
        class="print-summary"
      >
        Administrados: {{ summary.Administrado }} •
        Atrasados: {{ summary.Atrasado }} •
        Pendentes: {{ summary.Pendente }}
      </div>
    </header>

    <div
      v-if="loading"
      class="print-state no-print"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
      <span>Carregando... Aguarde</span>
    </div>

    <VAlert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="no-print"
    >
      Não foi possível carregar o relatório de medicamentos.
      <template #append>
        <VBtn
          color="error"
          variant="text"
          prepend-icon="mdi-refresh"
          @click="loadReport"
        >
          Tentar novamente
        </VBtn>
      </template>
    </VAlert>

    <p
      v-else-if="!items.length"
      class="print-state"
    >
      Nenhum medicamento para este dia
    </p>

    <template v-else>
      <section
        v-for="group in groupedItems"
        :key="group.patientId"
        class="print-group"
      >
      <h2>{{ group.patientName || 'Acolhido não informado' }}</h2>

      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Dosagem</th>
            <th>Frequência</th>
            <th>Previsto</th>
            <th>Administrado</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in group.items"
            :key="`${item.medicinePatientClinicalConditionId}-${item.scheduledDateTime}`"
          >
            <td>{{ item.medicineName || '-' }}</td>
            <td>{{ item.dosage || '-' }}</td>
            <td>{{ item.frequency || '-' }}</td>
            <td>{{ formatTime(item.scheduledDateTime, item.administrationTime) }}</td>
            <td>{{ item.administeredDateTime ? formatTime(item.administeredDateTime) : '-' }}</td>
            <td>{{ item.responsibleEmployeeName || '-' }}</td>
            <td>
              <span :class="['status', `status--${getStatusColor(item.status)}`]">
                {{ item.status || '-' }}
              </span>
            </td>
            <td>{{ item.observations || '-' }}</td>
          </tr>
        </tbody>
      </table>
      </section>
    </template>

    <footer class="print-footer">
      <div class="signature">
        Responsável pela conferência
      </div>
    </footer>
  </div>
</template>

<script setup>
import { medicationAdministrationsApi } from '@/api/medication-administrations-api'
import {
  formatDate,
  formatTime,
  getReportList,
  getStatusColor,
  getToday,
  groupByPatient,
  summarizeByStatus,
} from '@/utils/dailyMedicationReport'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const date = route.query.date || getToday()
const patientId = route.query.patientId ? Number(route.query.patientId) : null

const loading = ref(false)
const error = ref(false)
const items = ref([])
const generatedAt = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const summary = computed(() => summarizeByStatus(items.value))
const groupedItems = computed(() => groupByPatient(items.value))

const patientLabel = computed(() => {
  if (!patientId)
    return 'Todos'

  return items.value[0]?.patientName || `#${patientId}`
})

const print = () => window.print()

const goBack = () => {
  if (window.history.state?.back)
    router.back()
  else
    router.push({ name: 'daily-medication-report' })
}

const loadReport = async () => {
  loading.value = true
  error.value = false

  try {
    items.value = getReportList(await medicationAdministrationsApi.getDailyMedicationReport({ date, patientId }))
  } catch (err) {
    console.error('Erro ao carregar relatório de medicamentos do dia:', err)
    items.value = []
    error.value = true
  } finally {
    loading.value = false
  }
}

const previousTitle = document.title

onMounted(async () => {
  // O título vira o nome sugerido do arquivo ao "Salvar como PDF"
  document.title = `relatorio-medicamentos-${date}${patientId ? `-${patientLabel.value}` : ''}`
  window.addEventListener('afterprint', () => { document.title = previousTitle }, { once: true })
  await loadReport()

  if (!error.value) {
    await nextTick()
    print()
  }
})

onBeforeUnmount(() => { document.title = previousTitle })
</script>

<style lang="scss" scoped>
.print-report {
  min-block-size: 100vh;
  padding: 32px;
  background: #fff;
  color: #212121;
  font-size: 13px;
}

.print-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-block-end: 24px;
}

.print-header {
  padding-block-end: 12px;
  border-block-end: 2px solid #212121;
  margin-block-end: 16px;

  h1 {
    margin: 0 0 8px;
    font-size: 20px;
  }
}

.print-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
}

.print-summary {
  margin-block-start: 8px;
  font-weight: 600;
}

.print-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #616161;
}

.print-group {
  margin-block-end: 20px;
  break-inside: avoid;

  h2 {
    margin: 0 0 6px;
    font-size: 15px;
  }
}

table {
  inline-size: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 6px 8px;
  border: 1px solid #bdbdbd;
  text-align: start;
  vertical-align: top;
}

th {
  background: #f5f5f5;
  font-weight: 600;
}

tr {
  break-inside: avoid;
}

.status {
  font-weight: 600;
  white-space: nowrap;

  &--success { color: #2e7d32; }
  &--error { color: #c62828; }
  &--secondary { color: #616161; }
}

.print-footer {
  display: flex;
  justify-content: flex-end;
  margin-block-start: 48px;
}

.signature {
  padding-block-start: 4px;
  border-block-start: 1px solid #212121;
  inline-size: 280px;
  text-align: center;
}

@media screen and (max-width: 600px) {
  .print-report {
    padding: 16px;
  }

  .print-group {
    overflow-x: auto;
  }
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-report {
    min-block-size: auto;
    padding: 0;
  }

  .print-group {
    break-inside: auto;
  }
}

@page {
  margin: 12mm;
  size: A4 landscape;
}
</style>
