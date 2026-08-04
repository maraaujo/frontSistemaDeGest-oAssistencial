<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

const series = [{
  data: [
    21,
    22,
    10,
    28,
    16,
    21,
  ],
}]

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    grid: {
      xaxis: { lines: { show: false } },
      padding: {
        top: -10,
        right: 0,
        bottom: 5,
      },
    },
    colors: [
      currentTheme.value.primary,
      currentTheme.value.secondary,
      currentTheme.value.warning,
      currentTheme.value.info,
      currentTheme.value.error,
      currentTheme.value.success,
    ],
    plotOptions: {
      bar: {
        columnWidth: '20%',
        distributed: true,
        colors: {
          backgroundBarColors: [
            'rgba(var(--v-theme-primary), 0.2)',
            'rgba(var(--v-theme-secondary), 0.2)',
            'rgba(var(--v-theme-warning), 0.2)',
            'rgba(var(--v-theme-info), 0.2)',
            'rgba(var(--v-theme-error), 0.2)',
            'rgba(var(--v-theme-success), 0.2)',
          ],
          backgroundBarRadius: 5,
        },
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        [
          'John',
          'Doe',
        ],
        [
          'Joe',
          'Smith',
        ],
        [
          'Jake',
          'Williams',
        ],
        [
          'Peter',
          'Brown',
        ],
        [
          'Mary',
          'Evans',
        ],
        [
          'Peter',
          'Brown',
        ],
      ],
      labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
      axisBorder: { show: false },
      axisTicks: { color: 'rgba(var(--v-border-color), var(--v-border-opacity))' },
    },
    yaxis: { labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } } },
  }
})
</script>

<template>
  <VueApexCharts
    :options="chartOptions"
    :series="series"
    :height="300"
  />
</template>
