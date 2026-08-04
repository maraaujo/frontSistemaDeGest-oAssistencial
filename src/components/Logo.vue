<script setup>
import logo from '@images/logo.png';

const props = defineProps({
  size: {
    type: [Number, String],
    default: 90,
  },
})

const logoSize = computed(() => {
  return typeof props.size === 'number' || /^\d+(\.\d+)?$/.test(props.size)
    ? `${props.size}px`
    : props.size
})
</script>

<template>
  <span
    class="app-logo"
    :style="{ '--logo-size': logoSize }"
  >
    <img
      :src="logo"
      class="app-logo__image"
      alt="Logo"
    >
  </span>
</template>

<style scoped>
.app-logo {
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  overflow: hidden;
  block-size: var(--logo-size);
  inline-size: calc(var(--logo-size) * 2);
}

.app-logo__image {
  position: absolute;
  inset-block-start: 54%;
  inset-inline-start: 57%;
  max-inline-size: none;
  inline-size: 170%;
  transform: translate(-50%, -50%);
}
</style>
