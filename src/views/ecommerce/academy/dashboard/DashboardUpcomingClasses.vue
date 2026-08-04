<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'

const upcomingClasses = [
  {
    name: 'Beginner\'s Guide to Figma',
    episode: 'Session 1',
    date: 'Tuesday, March 05',
    time: '10:00AM - 12:00PM',
    tutor: 'Nancy Sinatra',
    tutorAvatar: avatar1,
  },
  {
    name: 'ReactJS Hooks Masterclass',
    episode: 'Session 2',
    date: 'Wednesday, March 06',
    time: '13:00PM - 15:00PM',
    tutor: 'Bob Segre',
    tutorAvatar: avatar2,
  },
  {
    name: 'Freelance BootCamp',
    episode: 'Session 3',
    date: 'Thursday, March 07',
    time: '17:00PM - 18:00PM',
    tutor: 'Leonard Cohen',
    tutorAvatar: avatar3,
  },
]
</script>

<template>
  <div class="d-flex align-center justify-space-between">
    <h6 class="text-h6">
      Upcoming Classes
    </h6>
    <VBtn
      size="small"
      color="primary"
      variant="text"
      append-icon="mdi-arrow-right"
    >
      SEE ALL
    </VBtn>
  </div>

  <div
    v-for="item in upcomingClasses"
    :key="item.name"
    class="mt-6"
  >
    <VHover v-slot="{ isHovering, props }">
      <VCard
        :elevation="isHovering ? '6' : '2'"
        v-bind="props"
      >
        <VCardText>
          <div class="d-flex align-center flex-wrap justify-space-between">
            <p class="text-base mb-0">
              {{ item.name }}
            </p>
            <span>{{ item.episode }}</span>
          </div>

          <VDivider class="my-4" />

          <div class="d-flex align-center gap-4 flex-wrap text-medium-emphasis mb-6">
            <div class="d-flex align-center gap-2">
              <VIcon icon="mdi-calendar" />
              <span>{{ item.date }}</span>
            </div>
            <VDivider vertical />
            <div class="d-flex align-center gap-2">
              <VIcon icon="mdi-clock-outline" />
              <span>{{ item.time }}</span>
            </div>
          </div>

          <div class="d-flex align-center flex-wrap justify-space-between text-medium-emphasis">
            <div class="d-flex align-center gap-2">
              <VAvatar
                size="24"
                :image="item.tutorAvatar"
              />
              <span>By {{ item.tutor }}</span>
            </div>

            <VBtn
              icon
              variant="text"
              size="x-small"
            >
              <VIcon icon="mdi-message-text-outline" />
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VHover>
  </div>
</template>
