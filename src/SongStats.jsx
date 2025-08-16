import { useState, useEffect } from 'react'

function SongStats( {song, onClose} ) {
    if (song == null) {
        return null
    }

    return (<>
                <div className = "song-stats">
            <h1>{song.name}</h1>
            <p>Total {song.totalScore}</p>

            <p>Vocals {song.vocalScore}</p>
            
            <p>Background {song.backgroundScore}</p>
            
            <p>Lyrics {song.lyricScore}</p>

            <p>Cohesion {song.cohesionScore}</p>
            
            <p>Flow {song.flowScore}</p>

            <button 
                className = "close-button"
                onClick = {onClose}
            >
                Close
            </button>
        </div>
    </>)
}

export default SongStats