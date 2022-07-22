import router from '../../router'

const state = {
    actual: null
}

const getters = {}

const actions = {
    goToView({ commit }, name){
        router.push({ name })
        commit('SET_VIEW', name)
    },
    setView({ commit }, name){
        commit('SET_VIEW', name)
        return
    }
}

const mutations = {
    SET_VIEW(state, payload){
        state.actual = payload
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
