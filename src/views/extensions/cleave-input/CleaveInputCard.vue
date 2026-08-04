<script setup>
import CleaveInput from '@/components/CleaveInput.vue'

const inputValue = ref()
const cardType = ref()

const onChangeF = type => {
  cardType.value = type
}
</script>

<template>
  <CleaveInput
    v-model="inputValue"
    label="Cards"
    placeholder="Enter Card Number"
    :options="{
      creditCard: true,
      onCreditCardTypeChanged: onChangeF,
    }"
  />

  <div
    v-show="cardType && cardType !== 'unknown'"
    class="mt-3"
  >
    Card type: {{ cardType }}
  </div>
</template>
