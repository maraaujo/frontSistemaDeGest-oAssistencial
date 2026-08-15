<script setup>
import Logo from '@/components/Logo.vue'
import { useAppConfig } from '@/composable/useAppConfig'
import { isGroupActive } from '@/layouts/components/utils'
import VerticalNavGroup from '@/layouts/components/vertical-nav/VerticalNavGroup.vue'
import VerticalNavLink from '@/layouts/components/vertical-nav/VerticalNavLink.vue'
import verticalItems from '@/menus/vertical'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { useLocale } from 'vuetify'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDrawerOpen'])

const { t } = useLocale()
const { isVerticalMenuMini, isSemiDark, skins } = useAppConfig()
const OpenedGroup = ref([])

const resolveNavLinkGroup = computed(() => {
  return navItem => navItem.children ? VerticalNavGroup : VerticalNavLink
})

OpenedGroup.value = isGroupActive(verticalItems)

// remove group active when only link active
const handleGroupClose = () => {
  OpenedGroup.value = ['']
}

// handle scroll event
const handleScroll = () => {
  const railY = document.querySelector('.layout-vertical-nav .ps__rail-y')
  if (railY) {
    const topPosition = Number.parseInt(railY.style.top, 10)

    // Check the `top` value of `ps__rail-y` and add the desired class
    if (topPosition === 0)
      document.body.classList.remove('scrolled')
    else if (topPosition > 4)
      document.body.classList.add('scrolled')
  }
}
</script>

<template>
  <VNavigationDrawer
    touchless
    :rail="$vuetify.display.lgAndUp ? isVerticalMenuMini : false"
    :expand-on-hover="$vuetify.display.lgAndUp ? isVerticalMenuMini : false"
    :model-value="$vuetify.display.lgAndUp ? true : props.isDrawerOpen"
    :rail-width="skins === 'modern' ? 96 : 80"
    width="260"
    :theme="isSemiDark ? 'dark' : undefined"
    :permanent="$vuetify.display.lgAndUp"
    class="layout-vertical-nav"
    @update:model-value="(val) => $emit('update:isDrawerOpen', val)"
  >
    <div class="d-flex flex-column h-100">
      <!-- title and logo -->
      <div
        class="vertical-nav-header d-flex align-center overflow-hidden"
      >
        <RouterLink
          to="/"
          class="vertical-nav-brand d-flex align-center text-primary"
        >
          <!-- logo -->
          <Logo :size="52" />

        
        </RouterLink>

        <!-- toggle rail mode in medium and up screen -->
        <VBtn
          v-if="$vuetify.display.lgAndUp"
          icon
          variant="plain"
          size="x-small"
          :class="isVerticalMenuMini ? 'rail-mode-is-on' : ''"
          @click="isVerticalMenuMini = !isVerticalMenuMini"
        >
          <VIcon
            size="20"
            :icon="isVerticalMenuMini ? 'mdi-circle-outline' : 'mdi-radiobox-marked'"
          />
        </VBtn>

        <!-- close nav in small screen -->
        <VBtn
          v-else
          icon
          variant="text"
          size="x-small"
          @click="$emit('update:isDrawerOpen', false)"
        >
          <VIcon
            size="24"
            icon="mdi-close"
          />
        </VBtn>
      </div>
      <div class="vertical-nav-items-shadow" />

      <!-- navigation list -->
      <PerfectScrollbar
        :options="{ wheelPropagation: false, suppressScrollX: true }"
        class="h-100"
        @ps-scroll-y="handleScroll"
      >
        <VList
          v-model:opened="OpenedGroup"
          density="compact"
          open-strategy="single"
          class="layout-vertical-nav-list text-high-emphasis"
        >
          <template
            v-for="navItem in verticalItems"
            :key="navItem.title"
          >
            <VListSubheader
              v-if="navItem.heading"
              class="text-uppercase font-weight-bold"
            >
              {{ t(navItem.heading) }}
            </VListSubheader>

            <Component
              :is="resolveNavLinkGroup(navItem)"
              v-else
              :nav-item="navItem"
              @close-group="handleGroupClose"
            />
          </template>
        </VList>
      </PerfectScrollbar>
    </div>
  </VNavigationDrawer>
</template>

<style lang="scss">
.v-theme-skins-classic {
  .vertical-nav-items-shadow {
    opacity: 0 !important;
  }
}

.layout-vertical-nav {
  .vertical-nav-header {
    gap: 0.25rem;
    min-block-size: 76px;
    padding: 0.75rem;
  }

  .vertical-nav-brand {
    flex: 1 1 auto;
    gap: 0.375rem;
    min-inline-size: 0;
  }

  .app-title {
    min-inline-size: 0;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.2;
    white-space: normal;

    .text-gradient {
      display: block;
      overflow-wrap: break-word;
    }
  }

  .vertical-nav-items-shadow {
    position: absolute;
    z-index: 1;
    background: linear-gradient(rgb(var(--v-theme-surface)) 5%, rgba(var(--v-theme-surface), 75%) 45%, rgba(var(--v-theme-surface), 20%) 80%, transparent);
    block-size: 55px;
    inline-size: 100%;
    inset-block-start: calc(64px - 2px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease-in-out;
    will-change: opacity;
  }
}

.scrolled {
  .layout-vertical-nav {
    .vertical-nav-items-shadow {
      opacity: 1;
    }
  }
}
</style>
