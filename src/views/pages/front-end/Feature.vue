<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <VCard
    hover
    class="card-bg-animation"
  >
    <VCardItem>
      <VCardTitle class="align-center d-flex gap-2 flex-wrap">
        <VIcon :icon="props.icon" />
        <span>{{ props.title }}</span>
      </VCardTitle>
    </VCardItem>
    <VCardText>
      {{ props.text }}
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.card-bg-animation {
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(var(--v-theme-secondary), var(--v-hover-opacity));
  }
}
</style>
