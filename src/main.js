// Components
import App from '@/App.vue'

// styles
import '@styles/index.scss'
import 'vue3-toastify/dist/index.css'

// user custom style file
import '@styles/user-custom/style.scss'

// Plugins
import { registerPlugins } from '@plugins/vuetify/index'

// Ponto de entrada do front: cria a aplicação Vue a partir do App.vue
// (createApp vem por auto-import, por isso não aparece nos imports acima).
const app = createApp(App)

// Registra Vuetify, o router (rotas e guard de autenticação), o i18n e o Pinia
// (ver plugins/vuetify/index.js) e depois monta a aplicação na div #app do index.html.
registerPlugins(app)
app.mount('#app')
