import { createI18n } from 'vue-i18n'
import en from './messages/en'
import { appConfig } from '@appConfig'

// As telas do sistema já estão escritas em português; o arquivo de mensagens serve
// apenas aos textos internos dos componentes do Vuetify. Os idiomas de demonstração
// do template (francês e árabe) foram removidos.
const messages = {
  en,
}

export default createI18n({
  legacy: false,
  locale: appConfig.defaultLocale.value,
  fallbackLocale: 'en',
  messages,
})
