import { useState, useEffect } from 'react'

function MainList({ songs }) {
    if (songs == null || songs.length === 0) {
        return (<>
            <div className = "song-stats">
                <h1>No completed songs</h1>
            </div>
        </>)
    }

    return (<>
        <div className="main-list">
            <h1>Completed Songs</h1>
            <ul>
                {songs.map((song, i) => (
                    <li key={song.id ?? i}>{song.name}</li>
                ))}
            </ul>
        </div>
    </>)
}

export default MainList