<script setup>
import VerticalNavGroup from '@/layouts/components/vertical-nav/VerticalNavGroup.vue'
import VerticalNavLink from '@/layouts/components/vertical-nav/VerticalNavLink.vue'

const props = defineProps({
  navItem: {
    type: null,
    required: true,
  },
})

const resolveNavLinkGroup = computed(() => {
  return navItem => navItem.children ? VerticalNavGroup : VerticalNavLink
})
</script>

<template>
  <template
    v-for="item in props.navItem.children"
    :key="item.name"
  >
    <Component
      :is="resolveNavLinkGroup(item)"
      :nav-item="item"
    />
  </template>
</template>
