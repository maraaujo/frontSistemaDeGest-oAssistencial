<script setup>
import LogoComponent from '@/components/Logo.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
</script>

<template>
  <VToolbar
    class="top-navbar bg-surface rounded mt-10 position-sticky"
    style="z-index: 10; inset-block-start: 0;"
    elevation="2"
  >
    <VToolbarTitle class="font-weight-bold">
      <div class="d-flex align-center gap-3">
        <LogoComponent class="text-primary" />
        <span>PrimeDash</span>
      </div>
    </VToolbarTitle>

    <ul
      class="align-center px-3 gap-x-0 rounded-full d-none d-md-flex"
      style="list-style: none;"
    >
      <li class="relative">
        <a
          class="py-2 px-4 font-weight-medium text-high-emphasis"
          href="#features"
        >Features</a>
      </li>
      <li class="relative">
        <a
          class="py-2 px-4 font-weight-medium text-high-emphasis"
          href="#pricing"
        >Pricing</a>
      </li>
      <li class="relative">
        <a
          class="font-weight-medium py-2 px-4 text-high-emphasis"
          href="#testimonials"
        >Testimonials</a>
      </li>
      <li class="relative">
        <a
          class="font-weight-medium py-2 px-4 text-high-emphasis"
          href="#faqs"
        >FAQ</a>
      </li>
    </ul>

    <ThemeSwitcher class="me-3" />

    <VBtn
      color="primary"
      variant="tonal"
      class="me-5 d-none d-md-block"
    >
      <VIcon
        icon="mdi-logout"
        class="me-1"
      />
      <span>Get Started</span>
    </VBtn>

    <VMenu
      offset="14px 0"
      width="100%"
    >
      <template #activator="{ props }">
        <VBtn
          v-bind="props"
          icon="mdi-menu"
          rounded
          size="small"
          color="primary"
          variant="tonal"
          class="d-md-none me-5"
        />
      </template>

      <VList>
        <VListItem
          v-for="(item, index) in ['Features', 'Pricing', 'Testimonials', 'FAQ']"
          :key="index"
          link
        >
          <VListItemTitle>{{ item }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VToolbar>
</template>
