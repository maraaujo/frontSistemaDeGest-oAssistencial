<script setup>
import VueApexCharts from 'vue3-apexcharts'

const series = [
  {
    name: 'Earning',
    data: [
      5,
      10,
      15,
      20,
      15,
      10,
      8,
      5,
    ],
  },
  {
    name: 'Expense',
    data: [
      -5,
      -10,
      -12,
      -15,
      -12,
      -10,
      -8,
      -5,
    ],
  },
]

const chartOptions = computed(() => {
  return {
    chart: {
      parentHeightOffset: 0,
      stacked: true,
      type: 'bar',
      toolbar: { show: false },
    },
    tooltip: { enabled: false },
    legend: { show: false },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '18%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    colors: [
      'rgba(var(--v-theme-primary), 1)',
      'rgba(var(--v-theme-secondary), 1)',
    ],
    dataLabels: { enabled: false },
    grid: {
      show: false,
      padding: {
        top: -40,
        bottom: -20,
        left: -10,
        right: -2,
      },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { labels: { show: false } },
    responsive: [
      {
        breakpoint: 1468,
        options: { plotOptions: { bar: { columnWidth: '22%' } } },
      },
      {
        breakpoint: 1197,
        options: {
          chart: { height: 228 },
          plotOptions: {
            bar: {
              borderRadius: 8,
              columnWidth: '26%',
            },
          },
        },
      },
      {
        breakpoint: 783,
        options: {
          chart: { height: 232 },
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '28%',
            },
          },
        },
      },
      {
        breakpoint: 589,
        options: { plotOptions: { bar: { columnWidth: '16%' } } },
      },
      {
        breakpoint: 520,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '18%',
            },
          },
        },
      },
      {
        breakpoint: 426,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 5,
              columnWidth: '20%',
            },
          },
        },
      },
      {
        breakpoint: 381,
        options: { plotOptions: { bar: { columnWidth: '24%' } } },
      },
    ],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
  }
})

const totalEarnings = [
  {
    avatar: 'mdi-currency-usd',
    avatarColor: 'primary',
    title: 'Sold out',
    subtitle: 'Total Sales',
    earning: '$1.2k',
  },
  {
    avatar: 'mdi-caps-lock',
    avatarColor: 'secondary',
    title: 'Available',
    subtitle: 'Total available',
    earning: '$2k',
  },
]
</script>

<template>
  <VCard>
    <VCardText class="pb-3">
      <VueApexCharts
        :options="chartOptions"
        :series="series"
        height="210"
        class="my-2"
      />
    </VCardText>

    <VList
      lines="two"
      class="px-1"
    >
      <VListItem
        v-for="earning in totalEarnings"
        :key="earning.title"
      >
        <VListItemTitle class="font-weight-medium">
          {{ earning.title }}
        </VListItemTitle>
        <VListItemSubtitle class="text-medium-emphasis">
          {{ earning.subtitle }}
        </VListItemSubtitle>

        <template #prepend>
          <VAvatar
            :icon="earning.avatar"
            :color="earning.avatarColor"
            variant="tonal"
            size="38"
            rounded
          />
        </template>

        <template #append>
          <span class="text-success font-weight-medium">{{ earning.earning }}</span>
        </template>
      </VListItem>
    </VList>
  </VCard>
</template>
