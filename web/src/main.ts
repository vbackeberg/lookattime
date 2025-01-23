import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import App from './app.vue'
import router from './router'
import { createPinia } from 'pinia';

const vuetify = createVuetify()
const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount('#app')
