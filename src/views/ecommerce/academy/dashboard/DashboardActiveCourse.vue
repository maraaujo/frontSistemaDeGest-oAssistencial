<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <VCard>
    <VCardText>
      <VImg
        :src="course.thumbnail"
        rounded
        height="200"
        cover
      />
    </VCardText>
    <VCardText>
      <p>{{ course.category }}</p>
      <h6 class="text-h6">
        {{ course.name }}
      </h6>

      <div class="d-flex align-center gap-3 mb-3">
        <div class="flex-grow-1">
          <VProgressLinear
            color="primary"
            rounded
            rounded-bar
            height="6"
            :model-value="course.progress"
          />
        </div>

        <span>80%</span>
      </div>
      <div class="d-flex flex-wrap gap-3">
        <VBtn
          color="primary"
          class="flex-grow-1"
        >
          Continue
        </VBtn>
        <VBtn
          class="flex-grow-1"
          variant="tonal"
          color="error"
        >
          Remove from active course
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
