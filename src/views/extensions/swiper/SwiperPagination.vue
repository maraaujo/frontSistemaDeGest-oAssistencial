<script setup>
import { register } from 'swiper/element/bundle'
import swiper1 from '@images/swiper/colorful-heart.jpg'
import swiper3 from '@images/swiper/colorful-wallpaper.jpg'
import swiper2 from '@images/swiper/exploding-burger.jpg'
import swiper4 from '@images/swiper/fruit-is-word-fruit.jpg'
import swiper5 from '@images/swiper/single-tree.jpg'

register()
</script>

<template>
  <swiper-container
    pagination="true"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper5,
        swiper1,
        swiper2,
        swiper4,
        swiper3,
      ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        height="300"
        cover
      />
    </swiper-slide>
  </swiper-container>
</template>
