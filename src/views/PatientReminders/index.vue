<template>
  <VRow>
    <VCol cols="12">
      <VStepper v-model="currentStep">
        <VStepperItem
          title="Lembretes de Medicação"
          color="primary"
          icon="mdi-pill"
          :complete="currentStep > 1"
        />

        <VForm @submit.prevent="submit">
          <VStepperWindow
            v-model="currentStep"
            :touch="false"
          >
            <VStepperWindowItem>
              <VRow>
                <VCol cols="12">
                  <VCard class="mb-6">
                    <VCardText>
                      <div class="d-flex align-center justify-space-between flex-wrap gap-4">
                        <div>
                          <h2 class="text-h5 font-weight-bold mb-1">
                            Lembretes de Medicação
                          </h2>

                          <p class="text-body-2 text-medium-emphasis mb-0">
                            Acompanhe os horários previstos para administração de medicamentos dos acolhidos.
                          </p>
                        </div>

                        <VChip
                          color="primary"
                          variant="tonal"
                          size="large"
                        >
                          <VIcon
                            start
                            icon="mdi-clock-outline"
                          />
                          Horários
                        </VChip>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>

                <VCol cols="3">
                  <VTextField
                    v-model="filtermodel.patientName"
                    label="Nome do acolhido"
                    prepend-inner-icon="mdi-account-outline"
                  />
                </VCol>

                <VCol cols="3">
                  <VTextField
                    v-model="filtermodel.medicineName"
                    label="Medicamento"
                    prepend-inner-icon="mdi-pill"
                  />
                </VCol>

                <VCol cols="3">
                  <VTextField
                    v-model="filtermodel.responsibleEmployeeName"
                    label="Funcionário responsável"
                    prepend-inner-icon="mdi-account-nurse-outline"
                  />
                </VCol>

                <VCol cols="3">
                  <VTextField
                    v-model="filtermodel.referenceDate"
                    label="Data"
                    type="date"
                    prepend-inner-icon="mdi-calendar-outline"
                  />
                </VCol>

                <VCol cols="12">
                  <div class="d-flex justify-end gap-4">
                    <VBtn
                      color="primary"
                      rounded="xs"
                      @click="submit"
                    >
                      <VIcon start>
                        mdi-magnify
                      </VIcon>
                      Pesquisar
                    </VBtn>

                    <VBtn
                      color="primary"
                      rounded="xs"
                      variant="outlined"
                      @click="cleanFilters"
                    >
                      Limpar Filtros
                    </VBtn>
                  </div>

                  <label class="left">
                    Total de Registros Encontrados: {{ paginationData.count }}
                  </label>
                </VCol>
              </VRow>

              <VRow>
                <VCol cols="12">
                  <VDataTable
                    title="Lembretes de Medicação"
                    :headers="headers"
                    :items="listPatientReminders"
                    :loading="loading"
                    loading-text="Carregando... Aguarde"
                    class="text-no-wrap rounded-t-0"
                    hide-default-footer
                  >
                    <template #item.patientName="{ item }">
                      <div>
                        <h6 class="text-sm font-weight-bold">
                          {{ item.patientName || 'Acolhido não informado' }}
                        </h6>

                        <span class="text-caption text-medium-emphasis">
                          ID: {{ item.patientId || '-' }}
                        </span>
                      </div>
                    </template>

                    <template #item.medicineName="{ item }">
                      <div>
                        <h6 class="text-sm font-weight-bold">
                          {{ item.medicineName || 'Medicamento não informado' }}
                        </h6>

                        <span class="text-caption text-medium-emphasis">
                          {{ item.dosage || item.prescribedDosage || '' }}
                        </span>
                      </div>
                    </template>

                    <template #item.administrationTime="{ item }">
                      <VChip
                        color="primary"
                        size="small"
                        variant="tonal"
                      >
                        <VIcon
                          start
                          icon="mdi-clock-outline"
                        />
                        {{ formatTime(item.administrationTime) }}
                      </VChip>
                    </template>

                    <template #item.nextDoseDateTime="{ item }">
                      {{ formatDateTime(item.nextDoseDateTime) }}
                    </template>

                    <template #item.responsibleEmployeeName="{ item }">
                      {{ item.responsibleEmployeeName || 'Não informado' }}
                    </template>

                    <template #item.minutesRemaining="{ item }">
                      <VChip
                        size="small"
                        :color="getReminderColor(item.minutesRemaining)"
                      >
                        {{ getReminderText(item.minutesRemaining) }}
                      </VChip>
                    </template>

                    <template #item.alertText="{ item }">
                      {{ item.alertText || '-' }}
                    </template>
                  </VDataTable>

                  <VPagination
                    :size="size"
                    color="secondary"
                    :total-visible="10"
                    v-model="paginationData.page"
                    @next="getPatientReminders"
                    @prev="getPatientReminders"
                    @click="getPatientReminders"
                    active-color="primary"
                    :length="paginationData.totalPages"
                  />
                </VCol>
              </VRow>
            </VStepperWindowItem>
          </VStepperWindow>
        </VForm>
      </VStepper>
    </VCol>
  </VRow>
