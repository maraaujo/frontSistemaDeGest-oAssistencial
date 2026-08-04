<script setup>
const slider1 = ref(50)
const slider2 = ref(50)
const slider3 = ref(50)
const slider4 = ref(50)

const satisfactionEmojis = [
  '😭',
  '😢',
  '☹️',
  '🙁',
  '😐',
  '🙂',
  '😊',
  '😁',
  '😄',
  '😍',
]
</script>

<template>
  <div class="d-flex flex-column">
    <div>
      <div class="text-caption">
        Show thumb when using slider
      </div>
      <VSlider
        v-model="slider1"
        thumb-label
      />
    </div>

    <div>
      <div class="text-caption">
        Always show thumb label
      </div>
      <VSlider
        v-model="slider2"
        thumb-label="always"
      />
    </div>

    <div>
      <div class="text-caption">
        Custom thumb size
      </div>
      <VSlider
        v-model="slider3"
        :thumb-size="36"
        thumb-label="always"
      />
    </div>

    <div>
      <div class="text-caption">
        Custom thumb label
      </div>
      <VSlider
        v-model="slider4"
        thumb-label="always"
      >
        <template #thumb-label="{ modelValue }">
          {{ satisfactionEmojis[Math.min(Math.floor(modelValue / 10), 9)] }}
        </template>
      </VSlider>
    </div>
  </div>
</template>
