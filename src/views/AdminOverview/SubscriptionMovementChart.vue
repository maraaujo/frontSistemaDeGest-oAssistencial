<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['retry'])

const series = computed(() => [
  { name: 'Novas', data: props.data.map(item => item.new) },
  { name: 'Canceladas', data: props.data.map(item => item.canceled) },
])

const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, stacked: false, fontFamily: 'Roboto, sans-serif' },
  colors: ['rgba(var(--v-theme-success), 1)', 'rgba(var(--v-theme-error), 1)'],
  plotOptions: {
    bar: { columnWidth: '55%', borderRadius: 5, borderRadiusApplication: 'end' },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  grid: {
    borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
    xaxis: { lines: { show: false } },
  },
  legend: { labels: { colors: 'rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))' } },
  xaxis: {
    categories: props.data.map(item => item.month),
    labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
  },
  tooltip: {
    y: { formatter: value => `${value} instituições` },
  },
}))
</script>

<template>
  <VCard height="100%">
    <VCardTitle class="d-flex align-center gap-3 pa-6">
      <VIcon
        icon="mdi-swap-vertical-bold"
        color="primary"
      />
      Novas × canceladas
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
        aria-label="Gráfico de barras comparando novas assinaturas e cancelamentos por mês"
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
