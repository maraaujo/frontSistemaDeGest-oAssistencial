<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['retry'])

const STATUS_META = {
  active: { label: 'Ativas', color: 'success' },
  trial: { label: 'Trial', color: 'info' },
  past_due: { label: 'Inadimplentes', color: 'warning' },
  canceling: { label: 'Em cancelamento', color: 'error' },
}

// ApexCharts precisa de cores literais (hex/rgb) para calcular tons do donut;
// não aceita `var(--v-theme-*)` cru, por isso resolvemos via useTheme().
const vuetifyTheme = useTheme()
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

const total = computed(() => props.data.reduce((sum, item) => sum + item.count, 0))

const series = computed(() => props.data.map(item => item.count))

const chartOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'Roboto, sans-serif' },
  labels: props.data.map(item => STATUS_META[item.status]?.label ?? item.status),
  colors: props.data.map(item => currentTheme.value[STATUS_META[item.status]?.color ?? 'secondary']),
  legend: {
    position: 'bottom',
    labels: { colors: currentTheme.value['on-surface'] },
    formatter: (seriesName, opts) => `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`,
  },
  dataLabels: { enabled: false },
  stroke: { colors: [currentTheme.value.surface] },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: currentTheme.value['on-surface'],
            formatter: () => total.value,
          },
        },
      },
    },
  },
  tooltip: {
    y: {
      formatter: (value, opts) => `${value} (${((value / total.value) * 100).toFixed(1)}%)`,
    },
  },
}))
</script>

<template>
  <VCard height="100%">
    <VCardTitle class="d-flex align-center gap-3 pa-6">
      <VIcon
        icon="mdi-chart-donut"
        color="primary"
      />
      Assinaturas por situação
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
        v-else-if="!total"
        class="d-flex align-center justify-center text-medium-emphasis"
        style="min-height: 300px;"
      >
        Sem dados no período
      </div>

      <div
        v-else
        role="img"
        aria-label="Gráfico de rosca mostrando a distribuição das instituições por situação da assinatura"
      >
        <VueApexCharts
          :options="chartOptions"
          :series="series"
          type="donut"
          height="300"
        />
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@styles/libs/apex-chart";
</style>
