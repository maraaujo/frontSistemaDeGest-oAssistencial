<script setup>
const radios = ref('DuckDuckGo')
</script>

<template>
  <VRadioGroup v-model="radios">
    <template #label>
      <div>Your favorite <strong>search engine</strong></div>
    </template>
    <VRadio value="Google">
      <template #label>
        <div>Of course it's <strong class="text-success">Google</strong></div>
      </template>
    </VRadio>
    <VRadio value="Duckduckgo">
      <template #label>
        <div>Definitely <strong class="text-primary">DuckDuckGo</strong></div>
      </template>
    </VRadio>
  </VRadioGroup>
</template>
