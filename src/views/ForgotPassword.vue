<script setup>
import { useTheme } from 'vuetify'
import { VForm } from 'vuetify/components/VForm'
import Logo from '@/components/Logo.vue'
import authBgDark from '@images/pages/auth-bg-dark.svg'
import authBgLight from '@images/pages/auth-bg-light.svg'
import authForgotPasswordImg from '@images/pages/girl-forgot-something.png'
import { toast } from 'vue3-toastify'

const forgetPasswordForm = ref()
const theme = useTheme()
const email = ref('')

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight
})

const submit = async () => {
  const { valid } = await forgetPasswordForm.value.validate()
  if (!valid)
    return

  // A redefinição automática de senha ainda não está disponível no sistema;
  // orientamos o usuário a procurar o administrador em vez de simular um envio.
  toast.info('Para redefinir sua senha, entre em contato com o administrador da instituição.')
}
</script>

<template>
  <div class="auth-wrapper">
    <VCard
      max-width="900"
      :width="$vuetify.display.smAndDown ? '500' : 'auto'"
    >
      <VRow no-gutters>
        <VCol
          md="6"
          cols="12"
          class="pa-sm-8 pa-4"
        >
          <VCardText class="d-flex align-center gap-2 pt-0 pb-1 text-primary">
            <Logo :size="90" />
            <h4 class="text-h4 text-primary">
              SGA Assistencial
            </h4>
          </VCardText>

          <VCardItem>
            <VCardTitle>Esqueceu a senha?</VCardTitle>
          </VCardItem>

          <VCardText>
            <p>Informe o e-mail cadastrado para receber as orientações de redefinição de senha.</p>

            <VForm
              ref="forgetPasswordForm"
              @submit.prevent="submit"
            >
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="email"
                    label="E-mail"
                    type="email"
                    :rules="[v => !!v || 'E-mail é obrigatório']"
                  />
                </VCol>

                <VCol cols="12">
                  <VBtn
                    block
                    type="submit"
                    color="primary"
                    class="mb-3"
                  >
                    Enviar instruções
                  </VBtn>

                  <VBtn
                    block
                    variant="text"
                    color="secondary"
                    size="small"
                    prepend-icon="mdi-chevron-double-left"
                    :to="{ name: 'login' }"
                  >
                    Voltar para o login
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCol>

        <VCol
          cols="6"
          class="pa-8 text-center border-s d-none d-md-block"
          :style="`background-image:url(${authBgThemeVariant});`"
        >
          <div class="d-flex align-center justify-center">
            <img
              width="280"
              :src="authForgotPasswordImg"
            >
          </div>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@styles/pages/auth.scss";
</style>
