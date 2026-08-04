<script setup>
import { useLocale } from 'vuetify'
import VerticalNavGroupItems from '@/layouts/components/vertical-nav/VerticalNavGroupItems.vue'

const props = defineProps({
  navItem: {
    type: Object,
    required: true,
  },
})

const { t } = useLocale()
</script>

<template>
  <VListGroup
    v-if="props.navItem"
    :value="props.navItem.name"
  >
    <template #activator="{ props: activatorProps }">
      <VListItem
        v-bind="activatorProps"
        :prepend-icon="props.navItem.icon"
        :title="t(props.navItem.name)"
      >
        <template #append>
          <VIcon
            class="navigation-group-handler scale-rtl me-n2"
            icon="mdi-chevron-right"
          />
        </template>
      </VListItem>
    </template>

    <VerticalNavGroupItems :nav-item="props.navItem" />
  </VListGroup>
</template>
