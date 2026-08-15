<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="d-flex align-center gap-3 pa-6">
          <VAvatar
            color="primary"
            variant="tonal"
          >
            <VIcon icon="mdi-account-edit" />
          </VAvatar>

          <div>
            <div class="text-h5 font-weight-bold">
              Editar funcionário
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Atualize as informações do funcionário.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VProgressLinear
            v-if="loading"
            indeterminate
            class="mb-6"
          />

          <VForm
            v-else
            ref="formRef"
            @submit.prevent="submit"
          >
            <div class="text-h6 mb-6">
              Dados do funcionário
            </div>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="model.name"
                  label="Nome completo"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="model.position"
                  label="Cargo"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="model.cpf"
                  label="CPF"
                  placeholder="000.000.000-00"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="model.phone"
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <VTextField
                  v-model="model.email"
                  label="E-mail"
                  type="email"
                  :rules="[...requiredRules, emailRule]"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="model.admissionDate"
                  label="Data de admissão"
                  type="date"
                  :rules="requiredRules"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="model.departmentId"
                  label="Departamento"
                  :items="departments"
                  item-title="name"
                  item-value="id"
                  :rules="requiredRules"
                  :loading="loadingDepartments"
                />
              </VCol>
            </VRow>

            <VDivider class="my-6" />

            <div class="d-flex justify-end gap-3">
              <VBtn
                variant="outlined"
                color="secondary"
                :disabled="saving"
                @click="router.push({ name: 'employees' })"
              >
                Cancelar
              </VBtn>

              <VBtn
                color="primary"
                prepend-icon="mdi-content-save"
                :loading="saving"
                @click="submit"
              >
                Salvar alterações
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { departmentsApi } from '@/api/departments-api';
import { employeesApi } from '@/api/employees-api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const route = useRoute()
const router = useRouter()
const formRef = ref()
const loading = ref(true)
const saving = ref(false)
const loadingDepartments = ref(false)
const departments = ref([])

const model = ref({
  id: '',
  name: '',
  cpf: '',
  position: '',
  phone: '',
  email: '',
  admissionDate: '',
  departmentId: null,
})

const requiredRules = [
  v => !!v || 'Este campo é obrigatório',
]

const emailRule = v => {
  return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido'
}

const loadDepartments = async () => {
  loadingDepartments.value = true
  try {
    const response = await departmentsApi.getAll()
    const data = response?.data?.data ?? response?.data
    departments.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erro ao carregar departamentos:', error)
    toast.error('Não foi possível carregar os departamentos.')
  } finally {
    loadingDepartments.value = false
  }
}

const loadEmployee = async () => {
  try {
    const response = await employeesApi.getById(route.params.id)
    const data = response?.data?.data ?? response?.data
    
    // Extrai apenas a data (YYYY-MM-DD) se vier em formato ISO
    if (data.admissionDate && data.admissionDate.includes('T')) {
      data.admissionDate = data.admissionDate.split('T')[0]
    }
    
    model.value = data
  } catch (error) {
    console.error('Erro ao carregar funcionário:', error)
    toast.error('Não foi possível carregar o funcionário.')
    router.push({ name: 'employees' })
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  saving.value = true

  try {
   
    const payload = {

      ...model.value,
    }
 
    await employeesApi.update(model.value.id, payload)
    toast.success('Funcionário atualizado com sucesso!')
    router.push({ name: 'employees' })
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error)
    toast.error('Não foi possível atualizar o funcionário.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadDepartments()
  await loadEmployee()
})
</script>
