<script setup>
import VueApexCharts from 'vue3-apexcharts'
import avatar from '@images/avatars/avatar-2.png'

const courseSpending = [
  {
    title: 'Design Mastery',
    spend: '15H:15m',
    total: '70',
    category: 'Design',
    color: 'success',
  },
  {
    title: 'Ethical Hacking',
    spend: '04H:00m',
    total: '20',
    category: 'Hacking',
    color: 'primary',
  },
]

const donutChartColors = {
  donut: {
    series1: 'rgba(var(--v-theme-primary), 1)',
    series2: 'rgba(var(--v-theme-primary), 0.8)',
    series3: 'rgba(var(--v-theme-primary), 0.5)',
    series4: 'rgba(var(--v-theme-primary), 0.3)',
    series5: 'rgba(var(--v-theme-primary), 0.2)',
    series6: 'rgba(var(--v-theme-primary), 0.08)',
  },
}

const timeSpendingChartConfig = {
  chart: {
    height: 157,
    width: 130,
    parentHeightOffset: 0,
    type: 'donut',
  },
  labels: [
    '36h',
    '56h',
    '16h',
    '32h',
    '56h',
    '16h',
  ],
  colors: [
    donutChartColors.donut.series1,
    donutChartColors.donut.series2,
    donutChartColors.donut.series3,
    donutChartColors.donut.series4,
    donutChartColors.donut.series5,
    donutChartColors.donut.series6,
  ],
  stroke: { width: 0 },
  dataLabels: {
    enabled: false,
    formatter(val) {
      return `${ Number.parseInt(val) }%`
    },
  },
  legend: { show: false },
  tooltip: { theme: false },
  grid: { padding: { top: 0 } },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          value: {
            fontSize: '1.5rem',
            color: 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))',
            fontWeight: 500,
            offsetY: -15,
            formatter(val) {
              return `${ Number.parseInt(val) }%`
            },
          },
          name: { offsetY: 20 },
          total: {
            show: true,
            fontSize: '.7rem',
            label: 'Total',
            color: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
            formatter() {
              return '19%'
            },
          },
        },
      },
    },
  },
}

const timeSpendingChartSeries = [
  23,
  35,
  10,
  20,
  35,
  23,
]
</script>

<template>
  <VCard
    title="Time Spending"
    subtitle="Monthly Report"
  >
    <VCardText class="d-flex align-center">
      <div>
        <VAvatar
          size="42"
          :image="avatar"
        />

        <h6 class="text-h6">
          John Doe
        </h6>

        <h5 class="text-h5 mb-2">
          19<span class="text-medium-emphasis">h</span> 15<span class="text-medium-emphasis">m</span>
        </h5>
      </div>

      <VSpacer />

      <VueApexCharts
        type="donut"
        height="150"
        width="150"
        :options="timeSpendingChartConfig"
        :series="timeSpendingChartSeries"
      />
    </VCardText>

    <VList lines="two">
      <VListItem
        v-for="course in courseSpending"
        :key="course.title"
        :title="course.title"
        :subtitle="course.category"
      >
        <template #prepend>
          <VIcon
            size="10"
            color="secondary"
            icon="mdi-circle"
          />
        </template>
        <template #append>
          <div>
            <span class="me-3 text-sm">{{ course.spend }}</span>
            <VProgressCircular
              :color="course.color"
              size="25"
              :model-value="course.total"
            />
          </div>
        </template>
      </VListItem>
    </VList>

    <VCardText class="pb-3 pt-0">
      <VBtn
        variant="elevated"
        color="primary"
        size="small"
        block
      >
        View full report
      </VBtn>
    </VCardText>
  </VCard>
</template>
