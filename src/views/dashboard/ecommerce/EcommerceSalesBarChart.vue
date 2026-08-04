<script setup>
import VueApexCharts from 'vue3-apexcharts'

const series = [
  {
    name: 'Net Profit',
    data: [
      44,
      55,
      57,
      56,
      61,
      58,
      63,
      60,
    ],
  },
  {
    name: 'Revenue',
    data: [
      76,
      85,
      101,
      98,
      87,
      105,
      91,
      114,
    ],
  },
]

const chartOptions = computed(() => {
  return {
    colors: [
      'rgba(var(--v-theme-primary), 0.4)',
      'rgba(var(--v-theme-primary), 1)',
    ],
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '55%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    grid: {
      borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
      xaxis: { lines: { show: false } },
    },
    legend: { labels: { colors: 'rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))' } },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
      ],
      labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: 'rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))' } } },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter(val) {
          return `$ ${ val } thousands`
        },
      },
    },
    responsive: [{
      breakpoint: 980,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '45%',
            borderRadius: 4,
          },
        },
      },
    }],
  }
})
</script>

<template>
  <VCard
    title="This Year Sales"
    subtitle="Compare sales with last year"
  >
    <VueApexCharts
      :options="chartOptions"
      :series="series"
      :height="350"
    />
  </VCard>
</template>

<style lang="scss">
@use "@styles/libs/apex-chart";
</style>
