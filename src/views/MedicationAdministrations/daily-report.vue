<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="pa-6">
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <div class="d-flex align-center gap-3">
              <VAvatar
                color="primary"
                variant="tonal"
              >
                <VIcon icon="mdi-clipboard-text-clock-outline" />
              </VAvatar>

              <div>
                <div class="text-h5 font-weight-bold">
                  Relatório de Medicamentos do Dia
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Todos os medicamentos programados para o dia e o status de cada um.
                </div>
              </div>
            </div>

            <div class="d-flex align-center gap-3 flex-wrap">
              <VBtn
                variant="outlined"
                color="primary"
                prepend-icon="mdi-file-pdf-box"
                :disabled="loading || error || !items.length"
                @click="generatePdf"
              >
                Gerar PDF
              </VBtn>

              <VBtn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-refresh"
                :loading="loading"
                @click="loadReport"
              >
                Atualizar
              </VBtn>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText class="pa-6">
          <VRow>
            <VCol
              cols="12"
              sm="6"
              md="3"
            >
              <VTextField
                v-model="filtermodel.date"
                label="Data"
                type="date"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
              md="4"
            >
              <VAutocomplete
                v-model="filtermodel.patientId"
                label="Acolhido"
                placeholder="Todos"
                persistent-placeholder
                :items="listPatients"
                item-title="name"
                item-value="id"
                :loading="loadingPatients"
                clearable
              />
            </VCol>
          </VRow>

          <div class="d-flex flex-wrap gap-3">
            <VChip
              color="success"
              variant="tonal"
            >
              <VIcon
                start
                icon="mdi-check-circle-outline"
              />
              Administrados: {{ summary.Administrado }}
            </VChip>
            <VChip
              color="error"
              variant="tonal"
            >
              <VIcon
                start
                icon="mdi-alert-circle-outline"
              />
              Atrasados: {{ summary.Atrasado }}
            </VChip>
            <VChip
              color="secondary"
              variant="tonal"
            >
              <VIcon
                start
                icon="mdi-timer-sand"
              />
              Pendentes: {{ summary.Pendente }}
            </VChip>
          </div>
        </VCardText>

        <VDivider />

        <VCardText class="pa-6">
          <div
            v-if="loading && !items.length"
            class="d-flex flex-column align-center py-10 gap-3"
          >
            <VProgressCircular
              indeterminate
              color="primary"
            />
            <span class="text-medium-emphasis">Carregando... Aguarde</span>
          </div>

          <VAlert
            v-else-if="error"
            type="error"
            variant="tonal"
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

          <div
            v-else-if="!items.length"
            class="d-flex flex-column align-center py-10 gap-2 text-medium-emphasis"
          >
            <VIcon
              icon="mdi-pill-off"
              size="40"
            />
            Nenhum medicamento para este dia
          </div>

          <div
            v-else
            class="d-flex flex-column gap-4"
          >
            <VCard
              v-for="group in groupedItems"
              :key="group.patientId"
              variant="outlined"
            >
              <VCardTitle class="d-flex align-center gap-2 py-3">
                <VIcon
                  icon="mdi-account-outline"
                  color="primary"
                />
                {{ group.patientName || 'Acolhido não informado' }}
                <span class="text-caption text-medium-emphasis">
                  ({{ group.items.length }})
                </span>
              </VCardTitle>

              <VDivider />

              <VList class="py-0">
                <template
                  v-for="(item, index) in group.items"
                  :key="`${item.medicinePatientClinicalConditionId}-${item.scheduledDateTime}`"
                >
                  <VDivider v-if="index > 0" />
                  <VListItem class="py-3">
                    <div class="d-flex justify-space-between align-start flex-wrap gap-3">
                      <div>
                        <div class="text-body-1 font-weight-bold">
                          {{ item.medicineName || 'Medicamento não informado' }}
                          <span
                            v-if="item.dosage"
                            class="font-weight-regular text-medium-emphasis"
                          >
                            · {{ item.dosage }}
                          </span>
                        </div>

                        <div class="d-flex flex-wrap column-gap-4 row-gap-1 text-body-2 text-medium-emphasis mt-1">
                          <span>
                            <VIcon
                              icon="mdi-clock-outline"
                              size="16"
                              class="me-1"
                            />
                            Previsto: {{ formatTime(item.scheduledDateTime, item.administrationTime) }}
                          </span>
                          <span v-if="item.administeredDateTime">
                            <VIcon
                              icon="mdi-check"
                              size="16"
                              class="me-1"
                            />
                            Administrado: {{ formatTime(item.administeredDateTime) }}
                          </span>
                          <span>
                            <VIcon
                              icon="mdi-account-tie"
                              size="16"
                              class="me-1"
                            />
                            {{ item.responsibleEmployeeName || 'Responsável não informado' }}
                          </span>
                          <span v-if="item.frequency">
                            <VIcon
                              icon="mdi-repeat"
                              size="16"
                              class="me-1"
                            />
                            {{ item.frequency }}
                          </span>
                        </div>

                        <div
                          v-if="item.observations"
                          class="text-caption text-medium-emphasis mt-1"
                        >
                          {{ item.observations }}
                        </div>
                      </div>

                      <VChip
                        :color="getStatusColor(item.status)"
                        size="small"
                        label
                      >
                        {{ item.status || 'Não informado' }}
                      </VChip>
                    </div>
                  </VListItem>
                </template>
              </VList>
            </VCard>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { medicationAdministrationsApi } from '@/api/medication-administrations-api'
