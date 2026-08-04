<script setup>
import HorizontalNavGroup from '@/layouts/components/horizontal-nav/HorizontalNavGroup.vue'
import HorizontalNavLink from '@/layouts/components/horizontal-nav/HorizontalNavLink.vue'

const props = defineProps({
  navItem: {
    type: null,
    required: true,
  },
})

const resolveNavLinkGroup = computed(() => {
  return navItem => {
    return navItem.children ? HorizontalNavGroup : HorizontalNavLink
  }
})
</script>

<template>
  <VMenu
    activator="parent"
    location="end"
    offset="10"
    class="nav-content"
    content-class="horizontal-nav-menu-child-content"
  >
    <VList>
      <template
        v-for="item in props.navItem.children"
        :key="item.name"
      >
        <Component
          :is="resolveNavLinkGroup(item)"
          :nav-item="item"
        />
      </template>
    </VList>
  </VMenu>
</template>
