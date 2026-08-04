<script setup>
import CrmAreaChart from './CrmAreaChart.vue'
import CrmBar from './CrmBar.vue'
import CrmCryptoStatus from './CrmCryptoStatus.vue'
import CrmMonthlyEarnings from './CrmMonthlyEarnings.vue'
import CrmOrderList from './CrmOrderList.vue'
import CrmPolarChar from './CrmPolarChart.vue'
import CrmRecentTransition from './CrmRecentTransition.vue'
import CrmSwiper from './CrmSwiper.vue'
import CrmUpcomingActivities from './CrmUpcomingActivities.vue'
</script>

<template>
  <VRow>
    <!-- Swiper -->
    <VCol
      cols="12"
      sm="8"
    >
      <CrmSwiper />
    </VCol>

    <!-- Monthly Earnings -->
    <VCol
      cols="12"
      sm="4"
    >
      <CrmMonthlyEarnings />
    </VCol>

    <!-- Area chart -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <CrmAreaChart />
    </VCol>

    <!-- Crypto holding status -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <CrmCryptoStatus />
    </VCol>

    <!-- Crypto holding status -->
    <VCol
      cols="12"
      md="6"
      lg="4"
    >
      <CrmBar />
    </VCol>

    <!-- Polar Chart -->
    <VCol
      cols="12"
      md="6"
    >
      <CrmPolarChar />
    </VCol>

    <!-- Recent Transition -->
    <VCol
      cols="12"
      md="6"
    >
      <CrmRecentTransition />
    </VCol>

    <!-- Upcoming Activities -->
    <VCol
      cols="12"
      md="6"
    >
      <CrmUpcomingActivities />
    </VCol>

    <!-- Order list -->
    <VCol
      cols="12"
      lg="6"
    >
      <CrmOrderList />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@styles/libs/apex-chart";
</style>
