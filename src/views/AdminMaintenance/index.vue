<template>
  <VRow justify="center">
    <VCol
      cols="12"
      md="8"
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
            <div class="text-body-2 text-medium-emphasis">
              Ações administrativas de limpeza — exclusivas do administrador da plataforma.
            </div>
          </div>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-6">
          <VCard
            variant="outlined"
            color="error"
          >
            <VCardText>
              <div class="d-flex flex-wrap align-center justify-space-between gap-4">
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    Apagar todos os medicamentos programados
                  </div>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    Remove <strong>todos</strong> os medicamentos programados (tela "Administração de
                    medicamentos") de <strong>todas as instituições</strong>, junto com as
                    administrações do histórico vinculadas a eles. Esta ação é
                    <strong>irreversível</strong>.
                  </div>

                  <VChip
                    v-if="!loadingCount"
                    color="error"
                    variant="tonal"
                    size="small"
                    class="mt-3"
                    prepend-icon="mdi-pill"
                  >
                    {{ scheduledCount }} medicamento(s) programado(s) atualmente
                  </VChip>
                  <VProgressCircular
                    v-else
                    indeterminate
                    size="20"
                    width="2"
                    color="error"
                    class="mt-3"
                  />
                </div>

                <VBtn
                  color="error"
                  prepend-icon="mdi-trash-can-outline"
                  :disabled="deleting"
                  @click="openConfirm"
                >
                  Apagar tudo
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Diálogo de confirmação -->
    <VDialog
      v-model="confirmOpen"
      max-width="520"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex align-center gap-2 text-error">
          <VIcon icon="mdi-alert" />
          Confirmar exclusão em massa
        </VCardTitle>

        <VCardText>
          <p class="mb-4">
            Você vai apagar <strong>permanentemente</strong> todos os medicamentos programados
            e as administrações vinculadas, de <strong>todas as instituições</strong>.
            Não há como desfazer.
          </p>

          <p class="mb-2 text-body-2">
            Para confirmar, digite <strong>APAGAR</strong> no campo abaixo:
          </p>

          <VTextField
            v-model="confirmText"
            placeholder="APAGAR"
            variant="outlined"
            density="compact"
            autocomplete="off"
            :disabled="deleting"
          />
        </VCardText>

        <VCardActions class="px-4 pb-4">
          <VSpacer />
          <VBtn
            variant="text"
            color="secondary"
            :disabled="deleting"
            @click="confirmOpen = false"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="error"
            variant="flat"
            prepend-icon="mdi-trash-can-outline"
            :loading="deleting"
            :disabled="confirmText.trim().toUpperCase() !== 'APAGAR'"
            @click="confirmDelete"
          >
            Apagar definitivamente
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>

<script setup>
import { medicinePatientClinicalConditionsApi } from '@/api/medicine-patient-clinical-conditions-api'
import { ensureSuccessfulResponse } from '@/utils/apiResponse'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const scheduledCount = ref(0)
const loadingCount = ref(false)
const confirmOpen = ref(false)
const confirmText = ref('')
const deleting = ref(false)

const getList = value => {
  if (Array.isArray(value))
    return value

  if (value?.$values)
    return value.$values

  return value ? [value] : []
}

const loadCount = async () => {
  loadingCount.value = true
  try {
    const response = await medicinePatientClinicalConditionsApi.getAll()
    const data = response?.data?.data ?? response?.data
    scheduledCount.value = getList(data).length
  } catch (error) {
    console.error('Erro ao carregar a contagem de medicamentos programados:', error)
  } finally {
    loadingCount.value = false
  }
}

const openConfirm = () => {
  confirmText.value = ''
  confirmOpen.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    const response = await medicinePatientClinicalConditionsApi.deleteAll()

    ensureSuccessfulResponse(response, 'Não foi possível concluir a exclusão.')

    toast.success(response?.data?.message ?? 'Dados removidos com sucesso.')
    confirmOpen.value = false
    await loadCount()
  } catch (error) {
    console.error('Erro ao apagar os medicamentos programados:', error)
    toast.error(
      error.response?.data?.errorMessage
      ?? error.response?.data?.message
      ?? error.message
      ?? 'Não foi possível concluir a exclusão.',
    )
  } finally {
    deleting.value = false
  }
}

onMounted(loadCount)
</script>
