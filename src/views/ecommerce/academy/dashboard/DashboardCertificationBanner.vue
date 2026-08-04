<script setup>
import certificate from '@images/pages/certificate-min.png'
</script>

<template>
  <VCard
    color="#7720cb"
    variant="tonal"
  >
    <VCardText class="d-flex align-center justify-space-between gap-3">
      <div>
        <p class="font-weight-medium mb-1">
          Congratulation 🎉
        </p>
        <h6 class="text-h5 font-weight-medium mb-1">
          Download your python certificate 🥳
        </h6>
        <p class="text-base">
          You have successfully completed the Python course ❤️
        </p>
        <VBtn
          size="x-small"
          icon
          variant="text"
        >
          <VIcon
            size="16"
            icon="mdi-download"
          />
        </VBtn>
        <VBtn
          size="x-small"
          icon
          variant="text"
        >
          <VIcon
            size="16"
            icon="mdi-share"
          />
        </VBtn>
        <VBtn
          size="x-small"
          icon
          variant="text"
        >
          <VIcon
            size="16"
            icon="mdi-file-chart-outline"
          />
        </VBtn>
      </div>
      <div>
        <img
          height="110"
          :src="certificate"
        >
      </div>
    </VCardText>
  </VCard>
</template>
