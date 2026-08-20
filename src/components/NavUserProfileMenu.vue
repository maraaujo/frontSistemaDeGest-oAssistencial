<script setup>
import auth from '@/auth'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({})

const initials = computed(() => {
  const source = user.value.name || user.value.email || ''
  
  return source.trim().charAt(0).toUpperCase() || '?'
})

const menuItems = [
  { title: 'Meu perfil', icon: 'mdi-account-outline', to: '/profile' },
]

const goTo = to => router.push(to)

const doLogout = () => {
  auth.logOut()
  router.push('/login')
}

onMounted(() => {
  const result = auth.getUserStorage()

  user.value = result || {}
})
</script>

<template>
  <VAvatar
    class="cursor-pointer"
    color="primary"
    variant="tonal"
  >
    <VImg
      v-if="user.avatarUrl"
      :src="user.avatarUrl"
    />
    <span v-else>{{ initials }}</span>

    <VMenu activator="parent">
      <VList>
        <VListItem :title="user.name || 'Usuário'">
          <VListItemTitle>{{ user.name || 'Usuário' }}</VListItemTitle>
          <VListItemSubtitle>{{ user.email || '' }}</VListItemSubtitle>
        </VListItem>
        <VDivider class="mt-2" />
        <VListItem
          v-for="item in menuItems"
          :key="item.title"
          :value="item.title"
          :append-icon="item.icon"
          @click="goTo(item.to)"
        >
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
        <VDivider />
        <VListItem
          append-icon="mdi-logout"
          @click="doLogout"
        >
          <VListItemTitle>Sair</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VAvatar>
</template>
