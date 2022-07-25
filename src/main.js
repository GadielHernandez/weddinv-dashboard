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
        await store.dispatch('admin/setWedding')
        await store.dispatch('admin/fetchList')
        store.dispatch('auth/setAuthData', { user, logged: true })
    }
})