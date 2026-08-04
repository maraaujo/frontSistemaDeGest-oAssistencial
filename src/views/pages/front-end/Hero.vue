<script setup>
import heroImg from '@images/primedash.png'
</script>

<template>
  <div class="d-flex flex-column text-center py-16 gap-16">
    <div class="mx-10">
      <VChip
        color="primary"
        class="mb-4"
      >
        Made with Vuejs and Vuetify
      </VChip>
      <h1 class="text-md-h1 text-sm-h2">
        Build your landing <br> in seconds
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
      </p>

      <div class="d-flex align-center gap-4 justify-center mt-10">
        <VBtn
          append-icon="mdi-chevron-double-right"
          color="primary"
        >
          Get started
        </VBtn>

        <VBtn
          append-icon="mdi-cart-outline"
          variant="outlined"
          color="info"
        >
          Buy Now
        </VBtn>
      </div>
    </div>

    <VCard
      class="flex-grow-1 w-100 w-sm-75 mx-auto"
      hover
    >
      <VImg
        :src="heroImg"
        alt="hero image"
      />
    </VCard>
  </div>
</template>
