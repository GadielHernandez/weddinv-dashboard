import { auth } from "../../plugins/firebase"

const state = {
    user: null,
    logged: false
}

const getters = {}

const actions = {
    login({ state, dispatch }, credentials) {
        return new Promise((resolve, reject) => {
            if (state.logged) return reject({ error: 'Ya esta logueado' })
            auth.signInWithEmailAndPassword(
                credentials.email,
                credentials.password
            )
            .then( userCredential => {
                const { user } = userCredential
                dispatch('setAuthData', { user, logged: true })
                return resolve(user)
            })
            .catch( error => {
                if(error.code === 'auth/user-not-found')
                    return reject({ error: 'El correo no esta registrado' })
                if(error.code === 'auth/wrong-password')
                    return reject({ error: 'La contraseña es invalida' })    
                return reject({ error: 'Revisa los datos' })
            })
        })
    },
    setAuthData({ commit }, payload){
        commit('SET_USER', payload.user)
        commit('UPDATE_LOGGED_STATUS', payload.logged)
        return
    },
    logout({ state, dispatch }) {
        return new Promise( (resolve, reject) => {
            if (!state.logged) return reject({ error: 'No has hecho login' })
            auth.signOut()
            .then( () => {
                dispatch('setAuthData', { user: null, logged: false })
                return resolve({ message: 'Sesión terminada' }) 
            })
            .catch( () => reject({ error: 'Error al cerrar sesión' }) )
        })
    },
}

const mutations = {
    SET_USER(state, payload){
        state.user = payload
    },
    UPDATE_LOGGED_STATUS(state, payload){
        state.logged = payload
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
