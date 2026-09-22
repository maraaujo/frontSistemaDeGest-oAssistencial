<script setup>
import mics404 from '@images/pages/error-message-404.png'
</script>

<template>
  <div class="misc-wrapper">
    <div class="w-100">
      <VImg
        :src="mics404"
        width="500"
        class="mx-auto"
      />
    </div>
    <h5 class="text-h5 font-weight-semibold mb-3">
      Página não encontrada.
    </h5>
    <p>
      A página que você tentou acessar não existe. Verifique se o endereço está correto.
    </p>
    <VBtn
      to="/"
      variant="outlined"
      color="primary"
    >
      Ir para a página inicial
    </VBtn>
  </div>
</template>

<style lang="scss">
@use "@styles/pages/misc.scss";
</style>
