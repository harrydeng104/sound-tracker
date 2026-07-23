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
            <h1 className='text-xl font-bold text-lightest-blue p-2 shrink-0'>Completed Songs [{songs.length}]</h1>
            <ul className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-light-blue snap-y snap-mandatory'>
                {songs.map((song, index) => 
                    <li 
                        key = {song.id}
                        className={clsx(
                            "p-1 flex items-center hover:bg-light-blue m-2 rounded-xl snap-start",
                            {
                                'bg-mid-blue': song.id === selectedSongId
                            }
                        )} 
                        onClick = {() => onSelectSong(song)}
                    >
                        <span className='text-lightest-blue mr-3 ml-1 font-semibold'>{index + 1}</span>
                        {song.albumArt != null && (<img className="rounded-[5px] w-10 h-10 mr-2" src = {song.albumArt} />)}
                        <div className="text-left flex flex-col flex-1 whitespace-nowrap overflow-hidden mr-2">
                            <span>{song.name}</span>
                            <span className="text-white/50">{song.artists}</span>
                        </div>
                        <span>{song.totalScore.toFixed(1)}</span>
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