<script setup>
import sunset from '@images/pages/hotel.jpg'
import FloatingCard from '@/components/FloatingCard.vue'
</script>

<template>
  <FloatingCard
    title="Visit Luxurious hotel"
    subtitle="At affordable price"
    :image="{ src: sunset, height: '185' }"
  >
    <VCardText>
      Sesame snaps jelly icing jujubes candy canes chocolate. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque fugiat pariatur ipsum voluptatibus magni sapiente odio voluptas consectetur corporis nam, molestiae in, dolorem facilis, dignissimos nesciunt inventore nisi mollitia quod?
    </VCardText>
  </FloatingCard>
</template>
