import { useState, useEffect } from 'react'
import SongList from './SongList.jsx'
import SongForm from './SongForm.jsx'
import MainList from './MainList.jsx'

import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { db, auth } from './firebase'

function App() {
    const [songs, setSongs] = useState([])
    const [selectedSongId, setSelectedSongId] = useState(null)

    const [user, setUser] = useState(null)

    const [searchQuery, setSearchQuery] = useState('')

    const queueSongs = songs.filter(sng => sng.completed !== true)
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
        const loadSongs = async () => {
            const querySnapshot = await getDocs(collection(db, 'songs'))
            const loadedSongs = querySnapshot.docs.map(doc => doc.data())
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
    
    const selectedSong = songs.find(s => s.id === selectedSongId) ?? null
    
    function handleCompleteSong(compSong) {
        const updated = { ...compSong, completed: true }
        
        setSongs(s => 
            s.map(song => 
                song.id === compSong.id ? updated : song
            )
        )
        
        setDoc(doc(db, 'songs', compSong.id), updated)
        
        const remainingQueue = songs.filter(s => s.id !== compSong.id && !s.completed)
        if (remainingQueue.length > 0) {
            setSelectedSongId(remainingQueue[0].id)
        } else {
            setSelectedSongId(null)
        }

        const logEntry = {
            action: compSong.completed ? 'updated' : 'completed',
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
        setSelectedSongId(remainingQueue.length > 0 ? remainingQueue[0].id : null)
    }

    async function handleLogin() {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        setUser(result.user)
        console.log('Your Firebase UID:', result.user.uid)
    }

    return (
        <div className="text-white bg-slate-800 h-screen">
            <main>
                {user ? (    
                    <>        
                        <header className="bg-slate-800 text-center p-2">
                            <h1 className="text-4xl font-bold">SoundTracker</h1>
                                <input 
                                    className="border border-white mt-2"
                                    type="text"
                                    placeholder=" Search songs..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                        </header>

                        <div className="grid grid-cols-[1fr_1.5fr_1fr]">
                            <aside className="text-center bg-gray-900 h-[calc(100vh-80px)] overflow-y-auto">
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
                            
                            <aside className="text-center bg-gray-900 h-[calc(100vh-80px)] overflow-y-auto">
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
