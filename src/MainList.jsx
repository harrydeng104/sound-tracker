function MainList({ songs, onUncomp, onSelectSong, selectedSongId }) {
    if (songs == null || songs.length === 0) {
        return (
            <div className = "main-list">
                <h1>No completed songs</h1>
            </div>
        )
    }

    return (<>
        <div className = "main-list">
            <h1>Completed Songs</h1>
            <ul>
                {songs.map((song) => 
                    <li 
                        key = {song.id}
                        className = {song.id === selectedSongId ? 'selected-song' : 'song-item'} 
                        onClick = {() => onSelectSong(song)}
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
    </>)
}

export default MainList