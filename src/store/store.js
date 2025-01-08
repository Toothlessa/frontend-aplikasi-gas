import { createStore } from 'vuex'
import auth from './modules/auth/index'

const store = createStore({
  modules: {
    auth,
  },
});

export default store;

// export default createStore({
//   state: {
//   },
//   getters: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })
