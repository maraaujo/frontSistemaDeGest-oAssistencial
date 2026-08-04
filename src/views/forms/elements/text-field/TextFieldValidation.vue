<script setup>
const title = ref('Preliminary report')
const email = ref('')

const rules = {
  required: value => !!value || 'Required.',
  counter: value => value.length <= 20 || 'Max 20 characters',
  email: value => {

    // eslint-disable-next-line regexp/no-unused-capturing-group
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i
    
    return pattern.test(value) || 'Invalid e-mail.'
  },
}
</script>

<template>
  <VForm>
    <VRow>
      <VCol
        cols="12"
        sm="6"
      >
        <VTextField
          v-model="title"
          :rules="[rules.required, rules.counter]"
          label="Title"
          counter
          maxlength="20"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <VTextField
          v-model="email"
          :rules="[rules.required, rules.email]"
          label="E-mail"
        />
      </VCol>
    </VRow>
  </VForm>
</template>
