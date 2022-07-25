import { auth } from "../../plugins/firebase"

const state = {
    user: null,
    logged: false
}

const getters = {}

const actions = {
    login({ state, dispatch }, credentials) {
        return new Promise((resolve, reject) => {
            if (state.logged) return resolve({ error: 'Ya esta logueado' })
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
                console.log(error)
                return reject({ error: 'Revisa los datos' })
            })
        })
    },
    setAuthData({ commit }, payload){
        commit('SET_USER', payload.user)
        commit('UPDATE_LOGGED_STATUS', payload.logged)
        return
    },
    logout({ state }) {
        return new Promise( (resolve, reject) => {
            if (!state.logged) return resolve({ message: 'No has hecho login' })

            try {
                // await auth.signOut()
                return resolve({ message: 'Sesión terminada' })
            } catch (error) {
                return reject({ message: 'Error al cerrar sesión' })
            }
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
