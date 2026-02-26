import { useState, useEffect } from 'react'
import './App.css'
import SongList from './SongList.jsx'
import SongForm from './SongForm.jsx'
import MainList from './MainList.jsx'

function App() {
    const [tab, setTab] = useState('rankPage')

    const [songs, setSongs] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    // const [completedSongs, setCompletedSongs] = useState([])

    const queueSongs = songs.filter(sng => sng.completed !== true)
    const compSongs = songs.filter(sng => sng.completed === true)

    compSongs.sort((a, b) => b.totalScore - a.totalScore)

    function handleSongsLoaded(loadedSongs) {
        setSongs(existing => {
            const existingIds = new Set(existing.map(s => s.id))
            const newSongs = loadedSongs.filter(song => !existingIds.has(song.id))
            const combined = [...existing, ...newSongs]
            const incompleteCount = combined.filter(s => !s.completed).length
            setSelectedIndex(incompleteCount > 0 ? 0 : null)
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
            s.map(song =>
                song.id === targetSong.id ? { ...song, [field]: value } : song
            )
        )
    }
    
    const selectedSong = queueSongs[selectedIndex] ?? null
    
    function handleCompleteSong(compSong) {
        setSongs(s => 
            s.map(song => 
                song.id === compSong.id 
                    ? { ...compSong, completed: true }
                    : song
            )
        )
        setSelectedIndex(0)
    }

    function handleUncompleteSong(uncompSong) {
        const moveBack = window.confirm("Are you sure you want to move this song back to the queue?")

        if (moveBack) {
            setSongs(s => 
                s.map(song => 
                    song.id === uncompSong.id 
                        ? { ...song, completed: false } 
                        : song
                )
            )
        }
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
                                onChange = {handleValueChange}
                                onComplete = {handleCompleteSong}
                            />
                        </section>
                    </div>
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
