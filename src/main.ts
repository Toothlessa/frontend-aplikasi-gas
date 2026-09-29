import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/store'
import vuetify from './plugins/vuetify'
import {
  loadFonts
} from './plugins/webfontloader'
import { AUTO_LOGIN_ACTION } from './store/storeconstant'

loadFonts()

// Pastikan state auth terisi dari localStorage sebelum router guard dievaluasi
store.dispatch(`auth/${AUTO_LOGIN_ACTION}`)

const app = createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)

router.isReady().then(() => {
  app.mount('#app')
})

export default {}

