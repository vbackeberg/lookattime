import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import App from './app.vue'
import router from './router'
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const vuetify = createVuetify()
const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })
  .mount('#app')
