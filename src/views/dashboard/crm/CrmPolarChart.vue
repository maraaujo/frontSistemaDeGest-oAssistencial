<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

const series = [
  14,
  23,
  21,
  17,
  15,
  18,
  11,
  22,
  21,
]

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'polarArea',
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    stroke: { colors: [currentTheme.value.surface] },
    legend: { show: false },
    fill: { opacity: 0.8 },
    colors: [
      currentTheme.value.primary,
      currentTheme.value.secondary,
      currentTheme.value.warning,
      currentTheme.value.info,
      currentTheme.value.error,
      currentTheme.value.success,
    ],
    yaxis: { show: false },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: 'rgba(var(--v-border-color), var(--v-border-opacity))',
        },
      },
    },
  }
})
</script>

<template>
  <VCard
    title="Monthly Expenses"
    subtitle="Total expenses of this month"
  >
    <VCardText class="pb-0">
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="320"
      />
    </VCardText>

    <VCardText>
      <h6 class="d-flex justify-space-between text-sm font-weight-medium mb-2">
        <span>Pending</span>
        <span>23%</span>
      </h6>
      <VProgressLinear
        rounded
        rounded-bar
        height="6"
        color="primary"
        class="mb-4"
        model-value="80"
      />

      <h6 class="d-flex justify-space-between text-sm font-weight-medium mb-2">
        <span>Paid</span>
        <span>83%</span>
      </h6>
      <VProgressLinear
        rounded
        rounded-bar
        height="6"
        color="error"
        model-value="20"
      />
    </VCardText>
  </VCard>
</template>
