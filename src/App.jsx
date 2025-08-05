import { useState, useEffect } from 'react'
import './App.css'
import SongList from './SongList.jsx'
import SongStats from './SongStats.jsx'
import MainList from './MainList.jsx'

function App() {
    const [tab, setTab] = useState('rankPage')

    const [songs, setSongs] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [completedSongs, setCompletedSongs] = useState([])

    function handleSongsLoaded(loadedSongs) {
        setSongs(loadedSongs)
        setSelectedIndex(prev => {
            if (loadedSongs.length === 0) {
                return null
            }
            if (prev === null) {
                return 0
            }

            return prev
        })
    }

    function handleSelectSong(index) {
        setSelectedIndex(index)
    }

    function handleValueChange(field, value) {
        setSongs(s =>
            s.map((song, i) =>
                i === selectedIndex ? { ...song, [field]: value } : song
            )
        )
    }
    
    const selectedSong = songs[selectedIndex] ?? null

function handleCompleteSong() {
    const idx = selectedIndex;

    if (idx === null) 
        return;

    const compSong = songs[idx];
    const newSongs = songs.filter((_, i) => i !== idx);

    setSongs(newSongs);
    setCompletedSongs(prev => [...prev, compSong]);
    
    setSelectedIndex(newSongs.length > 0 ? 0 : null);
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
                            />
                        </aside>
                        <section>
                            <SongStats 
                                song = {selectedSong} 
                                onChange = {handleValueChange}
                                onComplete = {handleCompleteSong}
                            />
                        </section>
                    </div>
                ) : (
                    <MainList 
                        songs = {completedSongs} 
                    />
                )}
            </main>
        </div>
    )
}

export default App
