import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FB_API_KEY,
    authDomain: "gad-vane-wedding.firebaseapp.com",
    databaseURL: "https://" + process.env.VUE_APP_PROJECT_ID + ".firebaseio.com",
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_PROJECT_ID + ".appspot.com",
    messagingSenderId: "954982897259",
    appId: process.env.VUE_APP_FB_ID
}

firebase.initializeApp(firebaseConfig)

firebase.analytics()

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {
    db,
    auth,
    storage
}

