<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['retry'])

const formatCurrency = value => Number(value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const series = computed(() => [{ name: 'Faturamento', data: props.data.map(item => item.amount) }])

const chartOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, fontFamily: 'Roboto, sans-serif' },
  colors: ['rgba(var(--v-theme-primary), 1)'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] },
  },
  stroke: { curve: 'smooth', width: 3 },
  markers: { size: 4, strokeWidth: 0 },
  dataLabels: { enabled: false },
  grid: {
    borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
    xaxis: { lines: { show: false } },
  },
  xaxis: {
    categories: props.data.map(item => item.month),
    labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' },
      formatter: value => formatCurrency(value),
    },
  },
  tooltip: {
    y: { formatter: value => formatCurrency(value) },
  },
}))
</script>

<template>
  <VCard height="100%">
    <VCardTitle class="d-flex align-center gap-3 pa-6">
      <VIcon
        icon="mdi-chart-areaspline"
        color="primary"
      />
      Evolução do faturamento
    </VCardTitle>
    <VDivider />

    <VCardText class="pa-6">
      <div
        v-if="loading"
        class="d-flex justify-center align-center"
        style="min-height: 300px;"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </div>

      <div
        v-else-if="error"
        class="d-flex flex-column align-center justify-center gap-3 text-center"
        style="min-height: 300px;"
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

      <div
        v-else-if="!data.length"
        class="d-flex align-center justify-center text-medium-emphasis"
        style="min-height: 300px;"
      >
        Sem dados no período
      </div>

      <div
        v-else
        role="img"
        aria-label="Gráfico de linha mostrando a evolução mensal do faturamento"
      >
        <VueApexCharts
          :options="chartOptions"
          :series="series"
          height="300"
        />
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@styles/libs/apex-chart";
</style>
