<script setup>
import { useTheme } from 'vuetify'
import { VForm } from 'vuetify/components/VForm'
import Logo from '@/components/Logo.vue'
import { appConfig } from '@appConfig'
import resetPasswordDark from '@images/illustration/reset-password-cover-dark.svg'
import resetPassword from '@images/illustration/reset-password-cover.svg'

const { global } = useTheme()

appConfig.isBoxLayout.value = false

const resetPasswordForm = ref()
const email = ref('')

const illustration = computed(() => {
  return global.current.value.dark ? resetPasswordDark : resetPassword
})
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper-v2"
  >
    <VCol
      cols="12"
      md="4"
      class="d-flex flex-column bg-surface justify-center align-center"
    >
      <VCard
        flat
        max-width="400"
        class="pa-4"
      >
        <VCardText class="d-flex align-center gap-2 pt-0 pb-1 text-primary">
          <Logo />
          <h4 class="text-h4 text-primary">
            PrimeDash
          </h4>
        </VCardText>

        <VCardItem>
          <VCardTitle>Reset Password</VCardTitle>
        </VCardItem>

        <VCardText>
          <p>Enter your new password.</p>

          <VForm
            ref="resetPasswordForm"
            @submit.prevent="() => {}"
          >
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Password"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="New Password"
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                  color="primary"
                  class="mb-3"
                >
                  Set New Password
                </VBtn>

                <VBtn
                  block
                  variant="text"
                  color="secondary"
                  size="small"
                  prepend-icon="mdi-chevron-double-left"
                  :to="{ name: 'auth-login-v2' }"
                >
                  Back to login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      md="8"
      class="d-none d-md-flex align-center justify-center"
    >
      <component
        :is="illustration"
        style="inline-size: 600px;"
      />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@styles/pages/auth";
</style>
