<script setup>
const checkbox = ref(false)
</script>

<template>
  <VCheckbox v-model="checkbox">
    <template #label>
      I agree that Vuetify is awesome
    </template>
  </VCheckbox>
</template>
