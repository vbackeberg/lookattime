import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import Test from './test.vue'
import router from './router'
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const vuetify = createVuetify()
const pinia = createPinia()

createApp(Test)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })
  .mount('#test')
