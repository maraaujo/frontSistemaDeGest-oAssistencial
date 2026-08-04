import { createPinia } from 'pinia'
import i18n from '@plugins/i18n'
import vuetify from '@plugins/vuetify/vuetify'
import { loadFonts } from '@plugins/webfontloader'
import router from '@/router'

export function registerPlugins(app) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(i18n)
    .use(createPinia())
}