import { patientsApi } from '@/api/patients-api'
import {
  formatTime,
  getReportList,
  getStatusColor,
  getToday,
  groupByPatient,
  summarizeByStatus,
} from '@/utils/dailyMedicationReport'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { toast } from 'vue3-toastify'

const router = useRouter()

const loading = ref(false)
const loadingPatients = ref(false)
const error = ref(false)

/** @type {import('vue').Ref<import('@/api/medication-administrations-api').DailyMedicationReportItem[]>} */
const items = ref([])
const listPatients = ref([])
const filtermodel = ref({ date: getToday(), patientId: null })
let requestId = 0

const summary = computed(() => summarizeByStatus(items.value))
const groupedItems = computed(() => groupByPatient(items.value))

// Abre a versão para impressão na mesma aba (o token fica no sessionStorage da aba)
const generatePdf = () => {
  const query = { date: filtermodel.value.date || getToday() }

  if (filtermodel.value.patientId)
    query.patientId = filtermodel.value.patientId

  router.push({ name: 'daily-medication-report-print', query })
}

const loadReport = async () => {
  const currentRequest = ++requestId

  loading.value = true
  error.value = false

  try {
    const ret = await medicationAdministrationsApi.getDailyMedicationReport({
      date: filtermodel.value.date || undefined,
      patientId: filtermodel.value.patientId,
    })

    // Ignora respostas de filtros anteriores que chegaram depois
    if (currentRequest !== requestId)
      return

    items.value = getReportList(ret)
  } catch (err) {
    if (currentRequest !== requestId)
      return

    console.error('Erro ao carregar relatório de medicamentos do dia:', err)
    items.value = []
    error.value = true
    toast.error('Não foi possível carregar o relatório de medicamentos do dia.')
  } finally {
    if (currentRequest === requestId)
      loading.value = false
  }
}

const loadPatients = async () => {
  loadingPatients.value = true

  try {
    const ret = await patientsApi.getAll()
    const data = ret?.data?.data ?? ret?.data

    listPatients.value = Array.isArray(data) ? data : data?.patients ?? getReportList(ret)
  } catch (err) {
    console.error('Erro ao carregar acolhidos:', err)
  } finally {
    loadingPatients.value = false
  }
}

watch(() => [filtermodel.value.date, filtermodel.value.patientId], loadReport)

onMounted(() => {
  loadReport()
  loadPatients()
})
</script>

<style lang="scss">
@import "vue3-toastify/dist/index.css";
@import "@styles/libs/toastify";
</style>
