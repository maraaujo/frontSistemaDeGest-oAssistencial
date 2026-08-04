<script setup>
import { useSortable } from '@vueuse/integrations/useSortable'
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'

const handler = ref(null)

const list = ref([
  {
    title: 'Jayvion Simon',
    avatar: avatar1,
  },
  {
    title: 'Lainey Davidson',
    avatar: avatar2,
  },
  {
    title: 'Melanie Noble',
    avatar: avatar3,
  },
])

useSortable(handler, list, {
  handle: '.handle',
  animation: 150,
})
</script>

<template>
  <VList
    ref="handler"
    variant="outlined"
  >
    <VListItem
      v-for="item in list"
      :key="item.title"
      :title="item.title"
      class="py-3 rounded mb-2"
    >
      <template #prepend>
        <VBtn
          icon
          size="small"
          variant="text"
          class="handle me-3"
        >
          <VIcon icon="mdi-cursor-move" />
        </VBtn>
      </template>

      <template #append>
        <VAvatar :image="item.avatar" />
      </template>
    </VListItem>
  </VList>
</template>
