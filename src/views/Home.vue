<template>
  <VCard title="This is Home page that use content layout.">
    <VCardText class="bg-black">
      <pre>
{
  path: '/',
  name: 'home',
  component: () => import('@/views/Home.vue'),
  meta: {
    layout: 'content',
  },
},
</pre>
    </VCardText>
    <VCardActions>
      <VBtn color="primary">
        Action
      </VBtn>

      <VBtn color="primary">
        Another Action
      </VBtn>
    </VCardActions>
  </VCard>
</template>
