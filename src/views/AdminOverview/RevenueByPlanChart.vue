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
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Roboto, sans-serif' },
  colors: ['rgba(var(--v-theme-primary), 1)'],
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '45%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
      dataLabels: { position: 'top' },
    },
  },
  dataLabels: {
    enabled: true,
    offsetX: 24,
    style: { colors: ['rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))'] },
    formatter: (value, opts) => `${props.data[opts.dataPointIndex]?.percentage ?? 0}%`,
  },
  grid: {
    borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
    yaxis: { lines: { show: false } },
  },
  xaxis: {
    categories: props.data.map(item => item.plan),
    labels: {
      style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' },
      formatter: value => formatCurrency(value),
    },
  },
  yaxis: {
    labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
  },
  tooltip: {
    y: {
      formatter: (value, opts) => `${formatCurrency(value)} · ${props.data[opts.dataPointIndex]?.accounts ?? 0} contas`,
    },
  },
}))
</script>

<template>
  <VCard height="100%">
    <VCardTitle class="d-flex align-center gap-3 pa-6">
      <VIcon
        icon="mdi-chart-bar"
        color="primary"
      />
      Faturamento por plano
    </VCardTitle>
    <VDivider />

    <VCardText class="pa-6">
      <div
        v-if="loading"
        class="d-flex justify-center align-center"
        style="min-height: 260px;"
      >
        <VProgressCircular
          indeterminate
          color="primary"
        />
      </div>

      <div
        v-else-if="error"
        class="d-flex flex-column align-center justify-center gap-3 text-center"
        style="min-height: 260px;"
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
        style="min-height: 260px;"
      >
        Sem dados no período
      </div>

      <div
        v-else
        role="img"
        aria-label="Gráfico de barras horizontais mostrando o faturamento e a participação percentual de cada plano"
      >
        <VueApexCharts
          :options="chartOptions"
          :series="series"
          height="260"
        />
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@styles/libs/apex-chart";
</style>
