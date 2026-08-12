<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-6">
          <div class="d-flex align-center gap-3">
            <VAvatar
              color="primary"
              variant="tonal"
              size="large"
            >
              <VIcon icon="mdi-account-tie" />
            </VAvatar>

            <div>
              <div class="text-h5 font-weight-bold">
                Detalhes do funcionário
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Informações completas do funcionário cadastrado.
              </div>
            </div>
          </div>

          <div class="d-flex gap-2">
            <VBtn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="openEdit"
            >
              Editar
            </VBtn>
            <VBtn
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              @click="router.push({ name: 'employees' })"
            >
              Voltar
            </VBtn>
          </div>
        </VCardTitle>

        <VDivider />

        <VProgressLinear
          v-if="loading"
          indeterminate
        />

        <VCardText v-else class="pa-6">
          <VRow class="mb-6">
            <VCol cols="12">
              <div class="text-h6 mb-4">Informações do funcionário</div>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis">
                Nome completo
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ employee.name }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis">
                Cargo
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ employee.position || 'Não informado' }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                CPF
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ employee.cpf || 'Não informado' }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                Telefone
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ employee.phone || 'Não informado' }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <div class="text-caption text-medium-emphasis">
                E-mail
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ employee.email || 'Não informado' }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis">
                Data de admissão
              </div>
              <div class="text-body-1 font-weight-bold">
                {{ formatDate(employee.admissionDate) }}
              </div>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <div class="text-caption text-medium-emphasis">
                ID do Departamento
              </div>
              <VChip
                size="small"
                variant="tonal"
                color="primary"
                class="mt-2"
              >
                {{ employee.departmentId || 'Não informado' }}
              </VChip>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { employeesApi } from '@/api/employees-api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const employee = ref({
  id: '',
  name: '',
  cpf: '',
  position: '',
  phone: '',
  email: '',
  admissionDate: '',
  departmentId: null,
})

const formatDate = (date) => {
  if (!date) return 'Não informado'
  
  // Se for string ISO, extrai apenas a parte da data
  let dateString = date
  if (typeof date === 'string' && date.includes('T')) {
    dateString = date.split('T')[0]
  }
  
  const dateObj = new Date(dateString)
  return dateObj.toLocaleDateString('pt-BR')
}

const loadEmployee = async () => {
  try {
    const response = await employeesApi.getById(route.params.id)
    const data = response?.data?.data ?? response?.data
    
    employee.value = data
  } catch (error) {
    console.error('Erro ao carregar funcionário:', error)
    toast.error('Não foi possível carregar os detalhes do funcionário.')
    router.push({ name: 'employees' })
  } finally {
    loading.value = false
  }
}

const openEdit = () => {
  router.push({
    name: 'employees-update',
    params: { id: employee.value.id },
  })
}

onMounted(() => {
  loadEmployee()
})
</script>
