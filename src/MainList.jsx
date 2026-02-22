import { useState, useEffect } from 'react'
import SongStats from './SongStats.jsx'

function MainList({ songs, onUncomp }) {
    const [selectedIndex, setSelectedIndex] = useState(null)

    if (songs == null || songs.length === 0) {
        return (<>
            <div className = "song-stats">
                <h1>No completed songs</h1>
            </div>
        </>)
    }

    return (<>
        <div className = "main-list">
            <h1>Completed Songs</h1>
            <ul>
                {songs.map((song, index) => 
                    <li 
                        key = {song.id}
                        className = {index === selectedIndex ? 'selected-song' : 'song-item'} 
                        onClick = {() => setSelectedIndex(index)}
                    >
                        {song.albumArt != null && (<img className = "song-image" src = {song.albumArt} />)}
                        <div className = "song-info">
                            <span className = "song-name">{song.name}</span>
                            <span className = "song-artists">{song.artists}</span>
                            <span className = "song-totalScore">{song.totalScore}</span>
                        </div>
                        <button
                            className = "delete-button"
                            onClick = {e => {
                                e.stopPropagation()
                                onUncomp(song)
                            }}
                        >
                            🗑️
                        </button>
                    </li>
                )}
            </ul>
        </div>
        <div className = "song-stats">
            {selectedIndex !== null && (
                <SongStats
                song = {songs[selectedIndex]}
                onClose = {() => setSelectedIndex(null)}
                />
            )}
        </div>
    </>)
}

export default MainList