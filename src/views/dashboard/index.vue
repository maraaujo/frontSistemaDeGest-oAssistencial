<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex align-center justify-space-between flex-wrap gap-4 pa-6">
          <div class="d-flex align-center gap-4">
            <VAvatar
              color="primary"
              variant="tonal"
              size="56"
            >
              <VIcon
                icon="mdi-view-dashboard-outline"
                size="32"
              />
            </VAvatar>

            <div>
              <h1 class="text-h4 font-weight-bold mb-1">
                Dashboard Assistencial
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                Acompanhe a rotina diária de medicações e agendamentos.
              </p>
            </div>
          </div>

          <VBtn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-refresh"
            :loading="loading"
            @click="loadDashboard"
          >
            Atualizar dados
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      v-for="card in indicatorCards"
      :key="card.key"
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard height="100%">
        <VCardText class="d-flex align-center justify-space-between pa-5">
          <div>
            <div class="text-body-1 text-medium-emphasis mb-2">
              {{ card.title }}
            </div>
            <div class="d-flex align-baseline gap-2">
              <span class="text-h4 font-weight-bold">{{ totals[card.key] }}</span>
              <span class="text-body-2 text-medium-emphasis">{{ card.suffix }}</span>
            </div>
          </div>

          <VAvatar
            :color="card.color"
            variant="tonal"
            size="52"
          >
            <VProgressCircular
              v-if="loading"
              indeterminate
              size="24"
              width="2"
            />
            <VIcon
              v-else
              :icon="card.icon"
              size="28"
            />
          </VAvatar>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      lg="7"
    >
      <VCard height="100%">
        <VCardTitle class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center gap-3">
            <VIcon
              icon="mdi-clock-alert-outline"
              color="warning"
            />
            Próximos medicamentos
          </div>
          <VBtn
            variant="text"
            color="primary"
            size="small"
            @click="goTo('patient-reminders')"
          >
            Ver todos
          </VBtn>
        </VCardTitle>
        <VDivider />

        <VDataTable
          :headers="reminderHeaders"
          :items="reminders"
          :loading="loading"
          loading-text="Carregando medicamentos..."
          no-data-text="Nenhum medicamento programado no momento."
          hide-default-footer
          class="text-no-wrap"
        >
          <template #[`item.dosage`]="{ item }">
            {{ item.dosage || item.prescribedDosage || '-' }}
          </template>

          <template #[`item.administrationTime`]="{ item }">
            {{ formatTime(item.administrationTime || item.nextDoseDateTime) }}
          </template>

          <template #[`item.responsibleEmployeeName`]="{ item }">
            {{ item.responsibleEmployeeName || 'Não informado' }}
          </template>

          <template #[`item.status`]="{ item }">
            <VChip
              :color="getReminderStatus(item).color"
              variant="tonal"
              size="small"
            >
              {{ getReminderStatus(item).label }}
            </VChip>
          </template>
        </VDataTable>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      lg="5"
    >
       <VCard height="100%">
        <VCardTitle class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center gap-3">
            <VIcon
              icon="mdi-clipboard-check-outline"
              color="success"
            />
            Últimas administrações
          </div>
          <VBtn
            variant="text"
            color="primary"
            size="small"
            @click="goTo('administered-medicines-history')"
          >
            Ver histórico
          </VBtn>
        </VCardTitle>
        <VDivider />

        <VDataTable
          :headers="administrationHeaders"
          :items="administrations"
          :loading="loading"
          loading-text="Carregando administrações..."
          no-data-text="Nenhuma administração registrada ainda."
          hide-default-footer
          class="text-no-wrap"
        >
          <template #[`item.medicineName`]="{ item }">
            <span v-if="item.medicineName">
              {{ item.medicineName }}
            </span>
            <span
              v-else
              class="text-medium-emphasis"
            >
              Vínculo #{{ item.medicinePatientClinicalConditionId || '-' }}
            </span>
          </template>

          <template #[`item.status`]="{ item }">
            <VChip
              :color="getAdministrationColor(item.status)"
              variant="tonal"
              size="small"
            >
              {{ item.status || 'Não informado' }}
            </VChip>
          </template>

          <template #[`item.administeredDateTime`]="{ item }">
            {{ formatDate(item.administeredDateTime) }}
          </template>

          <template #[`item.employeeName`]="{ item }">
            {{ item.employeeName || item.responsibleEmployeeName || 'Não informado' }}
          </template>
        </VDataTable>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center gap-3">
            <VIcon
              icon="mdi-calendar-clock-outline"
              color="warning"
            />
            Próximos agendamentos
          </div>
          <VBtn
            variant="text"
            color="primary"
            size="small"
            @click="goTo('appointments')"
          >
            Ver todos
          </VBtn>
        </VCardTitle>
        <VDivider />

        <VDataTable
          :headers="appointmentHeaders"
          :items="appointments"
          :loading="loading"
          loading-text="Carregando agendamentos..."
          no-data-text="Nenhum agendamento futuro encontrado."
          hide-default-footer
          class="text-no-wrap"
        >
          <template #[`item.dateTime`]="{ item }">
            {{ formatDate(item.dateTime) }}
          </template>

          <template #[`item.status`]="{ item }">
            <VChip
              :color="getAppointmentColor(item.status)"
              variant="tonal"
              size="small"
            >
              {{ item.status || 'Não informado' }}
            </VChip>
          </template>
        </VDataTable>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VIcon
            icon="mdi-lightning-bolt-outline"
            color="primary"
          />
          Atalhos rápidos
        </VCardTitle>
        <VDivider />
        <VCardText class="pa-6">
          <VRow>
            <VCol
              v-for="shortcut in shortcuts"
              :key="shortcut.route"
              cols="12"
              sm="6"
              md="4"
              lg="auto"
              class="flex-grow-1"
            >
              <VBtn
                :color="shortcut.color"
                variant="tonal"
                :prepend-icon="shortcut.icon"
                block
                height="48"
                @click="goTo(shortcut.route)"
              >
                {{ shortcut.title }}
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { appointmentsApi } from '@/api/appointments-api';
import { medicationAdministrationsApi } from '@/api/medication-administrations-api';
import { patientsApi } from '@/api/patients-api';
import { minutesUntilDose } from '@/utils/medicationTime';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const loading = ref(false)

