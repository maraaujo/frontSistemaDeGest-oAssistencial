<script setup>
import VueApexCharts from 'vue3-apexcharts'
import bitcoin from '@images/svg/bitcoin.svg'
import ethereum from '@images/svg/ethereum.svg'

const pinedHoldings = [
  {
    currencyName: 'Bitcoin',
    icon: bitcoin,
    totalHold: 0.541,
    abbr: 'BTC',
    price: '41,258.36',
    profitLoss: 10.5,
  },
  {
    currencyName: 'Ethereum',
    icon: ethereum,
    totalHold: 12.1,
    abbr: 'ETH',
    price: '15,258.36',
    profitLoss: -8.1,
  },
]

const series = [{
  data: [
    {
      x: new Date(1538778600000),
      y: [
        6629.81,
        6650.5,
        6623.04,
        6633.33,
      ],
    },
    {
      x: new Date(1538780400000),
      y: [
        6632.01,
        6643.59,
        6620,
        6630.11,
      ],
    },
    {
      x: new Date(1538782200000),
      y: [
        6630.71,
        6648.95,
        6623.34,
        6635.65,
      ],
    },
    {
      x: new Date(1538784000000),
      y: [
        6635.65,
        6651,
        6629.67,
        6638.24,
      ],
    },
    {
      x: new Date(1538785800000),
      y: [
        6638.24,
        6640,
        6620,
        6624.47,
      ],
    },
    {
      x: new Date(1538787600000),
      y: [
        6624.53,
        6636.03,
        6621.68,
        6624.31,
      ],
    },
    {
      x: new Date(1538787600000),
      y: [
        6624.53,
        6636.03,
        6621.68,
        6624.31,
      ],
    },
    {
      x: new Date(1538789400000),
      y: [
        6624.61,
        6632.2,
        6617,
        6626.02,
      ],
    },
    {
      x: new Date(1538784000000),
      y: [
        6635.65,
        6651,
        6629.67,
        6638.24,
      ],
    },
  ],
}]

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'candlestick',
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    grid: {
      show: false,
      padding: {
        top: -50,
        right: -10,
        bottom: -20,
        left: -20,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { show: false },
    tooltip: { enabled: false },
  }
})
</script>

<template>
  <VRow>
    <VCol
      v-for="hold in pinedHoldings"
      :key="hold.currencyName"
      cols="12"
      sm="6"
    >
      <VCard>
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              class="border-b"
            >
              <div class="d-flex align-center gap-2 mb-1">
                <div class="d-flex align-center gap-2">
                  <component
                    :is="hold.icon"
                    style="inline-size: 24px;"
                  />

                  <h6 class="text-h6">
                    {{ hold.currencyName }}
                  </h6>
                </div>

                <VSpacer />

                <span
                  class="d-flex align-center gap-1"
                  :class="hold.profitLoss > 0 ? 'text-success' : 'text-error'"
                >
                  <VIcon
                    size="16"
                    icon="mdi-arrow-up"
                  />
                  <span>{{ hold.profitLoss }}%</span>
                </span>
              </div>
              <div class="d-flex align-center font-weight-medium flex-wrap">
                <h4 class="text-h4 mb-1">
                  {{ hold.totalHold }} {{ hold.abbr }}
                </h4>
                <VSpacer />
                <span>$ {{ hold.price }}</span>
              </div>
            </VCol>
            <VCol cols="12">
              <VueApexCharts
                :options="chartOptions"
                :series="series"
                :height="80"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
