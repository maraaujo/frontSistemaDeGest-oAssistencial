<script setup>
const model = ref(true)
</script>

<template>
  <VSwitch
    v-model="model"
    inset
    :label="`Switch: ${model.toString()}`"
  />
</template>
