<script setup>
const rating = ref(3)
</script>

<template>
  <VRating
    v-model="rating"
    hover
  />
</template>
