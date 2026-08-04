<script setup>
import EcommerceAreaChart from './EcommerceAreaChart.vue'
import EcommerceCarousel from './EcommerceCarousel.vue'
import EcommerceCrypto from './EcommerceCrypto.vue'
import EcommerceFloating from './EcommerceFloating.vue'
import EcommercePost from './EcommercePost.vue'
import EcommerceSalesBarChart from './EcommerceSalesBarChart.vue'
import EcommerceTask from './EcommerceTask.vue'
import EcommerceTimeline from './EcommerceTimeline.vue'
import laptop from '@images/pages/working-laptop-while-sitting-chair.png'
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VCard style="background-color: rgba(var(--v-theme-primary), 0.14);">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              sm="7"
              order="2"
              order-sm="1"
            >
              <h5 class="text-h5 font-weight-medium">
                Manage your monthly spends with ease and save more.
              </h5>
              <p class="text-medium-emphasis mt-sm-4 mb-1">
                45% off on all purchases above <strong class="text-high-emphasis">$199</strong>.
              </p>

              <p class="text-medium-emphasis mb-sm-4">
                Use code <strong class="text-high-emphasis">SAVE45</strong>.
              </p>

              <VBtn
                color="error"
                class="me-4"
              >
                Checkout
              </VBtn>

              <VBtn color="primary">
                Learn More
              </VBtn>
            </VCol>

            <VCol
              cols="12"
              sm="5"
              class="py-0"
              order="1"
              order-sm="2"
            >
              <div class="ms-sm-n6 my-sm-n8 w-100 text-sm-end text-center">
                <img
                  :src="laptop"
                  height="250"
                >
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <VCard>
            <VCardText class="d-flex align-center justify-space-between">
              <div>
                <h4 class="text-h4">
                  $92
                </h4>
                <span class="font-weight-semibold">Earnings</span>
              </div>

              <VProgressCircular
                size="56"
                color="warning"
                model-value="35"
              />
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <VCard>
            <VCardItem>
              <template #prepend>
                <VAvatar
                  color="primary"
                  rounded
                >
                  <VIcon icon="mdi-cart-plus" />
                </VAvatar>
              </template>
              <VCardTitle>200.32k</VCardTitle>
              <VCardSubtitle>New Orders</VCardSubtitle>
            </VCardItem>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <VCard>
            <VCardText class="d-flex align-center justify-space-between">
              <div>
                <h4 class="text-h4">
                  335
                </h4>
                <span class="font-weight-semibold">Subscribers</span>
              </div>

              <VProgressCircular
                size="56"
                color="info"
                model-value="20"
              />
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          sm="6"
        >
          <VCard>
            <VCardItem>
              <template #prepend>
                <VAvatar
                  color="error"
                  rounded
                >
                  <VIcon icon="mdi-cancel" />
                </VAvatar>
              </template>
              <VCardTitle>8,649</VCardTitle>
              <VCardSubtitle>Cancelled Orders</VCardSubtitle>
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <EcommerceCarousel />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <EcommerceCrypto />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <EcommerceTimeline />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <EcommercePost />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <EcommerceTask />
    </VCol>

    <VCol
      cols="12"
      sm="6"
    >
      <EcommerceAreaChart />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <EcommerceSalesBarChart />
    </VCol>

    <VCol
      cols="12"
      sm="6"
      md="4"
    >
      <EcommerceFloating />
    </VCol>
  </VRow>
</template>
