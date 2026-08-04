<script setup>
const items = [
  { title: 'Click Me 1' },
  { title: 'Click Me 2' },
  { title: 'Click Me 3' },
  { title: 'Click Me 4' },
]
</script>

<template>
  <div>
    <VMenu>
      <template #activator="{ props: menu }">
        <VBtn
          color="primary"
          v-bind="menu"
        >
          Dropdown w/ Tooltip
          <VTooltip
            activator="parent"
            location="start"
          >
            Tooltip
          </VTooltip>
        </VBtn>
      </template>
      <VList>
        <VListItem
          v-for="(item, index) in items"
          :key="index"
        >
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>
