<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

const series = [
  {
    name: 'Sales',
    data: [
      31,
      40,
      28,
      51,
      42,
      109,
      100,
    ],
  },
  {
    name: 'Export',
    data: [
      11,
      32,
      45,
      32,
      34,
      52,
      41,
    ],
  },
]

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'area',
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    colors: [
      currentTheme.value.primary,
      currentTheme.value.warning,
    ],
    dataLabels: { enabled: false },
    grid: {
      borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
      xaxis: { lines: { show: false } },
    },
    stroke: {
      curve: 'smooth',
      width: 0,
    },
    legend: { labels: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-19T01:30:00.000Z',
        '2018-09-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-09-19T04:30:00.000Z',
        '2018-09-19T05:30:00.000Z',
        '2018-09-19T06:30:00.000Z',
      ],
      labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } } },
    tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
  }
})
</script>

<template>
  <VCard title="Sales">
    <VCardText>
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="250"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss">
@use "@styles/libs/apex-chart";
</style>
