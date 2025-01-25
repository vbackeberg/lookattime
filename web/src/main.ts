import { createApp } from 'vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import Test from './test.vue'
import router from './router'
import { createPinia } from 'pinia';

const vuetify = createVuetify()
const pinia = createPinia()

createApp(Test)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount('#test')
