import { useState, useEffect } from 'react'
import './App.css'
import SongList from './SongList.jsx'
import SongForm from './SongForm.jsx'
import MainList from './MainList.jsx'

function App() {
    const [tab, setTab] = useState('rankPage')

    const [songs, setSongs] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [completedSongs, setCompletedSongs] = useState([])

    function handleSongsLoaded(loadedSongs) {
        setSongs(loadedSongs)
        setSelectedIndex(loadedSongs.length > 0 ? 0 : null)
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

    function handleCompleteSong(compSong) {
        setSongs(s => s.filter(sng => sng.id !== compSong.id))

        setCompletedSongs(c => [...c, compSong])

        setSelectedIndex(s => (s > 0 ? 0 : null))
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
                                songs = {songs}
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
                        songs = {completedSongs} 
                    />
                )}
            </main>
        </div>
    )
}

export default App
