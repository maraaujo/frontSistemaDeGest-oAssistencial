<script setup>
const page = ref(1)
const variant = ref('elevated')
</script>

<template>
  <VSelect
    v-model="variant"
    label="Variant"
    :items="['elevated', 'outlined', 'flat', 'tonal', 'plain', 'text']"
    class="mb-6"
    style="max-inline-size: 10rem;"
  />

  <VPagination
    v-model="page"
    length="4"
    :variant="variant"
    color="secondary"
    active-color="primary"
  />
</template>
