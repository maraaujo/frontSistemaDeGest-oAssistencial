<script setup>
import auth from '@/auth'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({})

/**
 * Letra exibida no avatar quando não há foto: primeira letra do nome (ou do e-mail),
 * em maiúscula; "?" se nenhum dos dois existir.
 */
const initials = computed(() => {
  const source = user.value.name || user.value.email || ''
  
  return source.trim().charAt(0).toUpperCase() || '?'
})

const menuItems = [
  { title: 'Meu perfil', icon: 'mdi-account-outline', to: '/profile' },
]

/** Navega para a rota do item clicado no menu do avatar (ex.: '/profile'). */
const goTo = to => router.push(to)

/** Sai do sistema: apaga a sessão do sessionStorage (auth.logOut) e vai para o login. */
const doLogout = () => {
  auth.logOut()
  router.push('/login')
}

// Ao montar o componente, carrega o usuário logado da sessão (nome, e-mail, avatar)
// para exibir no menu; sem sessão, usa um objeto vazio.
onMounted(() => {
  const result = auth.getUserStorage()

  user.value = result || {}
  console.log(user.value)
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
