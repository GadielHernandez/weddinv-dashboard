import { db, auth } from '../../plugins/firebase'
import { nanoid } from 'nanoid'
const state = {
    wedding: null,
    configurations: null,
    list: []
}

const getters = {}

const actions = {
    setWedding({ commit }){
        return new Promise((resolve, reject) => {
            db.doc(`configurations/${auth.currentUser.uid}`).get()
            .then( doc => {
                if(!doc.exists) return resolve(null)
                const wedding = { id: doc.id, ...doc.data() }
                commit('SET_WEDDING', wedding)
                resolve(wedding)
            })
            .catch( () => reject() )
        })
    },
    fetchList({ commit, state }){
        return new Promise((resolve, reject) => {
            db.collection(`${state.wedding}`).get()
            .then( resp => {
                const list = resp.docs.map( doc => ({ id: doc.id, ...doc.data() }))
                commit('UPDATE_LIST', list)
                return resolve()
            })
            .catch( () => reject() )
        })
    },
    addGuest({ commit }, data){
        return new Promise((resolve, reject) =>{
            const id = nanoid(10)
            db.doc(`${state.wedding}/${id}`).set(data)
            .then( () => {
                commit('ADD_GUEST', { id, ...data })
                resolve()
            })
            .catch( err => reject(err) )
        })
    },
    editGuest({ commit }, data){
        return new Promise((resolve, reject) =>{
            const { id, update } = data
            db.doc(`${state.wedding}/${id}`).update(update)
            .then( () => {
                commit('EDIT_GUEST', data)
                resolve()
            })
            .catch( err => reject(err) )
        })
    },
    deleteGuest({ commit }, data){
        return new Promise((resolve, reject) =>{
            const { id } = data
            db.doc(`${state.wedding}/${id}`).delete()
            .then( () => {
                commit('DELETE_GUEST', data)
                resolve()
            })
            .catch( err => reject(err) )
        })
    },
    blockGuest({ state }, data){
        return new Promise((resolve, reject) => {
            db.doc(`${state.wedding}/${data.id}`).update({ out_time: data.value })
            .then( () => {
                return resolve({ message: 'done' })
            })
            .catch( (err) => {
                console.log(err)
                return reject({ message: 'error' })
            })
        })
    },
}

const mutations = {
    SET_WEDDING(state, payload){
        state.wedding = payload.id
        delete payload.id
        state.configurations = payload
    },
    UPDATE_LIST(state, payload){
        state.list = payload
    },
    ADD_GUEST(state, payload){
        state.list.push(payload)
    },
    EDIT_GUEST(state, payload){
        const index = state.list.findIndex( g => g.id === payload.id )
        state.list.splice(index, 1, { id: payload.id, ...payload.update })
    },
    DELETE_GUEST(state, payload){
        const index = state.list.findIndex( g => g.id === payload.id )
        state.list.splice(index, 1)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
