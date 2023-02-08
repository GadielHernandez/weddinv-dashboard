import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../plugins/firebase';

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            requiresNoAuth: true,
        },
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/invitations',
        name: 'Invitations',
        component: () => import('../views/invitations/Home.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/invitations/config',
        name: 'InvitationsConfig',
        component: () => import('../views/invitations/Invitation-config.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/guests',
        name: 'Guests',
        component: () => import('../views/Guests.vue'),
        meta: {
            requiresAuth: true,
        },
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

router.beforeEach((to, from, next) =>{
	const requiresAuth = to.matched.some( r => r.meta.requiresAuth )
	if(requiresAuth && !auth.currentUser){
        next('/login')
        return
    }
    
    const requiresNoAuth = to.matched.some( r => r.meta.requiresNoAuth )
    if(requiresNoAuth && auth.currentUser){
        next('/')
        return
    }

    next()
})

export default router
