<script setup>
const togglePrice = ref(0)
const selectedPlan = ref('Free')

const pricingPlans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    tagLine: 'Easy and quick start',
    features: [
      'SEO-optimized documentation',
      'Beautiful styling out of the box',
      'Custom domains',
      'Auto-generated API docs',
      'Built-in components library',
      'Third-party analytics integrations',
      'In-app search and user logs',
    ],
  },
  {
    name: 'Startup',
    monthlyPrice: 12,
    annualPrice: 140,
    tagLine: 'Built for growing companies',
    features: [
      'The Free plan plus',
      'Unlimited editors',
      'Analytics and conversion insights',
      'ChatGPT for docs',
      'Custom subpaths /docs',
      'White-glove migrations',
      'Prioritized customer support',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    tagLine: 'Fully tailored for your business',
    features: [
      'The Startup plan plus',
      'Authentication and gated content',
      'Multiple documentation instances',
      'Custom integrations',
      'No branding',
      'Translation management',
      'Slack Connect customer support',
    ],
  },
]
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      class="text-center"
    >
      <VBtnToggle
        v-model="togglePrice"
        mandatory
        color="info"
        variant="outlined"
        class="mb-3"
      >
        <VBtn>
          Annually
        </VBtn>
        <VBtn>
          Monthly
        </VBtn>
      </VBtnToggle>
    </VCol>

    <VCol
      v-for="plan in pricingPlans"
      :key="plan.name"
      cols="12"
      md="4"
    >
      <VCard
        max-width="400"
        :ripple="false"
        class="mx-auto"
        :variant="selectedPlan === plan.name ? 'tonal' : 'outlined'"
        @click="selectedPlan = plan.name"
      >
        <VCardText>
          <span>{{ plan.name }}</span>

          <div
            v-if="plan.monthlyPrice === 'Custom'"
            class="mt-4 mb-3"
          >
            <span class="text-h3 font-weight-medium me-1">
              {{ plan.monthlyPrice }}
            </span>
          </div>

          <div
            v-else
            class="mt-4 mb-3"
          >
            <span class="text-h3 font-weight-medium me-1">
              ${{ togglePrice ? plan.monthlyPrice : plan.annualPrice }}
            </span>
            <span>/{{ togglePrice ? 'month' : 'annual' }}</span>
          </div>

          <p class="mb-6">
            {{ plan.tagLine }}
          </p>

          <VBtn
            block
            size="large"
            :color="selectedPlan === plan.name ? 'success' : 'primary'"
          >
            {{ plan.name === 'Free' ? 'Get Started for free' : plan.name === 'Startup' ? 'Buy Now' : 'Contact US' }}
          </VBtn>

          <VList class="mt-4 pb-0 bg-transparent">
            <VListItem
              v-for="feature in plan.features"
              :key="feature"
              :title="feature"
              class="px-0"
            >
              <template #prepend>
                <VIcon
                  :color="selectedPlan === plan.name ? 'success' : 'default'"
                  :icon="selectedPlan === plan.name ? 'mdi-check-circle' : 'mdi-check-circle-outline'"
                />
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
