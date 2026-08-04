<script setup>
const selected = ref()
</script>

<template>
  <VCombobox
    v-model="selected"
    chips
    label="Combobox"
    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
  />
</template>
