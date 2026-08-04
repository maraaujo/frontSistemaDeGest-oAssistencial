<script setup>
import designCourse from '@images/pages/design-course.jpg'
import hacking from '@images/pages/ethical-hacking-course.jpg'
import DashboardActiveCourse from '@/views/ecommerce/academy/dashboard/DashboardActiveCourse.vue'
import DashboardAssignments from '@/views/ecommerce/academy/dashboard/DashboardAssignments.vue'
import DashboardCertificationBanner from '@/views/ecommerce/academy/dashboard/DashboardCertificationBanner.vue'
import DashboardTimeSpending from '@/views/ecommerce/academy/dashboard/DashboardTimeSpending.vue'
import DashboardUpcomingClasses from '@/views/ecommerce/academy/dashboard/DashboardUpcomingClasses.vue'

const activeCourse = [
  {
    name: 'Design Mastery',
    category: 'Design',
    progress: 80,
    thumbnail: designCourse,
  },
  {
    name: 'Ethical Hacking',
    category: 'Hacking',
    progress: 20,
    thumbnail: hacking,
  },
]
</script>

<template>
  <section>
    <VRow>
      <VCol
        cols="12"
        order="2"
        order-md="1"
      >
        <h2 class="text-h6 font-weight-regular">
          Active Courses
        </h2>
      </VCol>

      <VCol
        v-for="course in activeCourse"
        :key="course.name"
        cols="12"
        sm="6"
        md="4"
        order="3"
        order-md="2"
      >
        <DashboardActiveCourse :course="course" />
      </VCol>

      <VCol
        cols="12"
        md="4"
        order="1"
        order-md="2"
      >
        <DashboardTimeSpending />
      </VCol>
    </VRow>

    <VRow class="mt-6">
      <VCol
        cols="12"
        md="6"
      >
        <DashboardUpcomingClasses />
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <DashboardAssignments />

        <DashboardCertificationBanner class="mt-6" />
      </VCol>
    </VRow>
  </section>
</template>
