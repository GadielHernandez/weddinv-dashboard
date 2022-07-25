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
        path: '/:wedding?',
        name: 'Home',
        component: () => import('../views/Invitations.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/invitations/:wedding?',
        name: 'Invitations',
        component: () => import('../views/Invitations.vue'),
        meta: {
            requiresAuth: true,
        },
    }
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
