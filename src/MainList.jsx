import clsx from 'clsx'
 
function MainList({ songs, onUncomp, onSelectSong, selectedSongId }) {
    if (songs == null || songs.length === 0) {
        return (
            <div>
                <h1>No completed songs</h1>
            </div>
        )
    }

    return (<>
        <div>
            <h1>Completed Songs</h1>
            <ul>
                {songs.map((song) => 
                    <li 
                        key = {song.id}
                        className={clsx(
                            "p-1 flex items-center hover:bg-gray-700",
                            {
                                'border border-white': song.id === selectedSongId
                            }
                        )} 
                        onClick = {() => onSelectSong(song)}
                    >
                        {song.albumArt != null && (<img className="rounded-[5px] w-10 h-10 mr-1" src = {song.albumArt} />)}
                        <div className="text-left flex flex-col w-50 whitespace-nowrap overflow-hidden">
                            <span>{song.name}</span>
                            <span>{song.artists}</span>
                            <span>{song.totalScore}</span>
                        </div>
                        <button
                            className="ml-2 cursor-pointer"
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