import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
    getFirestore,
} from 'firebase/firestore'
import {
    getStorage
} from 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCPLVfPX07rKDEBWs0101C6QtTYw5dhYxo",
    authDomain: "instaclone-6396e.firebaseapp.com",
    projectId: "instaclone-6396e",
    storageBucket: "instaclone-6396e.appspot.com",
    messagingSenderId: "699074320925",
    appId: "1:699074320925:web:318318358dfd8042a984f4",
    measurementId: "G-ZG53PQ6QJT"
};

// Initiaize Firebase Application
const app = initializeApp(firebaseConfig)

// Initialize Firebase Services
const auth = getAuth(app)
const db = getFirestore()
const storage = getStorage()

export { auth, db, storage };