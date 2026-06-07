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
        <div className='flex flex-col h-full'>
            <h1 className='text-xl font-semibold text-[#56ebff] p-1 shrink-0 border'>Completed Songs</h1>
            <ul className='overflow-y-auto flex-1'>
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
                        {song.albumArt != null && (<img className="rounded-[5px] w-10 h-10 mr-2" src = {song.albumArt} />)}
                        <div className="text-left flex flex-col flex-1 whitespace-nowrap overflow-hidden">
                            <span>{song.name}</span>
                            <span>{song.artists}</span>
                        </div>
                        <span>{song.totalScore.toFixed(1)}</span>
                        <button
                            className="ml-2 curd-pointer"
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