import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import { auth } from './plugins/firebase';
import router from './router'

Vue.config.productionTip = false

let app

auth.onAuthStateChanged( async (user) => {

    if (!app) {
        app = new Vue({
            router,
            store,
            vuetify,
            render: (h) => h(App),
        }).$mount('#app')
    }

    if(user){
        store.dispatch('auth/setAuthData', { user, logged: true })
        await store.dispatch('admin/setWedding')
    }
})