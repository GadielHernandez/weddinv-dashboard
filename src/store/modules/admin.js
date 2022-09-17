import { db, auth, storage } from '../../plugins/firebase'
import { nanoid } from 'nanoid'

const state = {
    wedding: null,
    configurations: null,
    list: [],
}

const getters = {}

const actions = {
    setWedding({ commit }) {
        return new Promise((resolve, reject) => {
            db.doc(`configurations/${auth.currentUser.uid}`)
                .get()
                .then((doc) => {
                    if (!doc.exists) return resolve(null)
                    const wedding = { id: doc.id, ...doc.data() }
                    commit('SET_WEDDING', wedding)
                    resolve(wedding)
                })
                .catch(() => reject())
        })
    },
    fetchList({ commit, state }) {
        return new Promise((resolve, reject) => {
            db.collection(`${state.wedding}`)
                .get()
                .then((resp) => {
                    const list = resp.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    commit('UPDATE_LIST', list)
                    return resolve()
                })
                .catch(() => reject())
        })
    },
    addGuest({ commit }, data) {
        return new Promise((resolve, reject) => {
            const id = nanoid(10)
            db.doc(`${state.wedding}/${id}`)
                .set(data)
                .then(() => {
                    commit('ADD_GUEST', { id, ...data })
                    resolve()
                })
                .catch((err) => reject(err))
        })
    },
    editGuest({ commit }, data) {
        return new Promise((resolve, reject) => {
            const { id, update } = data
            db.doc(`${state.wedding}/${id}`)
                .update(update)
                .then(() => {
                    commit('EDIT_GUEST', data)
                    resolve()
                })
                .catch((err) => reject(err))
        })
    },
    deleteGuest({ commit }, data) {
        return new Promise((resolve, reject) => {
            const { id } = data
            db.doc(`${state.wedding}/${id}`)
                .delete()
                .then(() => {
                    commit('DELETE_GUEST', data)
                    resolve()
                })
                .catch((err) => reject(err))
        })
    },
    blockGuest({ state }, data) {
        return new Promise((resolve, reject) => {
            db.doc(`${state.wedding}/${data.id}`)
                .update({ out_time: data.value })
                .then(() => {
                    return resolve({ message: 'done' })
                })
                .catch((err) => {
                    console.log(err)
                    return reject({ message: 'error' })
                })
        })
    },
    editSectionInvitation({ state, commit }, section) {
        return new Promise((resolve, reject) => {
            const { images } = section.data
            
            const images_to_storage = []
            if (images) {
                delete section.data.images
                const images_db = {}
                
                const actual_section = state.configurations[section.name]
                if (actual_section)
                    Object.keys(actual_section.images).forEach((image) => {
                        images_to_storage.push({
                            name: actual_section.images[image],
                            delete: true,
                        })
                    })
                
                Object.keys(images).forEach((img) => {
                    const [name, type] = images[img].name.split('.')
                    const valid_name = `${name.replace(/\s+/g, '')}.${type}`
                    images_db[img] = valid_name
                    images_to_storage.push({
                        name: valid_name,
                        img: images[img],
                    })
                })
                section.data.images = images_db
            }
            
            Promise.all(
                images_to_storage.map((item) => {
                    const ref = storage.ref(`${state.wedding}/${section.name}/${item.name}`)
                    if(item.delete)
                        return ref.delete()
                    else
                        return ref.put(item.img)
                })
            )
                .then(() => {
                    db.doc(`configurations/${state.wedding}`)
                        .update({ [section.name]: section.data })
                        .then(() => {
                            commit('UPDATE_SECTION', section)
                            return resolve()
                        })
                })
                .catch(() => reject())
        })
    },
}

const mutations = {
    SET_WEDDING(state, payload) {
        state.wedding = payload.id
        delete payload.id
        state.configurations = payload
    },
    UPDATE_LIST(state, payload) {
        state.list = payload
    },
    ADD_GUEST(state, payload) {
        state.list.push(payload)
    },
    EDIT_GUEST(state, payload) {
        const index = state.list.findIndex((g) => g.id === payload.id)
        state.list.splice(index, 1, { id: payload.id, ...payload.update })
    },
    DELETE_GUEST(state, payload) {
        const index = state.list.findIndex((g) => g.id === payload.id)
        state.list.splice(index, 1)
    },
    UPDATE_SECTION(state, section) {
        state.configurations[section.name] = section.data
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