const totals = ref({
  activePatients: 0,
  scheduledToday: 0,
  delayedMedications: 0,
  completedToday: 0,
  appointmentsToday: 0,
})

const reminders = ref([])
const administrations = ref([])
const appointments = ref([])

const indicatorCards = [
  { key: 'activePatients', title: 'Pacientes ativos', suffix: 'acolhidos', icon: 'mdi-account-heart-outline', color: 'primary' },
  { key: 'scheduledToday', title: 'Programadas hoje', suffix: 'medicações', icon: 'mdi-calendar-clock-outline', color: 'info' },
  { key: 'delayedMedications', title: 'Atrasadas', suffix: 'medicações', icon: 'mdi-clock-alert-outline', color: 'error' },
  { key: 'completedToday', title: 'Administradas hoje', suffix: 'administrações', icon: 'mdi-check-circle-outline', color: 'success' },
  { key: 'appointmentsToday', title: 'Agendamentos hoje', suffix: 'agendamentos', icon: 'mdi-calendar-check-outline', color: 'warning' },
]

const reminderHeaders = [
  { title: 'Paciente', key: 'patientName', sortable: true },
  { title: 'Medicamento', key: 'medicineName', sortable: true },
  { title: 'Dosagem', key: 'dosage', sortable: false },
  { title: 'Horário', key: 'administrationTime', sortable: true },
  { title: 'Responsável', key: 'responsibleEmployeeName', sortable: true },
  { title: 'Status', key: 'status', sortable: false },
]

