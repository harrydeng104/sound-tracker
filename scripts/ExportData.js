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
  const [songsSnapshot, logsSnapshot, queuesSnapshot] = await Promise.all([
      getDocs(collection(db, 'songs')),
      getDocs(collection(db, 'logs')),
      getDocs(collection(db, 'queues'))
  ])

  const songs = songsSnapshot.docs.map(doc => doc.data())
  const logs = logsSnapshot.docs.map(doc => doc.data())
  const queues = queuesSnapshot.docs.map(doc => doc.id)

  const data = {
    songs,
    logs,
    queues,
    lastUpdated: new Date().toISOString()
  }

  writeFileSync('public/data.json', JSON.stringify(data, null, 2))
}

exportData()