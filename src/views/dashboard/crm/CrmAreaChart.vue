<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

const series = [{
  name: 'series2',
  data: [
    12,
    80,
    50,
    35,
    40,
    45,
    31,
  ],
}]

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00',
        '2018-09-19T01:30:00',
        '2018-09-19T02:30:00',
        '2018-09-19T03:30:00',
        '2018-09-19T04:30:00',
        '2018-09-19T05:30:00',
        '2018-09-19T06:30:00',
      ],
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    tooltip: {
      enabled: true,
      x: { format: 'dd/MM/yy HH:mm' },
    },
    colors: [currentTheme.value.primary],
    stroke: {
      curve: 'smooth',
      width: 1,
    },
  }
})
</script>

<template>
  <VCard
    title="Balance Overview"
    subtitle="This Year Sales"
  >
    <VueApexCharts
      :options="chartOptions"
      :series="series"
      :height="290"
    />
  </VCard>
</template>
