<script setup>
import MasonryWall from '@yeger/vue-masonry-wall'
import bird from '@images/masonry/bird-with-bright-orange-feathers.jpg'
import books from '@images/masonry/books.jpg'
import girl from '@images/masonry/girl-field-flowers.jpg'
import leaf from '@images/masonry/leaf-with-rain-drops-it.jpg'
import redBarn from '@images/masonry/red-barn-sits-field-corn.jpg'
import mountain from '@images/masonry/top-mountain-view.jpg'
import womanMeditating from '@images/masonry/woman-meditating.jpg'
import sunflower from '@images/masonry/yellow-sunflower.jpg'

const items = [
  {
    img: bird,
    caption: 'Nature Love',
  },
  {
    img: girl,
    caption: 'Smile the Most beautiful thing in world!',
  },
  {
    img: mountain,
    caption: 'Rising Life',
  },
  {
    img: leaf,
    caption: 'Raining Emotions',
  },
  {
    img: redBarn,
    caption: 'Home Sweet Home!',
  },
  {
    img: sunflower,
    caption: 'Color of Life',
  },
  {
    img: womanMeditating,
    caption: 'Inner Peace',
  },
  {
    img: books,
    caption: 'Universe',
  },
]
</script>

<template>
  <MasonryWall
    :items="items"
    :column-width="300"
    :gap="24"
  >
    <template #default="{ item }">
      <VCard elevation="5">
        <VImg :src="item.img" />

        <VCardText>
          <span class="text-caption">Caption</span>
          <h6 class="text-h6">
            {{ item.caption }}
          </h6>
        </VCardText>
      </VCard>
    </template>
  </MasonryWall>
</template>
