<script setup>
const messages = [
  {
    title: 'Order Confirmed',
    message: 'Your Order has been placed.',
    time: '10:42am',
    date: 'Sun, 26th Nov\'23',
    color: 'warning',
    icon: 'mdi-gift-outline',
  },
  {
    title: 'Shipped',
    message: 'Logistics - FMPNW00289562',
    time: '05:44pm',
    date: 'Mon, 27th Nov\'23',
    color: 'secondary',
    icon: 'mdi-rocket-outline',
  },
  {
    title: 'Out For Delivery',
    message: 'Your item is out for delivery.',
    time: '08:11am',
    date: 'Wed, 29th Nov\'23',
    color: 'info',
    icon: 'mdi-truck-delivery-outline',
  },
  {
    title: 'Delivered',
    message: 'Your item has been delivered.',
    time: '9:47am',
    date: 'Thu, 30th Nov\'23',
    color: 'success',
    icon: 'mdi-gift-open-outline',
  },
]
</script>

<template>
  <VCard title="Today">
    <VCardText>
      <VTimeline
        density="compact"
        truncate-line="both"
        align="start"
      >
        <VTimelineItem
          v-for="message in messages"
          :key="message.time"
          dot-color="rgb(var(--v-theme-surface))"
          size="x-small"
          fill-dot
        >
          <template #icon>
            <VAvatar
              :color="message.color"
              size="24"
            >
              <VIcon
                size="16"
                :icon="message.icon"
              />
            </VAvatar>
          </template>

          <h6 class="text-base font-weight-medium">
            {{ message.title }}
          </h6>
          <p class="text-medium-emphasis mb-1">
            {{ message.message }}
          </p>
          <p class="text-xs text-medium-emphasis mb-0">
            {{ message.date }} - {{ message.time }}
          </p>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
