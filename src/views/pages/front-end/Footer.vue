<script setup>
const icons = [
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]
</script>

<template>
  <VFooter class="flex-column bg-surface">
    <VContainer class="py-10">
      <VRow>
        <VCol
          cols="6"
          sm="4"
          md="2"
        >
          <VList class="text-sm">
            <VListItem>
              <h6 class="text-base">
                Resources
              </h6>
            </VListItem>

            <VListItem>
              Help center
            </VListItem>
            <VListItem>
              Docs
            </VListItem>
            <VListItem>
              Roadmap
            </VListItem>
            <VListItem>
              Changelog
            </VListItem>
          </VList>
        </VCol>
        <VCol
          cols="6"
          sm="4"
          md="2"
        >
          <VList class="text-sm">
            <VListItem>
              <h6 class="text-base">
                Features
              </h6>
            </VListItem>

            <VListItem>
              Affiliates
            </VListItem>
            <VListItem>
              Docs
            </VListItem>
            <VListItem>
              Roadmap
            </VListItem>
            <VListItem>
              Changelog
            </VListItem>
          </VList>
        </VCol>
        <VCol
          cols="6"
          sm="4"
          md="2"
        >
          <VList class="text-sm">
            <VListItem>
              <h6 class="text-base">
                Company
              </h6>
            </VListItem>

            <VListItem>
              About
            </VListItem>
            <VListItem>
              Pricing
            </VListItem>
            <VListItem>
              Careers
            </VListItem>
            <VListItem>
              Blog
            </VListItem>
          </VList>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VForm>
            <p class="text-sm">
              Subscribe to our newsletter
            </p>
            <div class="d-flex align-center gap-4 flex-wrap">
              <VTextField
                placeholder="Enter your email"
                style="max-inline-size: 350px;"
              />
              <VBtn color="primary">
                Subscribe
              </VBtn>
            </div>
          </VForm>
        </VCol>
      </VRow>
    </VContainer>
    <VDivider class="w-100" />
    <VContainer class="d-flex justify-space-between align-center flex-wrap">
      <div>
        Copyright © 2024. All rights reserved.
      </div>
      <div class="d-flex align-center gap-2 flex-wrap">
        <VIcon
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
        />
      </div>
    </VContainer>
  </VFooter>
</template>
