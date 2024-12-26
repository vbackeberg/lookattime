import { createApp } from 'vue'
import "./app.scss";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import App from './app.vue'
import router from './router'

const vuetify = createVuetify({
  components: {
    ...components, ...labsComponents
  },
  directives,
})

createApp(App).use(vuetify).use(router).mount('#app')
