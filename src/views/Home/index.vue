<template>
  <VRow>
    <VCol cols="12">
      <VCard class="welcome-card overflow-hidden">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="8"
          >
            <VCardText class="pa-8 pa-md-12">
              <VChip
                color="primary"
                variant="tonal"
                class="mb-6"
              >
                SGA Assistencial
              </VChip>

              <h1 class="text-h3 font-weight-bold mb-4">
                Bem-vindo ao Sistema de Gestão Assistencial
              </h1>

              <p class="text-h6 text-medium-emphasis font-weight-regular mb-8">
                Gerencie acolhidos, medicamentos e atividades assistenciais de forma simples e organizada.
              </p>

              <div class="d-flex flex-wrap gap-3">
                <VBtn
                  color="primary"
                  size="large"
                  prepend-icon="mdi-view-dashboard-outline"
                  @click="goTo('dashboard')"
                >
                  Abrir dashboard
                </VBtn>

                <VBtn
                  color="primary"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-clock-outline"
                  @click="goTo('patient-reminders')"
                >
                  Ver próximos medicamentos
                </VBtn>
              </div>
            </VCardText>
          </VCol>

          <VCol
            cols="12"
            md="4"
            class="bg-primary d-flex align-center justify-center pa-10"
          >
            <div class="text-center text-white">
              <VIcon
                icon="mdi-heart-pulse"
                size="112"
                class="mb-4"
              />
              <div class="text-h5 font-weight-bold">
                Cuidado com organização
              </div>
              <div class="text-body-1 mt-2 opacity-80">
                Informações assistenciais reunidas em um só lugar.
              </div>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <VCol
      v-for="item in modules"
      :key="item.route"
      cols="12"
      sm="6"
      lg="3"
    >
      <VCard
        height="100%"
        class="module-card"
        hover
        @click="goTo(item.route)"
      >
        <VCardText class="pa-6">
          <VAvatar
            :color="item.color"
            variant="tonal"
            size="52"
            class="mb-5"
          >
            <VIcon
              :icon="item.icon"
              size="28"
            />
          </VAvatar>

          <div class="text-h6 font-weight-bold mb-2">
            {{ item.title }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ item.description }}
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const modules = [
  {
    title: 'Pacientes',
    description: 'Consulte e mantenha os dados dos acolhidos.',
    route: 'patients',
    icon: 'mdi-account-multiple-outline',
    color: 'primary',
  },
  {
    title: 'Administração',
    description: 'Acompanhe e registre administrações de medicamentos.',
    route: 'patient-medicines',
    icon: 'mdi-clipboard-pulse-outline',
    color: 'warning',
  },
  {
    title: 'Medicamentos',
    description: 'Gerencie os medicamentos cadastrados no sistema.',
    route: 'medicamentos',
    icon: 'mdi-pill',
    color: 'info',
  },

]

const goTo = route => router.push({ name: route })
</script>

<style scoped>
.welcome-card {
  min-block-size: 330px;
}

.module-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.module-card:hover {
  transform: translateY(-3px);
}
</style>