const administrationHeaders = [
  { title: 'Paciente', key: 'patientName', sortable: true },
  { title: 'Medicamento', key: 'medicineName', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Horário administrado', key: 'administeredDateTime', sortable: true },
  { title: 'Funcionário', key: 'employeeName', sortable: true },
]

const appointmentHeaders = [
  { title: 'Paciente', key: 'patientName', sortable: true },
  { title: 'Responsável', key: 'responsible', sortable: true },
  { title: 'Tipo', key: 'appointmentType', sortable: true },
  { title: 'Data/Hora', key: 'dateTime', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
]

const shortcuts = [
  { title: 'Cadastrar paciente', route: 'patients-new', icon: 'mdi-account-plus-outline', color: 'primary' },
  { title: 'Administração de medicamentos', route: 'patient-medicines', icon: 'mdi-clipboard-pulse-outline', color: 'warning' },
  { title: 'Próximos medicamentos', route: 'patient-reminders', icon: 'mdi-clock-alert-outline', color: 'info' },
  { title: 'Agendamentos', route: 'appointments', icon: 'mdi-calendar-clock-outline', color: 'secondary' },
  { title: 'Histórico de medicação', route: 'administered-medicines-history', icon: 'mdi-history', color: 'success' },
]

/**
 * Extrai o conteúdo útil da resposta do axios (`data.data` ou `data`); se não houver nada, devolve [].
 */
const getResponseData = response => response?.data?.data ?? response?.data ?? []

/**
 * Garante que o retorno vire um array: aceita a lista direta, a primeira chave de `keys` que contenha
 * um array (ou um array em $values), ou items/$values; caso contrário, devolve [].
 */
const extractList = (value, keys = []) => {
  if (Array.isArray(value))
    return value

  for (const key of keys) {
    if (Array.isArray(value?.[key]))
      return value[key]

    if (Array.isArray(value?.[key]?.$values))
      return value[key].$values
  }

  return value?.items ?? value?.$values ?? []
}

/**
 * Retorna true se a data informada é válida e cai no dia de hoje (pelo horário local do navegador).
 */
const isToday = value => {
  if (!value)
    return false

  const date = new Date(value)
  const today = new Date()

  return !Number.isNaN(date.getTime())
    && date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

/**
 * Calcula o card "Pacientes ativos" a partir de patientsApi.getAll. Se os pacientes tiverem campo de situação
 * (active, isActive ou status), conta só os ativos; senão, conta todos. Em caso de erro, mostra 0.
 */
const loadPatients = async () => {
  try {
    const list = extractList(getResponseData(await patientsApi.getAll()), ['patients'])

    const hasStatus = list.some(item => item.active !== undefined || item.isActive !== undefined || item.status)

    totals.value.activePatients = hasStatus
      ? list.filter(item => {
        if (item.active !== undefined)
          return Boolean(item.active)
        if (item.isActive !== undefined)
          return Boolean(item.isActive)

        return !['inativo', 'inactive', 'desligado'].includes(String(item.status).toLocaleLowerCase('pt-BR'))
      }).length
      : list.length
  } catch (error) {
    console.error('Erro ao carregar pacientes do dashboard:', error)
    totals.value.activePatients = 0
  }
}

/**
 * Busca todos os agendamentos (GET /Appointment/GetAllAppointments), normaliza paciente, responsável e data,
 * conta quantos são de hoje (card "Agendamentos hoje") e mostra na tabela os 5 próximos que não estão cancelados.
 */
const loadAppointments = async () => {
  try {
    const data = getResponseData(await appointmentsApi.getAll())
    const list = extractList(data, ['appointments', 'appointment'])
    const normalized = list.map(item => ({
      ...item,
      patientName: item.patientName ?? item.namePatient ?? `Paciente #${item.patientId ?? '-'}`,
      responsible: item.responsible ?? item.employeeName ?? item.responsibleEmployeeName ?? 'Não informado',
      dateTime: item.dateTime ?? item.appointmentDate ?? item.date ?? item.scheduledDateTime ?? item.startDate,
    }))

    totals.value.appointmentsToday = normalized.filter(item => isToday(item.dateTime)).length
    appointments.value = normalized
      .filter(item => new Date(item.dateTime).getTime() >= Date.now() && item.status !== 'Cancelado')
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .slice(0, 5)
  } catch (error) {
    // Confirme os nomes dos campos de data retornados pelo DTO de Appointment.
    console.error('Erro ao carregar agendamentos do dashboard:', error)
    totals.value.appointmentsToday = 0
    appointments.value = []
  }
}

/**
 * Busca os lembretes de medicação (GET /MedicationAdministration/GetMedicineReminders), calcula os minutos
 * até cada dose, ordena da mais urgente para a menos urgente e mostra as 5 primeiras. Também preenche os cards
 * "Programadas hoje" (total de lembretes) e "Atrasadas" (minutos negativos).
 */
const loadMedicineReminders = async () => {
  try {
    const data = getResponseData(await medicationAdministrationsApi.getMedicineReminders())
    const list = extractList(data, ['patientReminders', 'medicineReminders', 'reminders'])
    const nowMs = Date.now()
    const withMinutes = list.map(item => ({ ...item, liveMinutes: minutesUntilDose(item, nowMs) }))
    const sorted = withMinutes.sort((a, b) => (a.liveMinutes ?? Infinity) - (b.liveMinutes ?? Infinity))

    reminders.value = sorted.slice(0, 5)
    totals.value.scheduledToday = list.length
    totals.value.delayedMedications = withMinutes.filter(item => item.liveMinutes < 0).length
  } catch (error) {
    console.error('Erro ao carregar lembretes do dashboard:', error)
    reminders.value = []
    totals.value.scheduledToday = 0
    totals.value.delayedMedications = 0
  }
}

/**
 * Busca a primeira página (5 registros) do histórico de administrações
 * (POST /MedicationAdministration/GetPagedMedicationAdministrationByFilter), ordena da mais recente para a mais antiga
 * e preenche a tabela. O card "Administradas hoje" conta, entre esses 5 registros, os com status administrado e data de hoje.
 */
const loadMedicationAdministrations = async () => {
  try {
    // Mesmo endpoint e formato de filtro utilizados pela tela de Histórico de medicação.
    const response = await medicationAdministrationsApi.filter({
      page: 1,
      perPage: 5,
      itensPerPage: 5,
    })
    const data = getResponseData(response)
    const list = extractList(data, [
      'medicationAdministration',
      'medicationAdministrations',
      'administrations',
    ]).map(item => ({
      ...item,
      patientName: item.patientName ?? item.namePatient ?? '',
      medicineName: item.medicineName ?? item.nameMedicine ?? item.medicationName ?? '',
      employeeName: item.employeeName ?? item.responsibleEmployeeName ?? '',
    }))
    const sorted = [...list].sort((a, b) => {
      return new Date(b.administeredDateTime ?? 0) - new Date(a.administeredDateTime ?? 0)
    })

    administrations.value = sorted.slice(0, 5)
    totals.value.completedToday = list.filter(item => {
      const status = String(item.status ?? '').toLocaleLowerCase('pt-BR')
      const completed = status === 'administrado' || status === 'administered'

      return completed && isToday(item.administeredDateTime)
    }).length
  } catch (error) {
    // Se esse endpoint ainda não estiver disponível, o dashboard permanece funcional com valor zero.
    console.error('Erro ao carregar administrações do dashboard:', error)
    administrations.value = []
    totals.value.completedToday = 0
  }
}

/**
 * Carrega todos os blocos do painel em paralelo (pacientes, agendamentos, lembretes e administrações).
 * Usa allSettled para que a falha de um bloco não impeça os demais.
 */
const loadDashboard = async () => {
  loading.value = true

  try {
    await Promise.allSettled([
      loadPatients(),
      loadAppointments(),
      loadMedicineReminders(),
      loadMedicationAdministrations(),
    ])
  } finally {
    loading.value = false
  }
}

/**
 * Formata data e hora no padrão brasileiro (dd/mm/aaaa hh:mm:ss); vazio ou inválido vira "-".
 */
const formatDate = value => {
  if (!value)
    return '-'

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('pt-BR')
}

/**
 * Formata só o horário (hh:mm). Se já vier como texto "hh:mm...", corta os 5 primeiros caracteres;
 * se for data, converte para a hora local. Vazio ou inválido vira "-".
 */
const formatTime = value => {
  if (!value)
    return '-'

  if (typeof value === 'string' && /^\d{2}:\d{2}/.test(value))
    return value.slice(0, 5)

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '-'
    : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Define rótulo e cor do status de um lembrete pelos minutos até a dose:
 * negativo = "Atrasado" (vermelho), até 60 min = "Próximo" (amarelo), demais ou sem horário = "Programado" (azul).
 */
const getReminderStatus = item => {
  const minutes = item.liveMinutes ?? minutesUntilDose(item)

  if (!Number.isFinite(minutes))
    return { label: 'Programado', color: 'info' }
  if (minutes < 0)
    return { label: 'Atrasado', color: 'error' }
  if (minutes <= 60)
    return { label: 'Próximo', color: 'warning' }

  return { label: 'Programado', color: 'info' }
}

/**
 * Cor do chip de status da administração (sem diferenciar maiúsculas): administrado = verde, atrasado = amarelo,
 * cancelado/não administrado = vermelho, outros = cinza.
 */
const getAdministrationColor = status => ({
  administrado: 'success',
  administered: 'success',
  atrasado: 'warning',
  cancelado: 'error',
  'não administrado': 'error',
}[String(status ?? '').toLocaleLowerCase('pt-BR')] ?? 'secondary')

/**
 * Cor do chip de status do agendamento: pendente = amarelo, confirmado = azul, realizado = verde,
 * cancelado = vermelho, outros = cinza.
 */
const getAppointmentColor = status => ({
  pendente: 'warning',
  confirmado: 'info',
  realizado: 'success',
  cancelado: 'error',
}[String(status ?? '').toLocaleLowerCase('pt-BR')] ?? 'secondary')

/**
 * Navega para a tela do atalho clicado, usando o nome da rota.
 */
const goTo = route => router.push({ name: route })

// Ao abrir a tela, carrega todos os indicadores e tabelas do painel.
onMounted(loadDashboard)
</script>
