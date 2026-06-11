import { useState, useEffect } from 'react'
import SongList from './SongList.jsx'
import SongForm from './SongForm.jsx'
import MainList from './MainList.jsx'

import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from './firebase'

function App() {
    const [songs, setSongs] = useState([])
    const [selectedSongId, setSelectedSongId] = useState(null)

    const [user, setUser] = useState(null)

    const [searchQuery, setSearchQuery] = useState('')

    function getSortName(name) { //this is needed to make it match spotify alphabetical sorting
        return name
            .replace(/^[^\p{L}\p{N}]+/u, '')
            .replace(/^(the|a|an)\s+/i, '')
            .trim()
    }    
    
    const queueSongs = songs
        .filter(sng => sng.completed !== true)
        .sort((a, b) => getSortName(a.name).localeCompare(getSortName(b.name)))

    const compSongs = songs
        .filter(sng => sng.completed === true)
        .sort((a, b) => b.totalScore - a.totalScore)

    const filteredQueue = queueSongs.filter(song => 
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artists.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredCompleted = compSongs.filter(song => 
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artists.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser && firebaseUser.email === 'justinengineer104@gmail.com') {
                setUser(firebaseUser)
            } else {
                setUser(null)
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const loadSongs = async () => {
            const response = await fetch('./data.json')
            const data = await response.json()
            const loadedSongs = data.songs
            setSongs(loadedSongs)
        }
        loadSongs()
    }, [])

    useEffect(() => {
        if (selectedSongId === null && queueSongs.length > 0) {
            setSelectedSongId(queueSongs[0].id)
        }
    }, [songs])

    function handleSongsLoaded(loadedSongs) {
        setSongs(existing => {
            const existingIds = new Set(existing.map(s => s.id))
            const newSongs = loadedSongs.filter(song => !existingIds.has(song.id))
            const combined = [...existing, ...newSongs]
            const incompleteCount = combined.filter(s => !s.completed).length
            setSelectedSongId(incompleteCount > 0 ? combined.filter(s => !s.completed)[0].id : null)

            newSongs.forEach(song => {
                setDoc(doc(db, 'songs', song.id), song)
            })

            return combined
        })
    }

    function handleSelectSong(song) {
        setSelectedSongId(song.id)
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

    async function handleCompleteSong(compSong) {
        const firebaseDoc = await getDoc(doc(db, 'songs', compSong.id))
        const wasAlreadyCompleted = firebaseDoc.exists() && firebaseDoc.data().completed === true

        const updated = { ...compSong, completed: true }
        
        setSongs(s => 
            s.map(song => 
                song.id === compSong.id ? updated : song
            )
        )
        
        setDoc(doc(db, 'songs', compSong.id), updated)
        
        const remainingQueue = queueSongs.filter(s => s.id !== compSong.id && !s.completed)
        if (remainingQueue.length > 0) {
            setSelectedSongId(remainingQueue[0].id)
        } else {
            setSelectedSongId(null)
        }

        const logEntry = {
            action: wasAlreadyCompleted ? 'updated' : 'completed',
            songId: updated.id,
            songName: updated.name,
            artists: updated.artists,
            timestamp: new Date().toISOString(),
            scores: {
                vocal: updated.vocalScore,
                background: updated.backgroundScore,
                lyric: updated.lyricScore,
                cohesion: updated.cohesionScore,
                flow: updated.flowScore,
                total: updated.totalScore
            },
            comments: updated.comments
        }
        
        setDoc(doc(db, 'logs', `${Date.now()}_${updated.id}`), logEntry)
    }

    async function handleDeleteSong(songId) {
        await deleteDoc(doc(db, 'songs', songId))
        
        setSongs(s => s.filter(song => song.id !== songId))
        
        const remainingQueue = songs.filter(s => s.id !== songId && !s.completed)
        setSelectedSongId(remainingQueue.length > 0 ? remainingQueue[0].id : null)
    }

    async function handleLogin() {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
    }

    const selectedSong = songs.find(s => s.id === selectedSongId) ?? null

    return (
        <div className="text-white bg-slate-800 h-screen flex flex-col overflow-hidden">
            <main>
                {user ? (    
                    <>        
                        <header className="bg-slate-800 text-center p-2 shrink-0">
                            <h1 className="text-4xl font-bold text-[#56ebff]">SoundTracker</h1>
                                <input 
                                    className="border border-white mt-2"
                                    type="text"
                                    placeholder=" Search songs..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />                        </header>

                        <div className="grid grid-cols-[1fr_1.5fr_1fr]">
                            <aside className="text-center bg-gray-900 h-[calc(100vh-80px)] overflow-hidden">
                                <SongList
                                    onSongsLoaded = {handleSongsLoaded}
                                    onSelectSong = {handleSelectSong}
                                    onDelete = {handleDeleteSong}
                                    selectedSongId = {selectedSongId}
                                    songs = {filteredQueue}
                                />
                            </aside>
                            
                            <section className="text-center bg-black">
                                <SongForm
                                    song = {selectedSong}
                                    onComplete = {handleCompleteSong}
                                />
                            </section>
                            
                            <aside className="text-center bg-gray-900 h-[calc(100vh-80px)] overflow-hidden">
                                <MainList 
                                    songs = {filteredCompleted} 
                                    onUncomp = {handleUncompleteSong}
                                    onSelectSong = {handleSelectSong}
                                    selectedSongId = {selectedSongId}
                                />
                            </aside>
                        </div>
                    </>
                ) : (
                    <div className="p-5 text-center">
                        <h2>Login Required</h2>
                        <p>Please login to access SoundTracker</p>
                        <button className="cursor-pointer" onClick={handleLogin}>Login with Google</button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
