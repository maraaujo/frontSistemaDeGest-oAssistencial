<script setup>
const props = defineProps({
  subtitle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reverse: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      sm="6"
      :order="reverse ? '2' : '1'"
      class="mt-10"
    >
      <h6 class="text-h6 text-primary">
        {{ subtitle }}
      </h6>
      <h3 class="text-md-h2 text-h3">
        {{ title }}
      </h3>
      <div v-html="description" />
    </VCol>

    <VCol
      cols="12"
      sm="6"
      :order="reverse ? '1' : '2'"
      class="mt-10"
    >
      <VSkeletonLoader
        boilerplate
        type="card"
        class="w-sm-75 mt-5"
        :class="reverse ? 'me-auto' : 'ms-auto'"
      />
    </VCol>
  </VRow>
</template>
