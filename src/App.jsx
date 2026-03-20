import { useState, useEffect } from 'react'
import './App.css'
import SongList from './SongList.jsx'
import SongForm from './SongForm.jsx'
import MainList from './MainList.jsx'

import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { db, auth } from './firebase'

function App() {
    const [tab, setTab] = useState('rankPage')

    const [songs, setSongs] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)

    const [user, setUser] = useState(null)

    const queueSongs = songs.filter(sng => sng.completed !== true)
    const compSongs = songs.filter(sng => sng.completed === true)

    compSongs.sort((a, b) => b.totalScore - a.totalScore)

    useEffect(() => {
        const loadSongs = async () => {
            const querySnapshot = await getDocs(collection(db, 'songs'))
            const loadedSongs = querySnapshot.docs.map(doc => doc.data())
            setSongs(loadedSongs)
        }
        loadSongs()
    }, [])

    useEffect(() => {
        if (selectedIndex === null && queueSongs.length > 0) {
            setSelectedIndex(0)
        }
    }, [songs])

    function handleSongsLoaded(loadedSongs) {
        setSongs(existing => {
            const existingIds = new Set(existing.map(s => s.id))
            const newSongs = loadedSongs.filter(song => !existingIds.has(song.id))
            const combined = [...existing, ...newSongs]
            const incompleteCount = combined.filter(s => !s.completed).length
            setSelectedIndex(incompleteCount > 0 ? 0 : null)

            newSongs.forEach(song => {
                setDoc(doc(db, 'songs', song.id), song)
            })

            return combined
        })
    }

    function handleSelectSong(index) {
        setSelectedIndex(index)
    }

    function handleValueChange(field, value) {
        const targetSong = queueSongs[selectedIndex]
        if (targetSong == null) return
        
        setSongs(s =>
            s.map(song => {
                if (song.id === targetSong.id) {
                    const updated = { ...song, [field]: value }
                    setDoc(doc(db, 'songs', song.id), updated)
                    return updated
                }
                return song
            })
        )
    }
    
    const selectedSong = queueSongs[selectedIndex] ?? null
    
    function handleCompleteSong(compSong) {
        const updated = { ...compSong, completed: true }
        
        setSongs(s => 
            s.map(song => 
                song.id === compSong.id ? updated : song
            )
        )
        
        setDoc(doc(db, 'songs', compSong.id), updated)
        setSelectedIndex(0)
    }

    function handleUncompleteSong(uncompSong) {
        const moveBack = window.confirm("Are you sure you want to move this song back to the queue?")

        if (moveBack) {
            const updated = { ...uncompSong, completed: false }
            
            setSongs(s => 
                s.map(song => 
                    song.id === uncompSong.id ? updated : song
                )
            )
            
            setDoc(doc(db, 'songs', uncompSong.id), updated)
        }
    }

    async function handleDeleteSong(songId) {
        await deleteDoc(doc(db, 'songs', songId))
        
        setSongs(s => s.filter(song => song.id !== songId))
        
        const remainingQueue = songs.filter(s => s.id !== songId && !s.completed)
        setSelectedIndex(remainingQueue.length > 0 ? 0 : null)
    }

    async function handleLogin() {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        setUser(result.user)
        console.log('Your Firebase UID:', result.user.uid)
    }

    return (
        <main>
            {user ? (
                <div className="triple-panel">
                    <aside className="queue-panel">
                        <SongList 
                            onSongsLoaded = {handleSongsLoaded} 
                            onSelectSong = {handleSelectSong} 
                            onDelete = {handleDeleteSong}
                            selectedIndex = {selectedIndex}
                            songs = {queueSongs}
                        />
                    </aside>
                    
                    <section className="form-panel">
                        <SongForm 
                            song = {selectedSong}
                            onComplete = {handleCompleteSong}
                        />
                    </section>
                    
                    <aside className="completed-panel">
                        <MainList 
                            songs = {compSongs} 
                            onUncomp = {handleUncompleteSong}
                        />
                    </aside>
                </div>
            ) : (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Login Required</h2>
                    <p>Please login to access SoundTracker</p>
                    <button onClick={handleLogin}>Login with Google</button>
                </div>
            )}
        </main>
    )
}

export default App
