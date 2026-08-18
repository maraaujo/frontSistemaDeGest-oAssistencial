<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  count: { type: Number, default: 0 },
  plans: { type: Array, default: () => [] },
})

const emit = defineEmits(['search', 'retry', 'pageChange'])

const statusOptions = [
  { code: 'active', label: 'Ativa' },
  { code: 'trial', label: 'Trial' },
  { code: 'past_due', label: 'Inadimplente' },
  { code: 'canceling', label: 'Cancelando' },
]

const filters = ref({ search: '', status: null, plan: null })

const headers = [
  { title: 'Instituição', key: 'name', sortable: true },
  { title: 'Plano', key: 'plan', sortable: false },
  { title: 'Faturamento mensal', key: 'monthlyRevenue', sortable: true, align: 'end' },
  { title: 'Idosos', key: 'residents', sortable: true, align: 'end' },
  { title: 'Adesão', key: 'adherencePct', sortable: true },
  { title: 'Situação', key: 'status', sortable: true },
  { title: 'Renovação', key: 'renewalText', sortable: false },
]

const formatCurrency = value => Number(value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const adherenceColor = value => {
  if (value >= 95)
    return 'success'
  if (value >= 90)
    return 'warning'

  return 'error'
}

const submit = () => emit('search', { ...filters.value })

const clearFilters = () => {
  filters.value = { search: '', status: null, plan: null }
  emit('search', { ...filters.value })
}

const onRowClick = (event, { item }) => {
  // Detalhe da instituição fica fora do escopo desta tela (seção 14 da especificação).
  console.info('Abrir detalhe da instituição:', item.id)
}
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center justify-space-between flex-wrap gap-3 pa-6">
      <div class="d-flex align-center gap-3">
        <VIcon
          icon="mdi-domain"
          color="primary"
        />
        Instituições
      </div>
      <span class="text-body-2 text-medium-emphasis">{{ count }} instituições encontradas</span>
    </VCardTitle>

    <VDivider />

    <VCardText class="pa-6">
      <VForm @submit.prevent="submit">
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="filters.search"
              label="Buscar por nome"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="filters.status"
              label="Situação"
              :items="statusOptions"
              item-title="label"
              item-value="code"
              clearable
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="filters.plan"
              label="Plano"
              :items="plans"
              item-title="name"
              item-value="id"
              clearable
            />
          </VCol>

          <VCol
            cols="12"
            class="d-flex justify-end gap-3"
          >
            <VBtn
              color="primary"
              prepend-icon="mdi-magnify"
              type="submit"
              :loading="loading"
            >
              Pesquisar
            </VBtn>

            <VBtn
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-filter-remove"
              :disabled="loading"
              @click="clearFilters"
            >
              Limpar filtros
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>

    <VDivider />

    <div
      v-if="error"
      class="d-flex flex-column align-center justify-center gap-3 pa-10 text-center"
    >
      <span class="text-body-2 text-medium-emphasis">{{ error }}</span>
      <VBtn
        size="small"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-refresh"
        @click="emit('retry')"
      >
        Tentar novamente
      </VBtn>
    </div>

    <template v-else>
      <VDataTable
        :headers="headers"
        :items="items"
        :loading="loading"
        loading-text="Carregando instituições..."
        no-data-text="Sem dados no período"
        hide-default-footer
        class="text-no-wrap"
        @click:row="onRowClick"
      >
        <template #[`item.name`]="{ item }">
          <strong class="text-high-emphasis">{{ item.name }}</strong>
        </template>

        <template #[`item.plan`]="{ item }">
          <VChip
            size="small"
            variant="tonal"
            color="secondary"
          >
            {{ item.plan?.name }}
          </VChip>
        </template>

        <template #[`item.monthlyRevenue`]="{ item }">
          <span
            class="d-block text-right"
            style="font-variant-numeric: tabular-nums;"
          >
            {{ formatCurrency(item.monthlyRevenue) }}
          </span>
        </template>

        <template #[`item.residents`]="{ item }">
          <span class="d-block text-right">{{ item.residents }}</span>
        </template>

        <template #[`item.adherencePct`]="{ item }">
          <div
            class="d-flex align-center gap-2"
            style="min-width: 140px;"
          >
            <VProgressLinear
              :model-value="item.adherencePct"
              :color="adherenceColor(item.adherencePct)"
              height="8"
              rounded
              class="flex-grow-1"
            />
            <span
              class="text-caption"
              style="min-width: 42px;"
            >
              {{ item.adherencePct.toFixed(1) }}%
            </span>
          </div>
        </template>

        <template #[`item.status`]="{ item }">
          <VChip
            :color="item.statusMeta?.color"
            variant="tonal"
            size="small"
            :prepend-icon="item.statusMeta?.icon"
          >
            {{ item.statusMeta?.label }}
          </VChip>
        </template>
      </VDataTable>

      <VCardText>
        <VPagination
          :model-value="page"
          color="secondary"
          active-color="primary"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="emit('pageChange', $event)"
        />
      </VCardText>
    </template>
  </VCard>
</template>
