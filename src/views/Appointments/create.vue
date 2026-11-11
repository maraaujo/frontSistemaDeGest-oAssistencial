<template>
  <VRow><VCol cols="12"><VCard>
    <VCardTitle class="d-flex align-center gap-3 pa-6"><VAvatar color="primary" variant="tonal"><VIcon icon="mdi-calendar-plus" /></VAvatar><div><div class="text-h5 font-weight-bold">Novo agendamento</div><div class="text-body-2 text-medium-emphasis">Cadastre um novo agendamento no sistema.</div></div></VCardTitle>
    <VDivider />
    <VCardText class="pa-6"><VForm ref="formRef" @submit.prevent="submit"><div class="text-h6 mb-6">Dados do agendamento</div><VRow>
      <VCol cols="12" md="6"><VAutocomplete v-model="model.patientId" label="Paciente" :items="patients" item-title="name" item-value="id" :rules="requiredRules" :loading="loadingOptions" /></VCol>
      <VCol cols="12" md="6"><VAutocomplete v-model="model.responsible" label="Funcionário responsável" :items="employees" item-title="name" item-value="name" :rules="requiredRules" :loading="loadingOptions" /></VCol>
      <VCol cols="12" md="6"><VTextField v-model="model.dateTime" label="Data e hora do agendamento" type="datetime-local" :rules="requiredRules" /></VCol>
      <VCol cols="12" md="6"><VTextField v-model="model.appointmentType" label="Tipo de agendamento" :rules="requiredRules" /></VCol>
      <VCol cols="12" md="6"><VSelect v-model="model.status" label="Status" :items="statusOptions" :rules="requiredRules" /></VCol>
      
      <VCol cols="12"><VTextarea v-model="model.observations" label="Observações" rows="3" auto-grow /></VCol>
    </VRow><VDivider class="my-6" /><div class="d-flex justify-end gap-3"><VBtn color="secondary" variant="outlined" :disabled="saving" @click="router.push({ name: 'appointments' })">Cancelar</VBtn><VBtn color="primary" prepend-icon="mdi-content-save" :loading="saving" type="submit">Salvar</VBtn></div></VForm></VCardText>
  </VCard></VCol></VRow>
</template>

<script setup>
import { appointmentsApi } from '@/api/appointments-api';
import { employeesApi } from '@/api/employees-api';
import { patientsApi } from '@/api/patients-api';
import auth from '@/auth';
import { ensureSuccessfulResponse } from '@/utils/apiResponse';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter()
const formRef = ref()
const saving = ref(false)
const loadingOptions = ref(false)
const patients = ref([])
const employees = ref([])
const statusOptions = ['Pendente', 'Confirmado', 'Realizado', 'Cancelado']
const requiredRules = [value => !!value || 'Este campo é obrigatório']
const model = ref({ patientId: null, responsible: null, appointmentType: '', dateTime: '', description: '', status: 'Pendente', observations: '' })

/**
 * Extrai o conteúdo útil da resposta do axios: usa `data.data` quando a API
 * embrulha o retorno e, se não houver, o próprio `data`.
 */
const getData = response => response?.data?.data ?? response?.data

/**
 * Garante que o retorno vire um array: aceita a lista direta ou uma lista dentro da chave informada,
 * de items ou de $values; caso contrário, devolve [].
 */
const getList = (data, key) => Array.isArray(data) ? data : data?.[key] ?? data?.items ?? data?.$values ?? []

/**
 * Carrega em paralelo pacientes (patientsApi.getAll) e funcionários (employeesApi.getAll)
 * para preencher os campos de seleção do formulário. Mostra um aviso se falhar.
 */
const loadOptions = async () => {
  loadingOptions.value = true
  try {
    const [patientResponse, employeeResponse] = await Promise.all([patientsApi.getAll(), employeesApi.getAll()])
    patients.value = getList(getData(patientResponse), 'patients')
    employees.value = getList(getData(employeeResponse), 'employees')
  } catch (error) {
    console.error('Erro ao carregar opções do agendamento:', error)
    toast.error('Não foi possível carregar pacientes e funcionários.')
  } finally { loadingOptions.value = false }
}

/**
 * Valida o formulário e cadastra o agendamento (POST /Appointment/CreateAppointment).
 * Envia os dados do formulário com o userId do usuário logado, a data/hora convertida para ISO (UTC)
 * e os textos sem espaços nas pontas. O responsável vai como o NOME do funcionário escolhido.
 * Em caso de sucesso, volta para a lista de agendamentos.
 */
const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  const userId = auth.getUserStorage()?.userId
  if (!userId) { toast.error('Não foi possível identificar o usuário autenticado.'); return }
  saving.value = true
  try {
    const response = await appointmentsApi.create({ ...model.value, userId, dateTime: new Date(model.value.dateTime).toISOString(), appointmentType: model.value.appointmentType.trim(), description: model.value.description.trim(), observations: model.value.observations.trim() })
    ensureSuccessfulResponse(response, 'Não foi possível cadastrar o agendamento.')
    toast.success('Agendamento cadastrado com sucesso!')
    router.push({ name: 'appointments' })
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    toast.error(error.response?.data?.errorMessage ?? error.response?.data?.message ?? error.message ?? 'Não foi possível cadastrar o agendamento.')
  } finally { saving.value = false }
}

// Ao abrir a tela, carrega pacientes e funcionários para os campos de seleção.
onMounted(loadOptions)
</script>
