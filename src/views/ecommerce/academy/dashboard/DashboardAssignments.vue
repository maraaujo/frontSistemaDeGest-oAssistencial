<script setup>
const assignments = [
  {
    name: 'Math Homework',
    work: 'Algebra',
    submitDate: 'Tuesday, March 05',
    progress: '10/10',
    status: 'Complete',
  },
  {
    name: 'Complete Essay',
    work: 'History Assignment',
    submitDate: 'Tomorrow',
    progress: '7/10',
    status: 'In Progress',
  },
  {
    name: 'Science Project',
    work: 'Chemistry Assignment',
    submitDate: 'Tomorrow',
    progress: '0/10',
    status: 'Not Started',
  },
]

const assignmentStatus = status => {
  if (status === 'Complete')
    return 'success'
  if (status === 'In Progress')
    return 'primary'
  if (status === 'Not Started')
    return 'error'
  
  return 'secondary'
}
</script>

<template>
  <div class="d-flex align-center justify-space-between">
    <h6 class="text-h6">
      Assignments
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
    v-for="item in assignments"
    :key="item.name"
    class="mt-6"
  >
    <VHover v-slot="{ isHovering, props }">
      <VCard
        :elevation="isHovering ? '6' : '2'"
        v-bind="props"
      >
        <VCardText class="d-flex align-center flex-wrap justify-space-between gap-3">
          <div>
            <h6 class="text-base font-weight-medium">
              {{ item.name }}
            </h6>
            <p class="text-medium-emphasis mb-0">
              {{ item.work }} | {{ item.submitDate }}
            </p>
          </div>
          <span class="text-base text-primary">
            {{ item.progress }}
          </span>
          <VChip
            :color="assignmentStatus(item.status)"
            size="small"
          >
            {{ item.status }}
          </VChip>
        </VCardText>
      </VCard>
    </VHover>
  </div>
</template>
