import Vue from 'vue'
import Vuex from 'vuex'
import admin from './modules/admin'
import view from './modules/view'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        admin,
        view
    },
})
