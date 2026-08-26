<template>
  <RouterView v-slot="{ Component, route }">
    <Component :is="Component" :key="route.fullPath" />
  </RouterView>

  <!-- buy now button -->
</template>
