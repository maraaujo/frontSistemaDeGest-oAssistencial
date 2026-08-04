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
    class="mySwiper"
    pagination="true"
    navigation="true"
    space-between="30"
    centered-slides="true"
    autoplay-delay="2500"
    autoplay-disable-on-interaction="false"
    events-prefix="swiper-"
  >
    <swiper-slide
      v-for="swiperImg in [
        swiper3,
        swiper1,
        swiper2,
        swiper4,
        swiper5,
      ]"
      :key="swiperImg"
    >
      <VImg
        :src="swiperImg"
        height="300"
        cover
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      />
    </swiper-slide>
  </swiper-container>
</template>
