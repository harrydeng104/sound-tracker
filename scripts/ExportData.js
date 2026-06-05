import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { writeFileSync } from 'fs'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function exportData() {
  const [songsSnapshot, logsSnapshot] = await Promise.all([
      getDocs(collection(db, 'songs')),
      getDocs(collection(db, 'logs'))
  ])

  const songs = songsSnapshot.docs.map(doc => doc.data())
  const logs = logsSnapshot.docs.map(doc => doc.data())

  const data = {
    songs,
    logs,
    lastUpdated: new Date().toISOString()
  }

  writeFileSync('public/data.json', JSON.stringify(data, null, 2))
}

exportData()