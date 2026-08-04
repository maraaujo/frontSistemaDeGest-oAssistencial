<template>
  <div class="auth-wrapper sga-auth-wrapper">
    <VCard
      max-width="900"
      width="460"
      class="sga-login-card"
      elevation="12"
    >
      <VRow no-gutters>
        <VCol
          md="12"
          cols="12"
          class="pa-sm-12 pa-6"
        >
          <VCardText class="d-flex justify-center align-center pt-0 pb-4">
            <div class="text-center">
             <Logo />

           

              <p class="text-caption text-medium-emphasis mb-0">
                Sistema de Gestão Assistencial
              </p>
            </div>
          </VCardText>

          <VCardItem class="text-center pb-2">
            <VCardTitle class="text-h6 font-weight-bold">
              Acesse sua conta
            </VCardTitle>

          </VCardItem>

          <VCardText>
            <VForm
              ref="loginForm"
              v-model="valid"
              @submit.prevent="submit"
            >
              <VTextField
                v-model="loginData.email"
                label="E-mail"
                :rules="emailRules"
                class="mb-5"
                required
                outlined
                autocomplete="username"
                prepend-inner-icon="mdi-email-outline"
              />

              <VTextField
                v-model="loginData.password"
                :type="isPasswordVisible ? 'password' : 'text'"
                label="Senha"
                :rules="[(v) => !!v || 'Senha obrigatória']"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                class="mb-5"
                autocomplete="current-password"
                prepend-inner-icon="mdi-lock-outline"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <VAlert
                v-show="!authorized"
                text="Usuário e/ou senha inválidos"
                class="mb-5"
                type="error"
                variant="tonal"
              />

              <VBtn
                block
                type="submit"
                :disabled="!valid || process"
                :loading="process"
                color="primary"
                size="large"
              >
                Acessar plataforma
              </VBtn>
            </VForm>

            <div class="text-center mt-6">
              <p class="text-caption text-medium-emphasis mb-0">
                Plataforma SaaS para instituições de acolhimento
              </p>
            </div>
          </VCardText>
        </VCol>
      </VRow>
    </VCard>
  </div>
</template>

<script setup>
import auth from "@/auth";
import Logo from "@/components/Logo.vue";
import authBgDark from "@images/pages/auth-bg-dark.svg";
import authBgLight from "@images/pages/auth-bg-light.svg";

import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { VForm } from "vuetify/components/VForm";

const authorized = ref(true);
const loginForm = ref();
const router = useRouter();

const valid = ref(true);
const isPasswordVisible = ref(true);
const loginInvalid = ref(false);
const theme = useTheme();
const process = ref(false);
const loading = ref(true);

const emailRules = ref([
  (v) => !!v || "E-mail é obrigatório",
  (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
]);

const loginData = ref({
  email: "",
  password: "",
});

const authBgThemeVariant = computed(() => {
  return theme.current.value.dark ? authBgDark : authBgLight;
});

const submit = async () => {
  loginInvalid.value = false;

  if (!valid.value) {
    return;
  }

  process.value = true;

  try {
    const result = await auth.logIn(
      loginData.value.email,
      loginData.value.password
    );

    authorized.value = true;

    if (!result.isAuthorized) {
      authorized.value = false;
      loginInvalid.value = true;
      loading.value = false;
      return;
    }

    router.push({
      path: `/`,
    });
  } catch (error) {
    console.error(error);
    authorized.value = false;
    loginInvalid.value = true;
  } finally {
    process.value = false;
  }
};
</script>

<style lang="scss">
@use "@styles/pages/auth";

.sga-auth-wrapper {
  min-block-size: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(var(--v-theme-primary), 0.16), transparent 34%),
    radial-gradient(circle at bottom right, rgba(22, 177, 255, 0.12), transparent 32%),
    rgb(var(--v-theme-background));
}

.sga-login-card {
  border-radius: 28px !important;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  backdrop-filter: blur(12px);
}

.sga-login-card :deep(.v-field) {
  border-radius: 14px;
}
</style>
