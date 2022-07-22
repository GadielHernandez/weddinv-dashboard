import Vue from 'vue'
import VueRouter from 'vue-router'
import Invitations from '../views/Invitations.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/:wedding?',
        name: 'Home',
        component: Invitations,
    },
    {
        path: '/invitations/:wedding?',
        name: 'Invitations',
        component: Invitations,
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
