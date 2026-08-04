<script setup>
const otp = ref('')
</script>

<template>
  <VOtpInput
    v-model="otp"
    type="password"
    length="5"
  />
</template>
