import { useState, useEffect } from 'react'
import './App.css'
import SongList from './SongList.jsx'
import SongForm from './SongForm.jsx'
import MainList from './MainList.jsx'

import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
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

    async function handleLogin() {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        setUser(result.user)
        console.log('Your Firebase UID:', result.user.uid)
    }



    return (
        <div className = "app-body">

            <header>
                <h1>SoundTracker</h1>
            </header>

            <nav className = "navbar">
                <button 
                    className = {tab === "rankPage" ? "activeTab" : "tab"}
                    onClick={() => setTab('rankPage')}
                >
                    Ranker
                </button>
                <button 
                    className = {tab === "mainList" ? "activeTab" : "tab"}
                    onClick={() => setTab('mainList')}
                >
                    Main List
                </button>
            </nav>

            <main>
                {tab === 'rankPage' ? (
                    user ? (
                        <div className = "rank-page">
                            <aside>
                                <SongList 
                                    onSongsLoaded = {handleSongsLoaded} 
                                    onSelectSong = {handleSelectSong} 
                                    selectedIndex = {selectedIndex}
                                    songs = {queueSongs}
                                />
                            </aside>
                            <section>
                                <SongForm 
                                    song = {selectedSong}
                                    onComplete = {handleCompleteSong}
                                />
                            </section>
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <h2>Login Required</h2>
                            <button onClick={handleLogin}>Login with Google</button>
                        </div>
                    )
                ) : (
                    <MainList 
                        songs = {compSongs} 
                        onUncomp = {handleUncompleteSong}
                    />
                )}
            </main>
        </div>
    )
}

export default App