</template>

<script setup>
import { medicinePatientClinicalConditionsApi } from "@/api/medicine-patient-clinical-conditions-api"
import { onMounted, ref } from "vue"
import { toast } from "vue3-toastify"

const currentStep = ref(0)
const size = ref("default")

const loading = ref(false)

const filtermodel = ref({})

const listPatientReminders = ref([])

const paginationData = ref({
  page: 1,
  totalPages: 1,
  itensPerPage: 10,
  count: 0,
  perPage: 10,
})

const headers = [
  { title: "Acolhido", key: "patientName", sortable: true },
  { title: "Medicamento", key: "medicineName", sortable: true },
  { title: "Frequência", key: "frequency", sortable: true },
  { title: "Horário", key: "administrationTime", sortable: true },
  { title: "Próxima dose", key: "nextDoseDateTime", sortable: true },
  { title: "Responsável", key: "responsibleEmployeeName", sortable: true },
  { title: "Tempo restante", key: "minutesRemaining", sortable: true },
  { title: "Alerta", key: "alertText", sortable: false },
]

const submit = async () => {
  paginationData.value.page = 1
  await getPatientReminders()
}

const getPatientReminders = async () => {
  try {
    loading.value = true

    filtermodel.value.page = paginationData.value.page
    filtermodel.value.perPage = paginationData.value.perPage

    const ret = await medicinePatientClinicalConditionsApi.getMedicineReminders(filtermodel.value)

    if (!ret?.data) {
      toast.error("Não foi possível buscar os lembretes.")
      return
    }

    const responseData = ret.data.data || ret.data

    paginationData.value.itensPerPage = responseData.itensPerPage || 10
    paginationData.value.page = responseData.page || paginationData.value.page
    paginationData.value.count = responseData.count || responseData.length || 0
    paginationData.value.totalPages = responseData.totalPages || 1

    const reminders =
      responseData.patientReminders ||
      responseData.medicineReminders ||
      responseData.reminders ||
      responseData.items ||
      responseData

    listPatientReminders.value = Array.isArray(reminders)
      ? reminders
      : []
  } catch (error) {
    console.error(error)
    toast.error("Erro ao carregar lembretes de medicação.")
  } finally {
    loading.value = false
  }
}

const cleanFilters = () => {
  filtermodel.value = {}
  paginationData.value.page = 1
  getPatientReminders()
}

const formatDateTime = value => {
  if (!value) return "-"

  const date = new Date(value)

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatTime = value => {
  if (!value) return "-"

  if (typeof value === "string") {
    return value.substring(0, 5)
  }

  return value
}

const getReminderColor = minutesRemaining => {
  if (minutesRemaining === null || minutesRemaining === undefined) return "grey"

  if (minutesRemaining < 0) return "error"

  if (minutesRemaining <= 30) return "warning"

  return "success"
}

const getReminderText = minutesRemaining => {
  if (minutesRemaining === null || minutesRemaining === undefined) return "Não informado"

  if (minutesRemaining < 0) return "Atrasado"

  if (minutesRemaining === 0) return "Agora"

  if (minutesRemaining <= 30) return `Em ${minutesRemaining} min`

  return `Em ${minutesRemaining} min`
}

onMounted(() => {
  getPatientReminders()
})
</script>

<style lang="scss">
@import "vue3-toastify/dist/index.css";
@import "@styles/libs/toastify";
</style>
