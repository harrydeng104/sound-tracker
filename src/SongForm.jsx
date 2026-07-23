import { useState, useEffect, useRef } from 'react'

function SongForm({ song, onComplete, compSongs = [] }) {
    const [vocalScore, setVocalScore] = useState(null)
    const [backgroundScore, setBackgroundScore] = useState(null)
    const [lyricScore, setLyricScore] = useState(null)
    const [cohesionScore, setCohesionScore] = useState(null)
    const [flowScore, setFlowScore] = useState(null)
    const [comments, setComments] = useState('')

    const [focusedField, setFocusedField] = useState(null)

    const vocalInputRef = useRef(null)

    // I'm not too happy with this, change it later.
    const scoreFields = {
        vocals:     { label: 'Vocals',     value: vocalScore,      dbKey: 'vocalScore' },
        background: { label: 'Background', value: backgroundScore,  dbKey: 'backgroundScore' },
        lyrics:     { label: 'Lyrics',     value: lyricScore,       dbKey: 'lyricScore' },
        cohesion:   { label: 'Cohesion',   value: cohesionScore,    dbKey: 'cohesionScore' },
        flow:       { label: 'Flow',       value: flowScore,        dbKey: 'flowScore' }
    }

    let matchlist = []
    
    if (focusedField && scoreFields[focusedField].value != null) {
        matchlist = compSongs.filter(s => s[scoreFields[focusedField].dbKey] === scoreFields[focusedField].value)
    }
    // end of area that needs to be changed

    useEffect(() => {
        if (song) {
            setVocalScore(song.vocalScore ?? null)
            setBackgroundScore(song.backgroundScore ?? null)
            setLyricScore(song.lyricScore ?? null)
            setCohesionScore(song.cohesionScore ?? null)
            setFlowScore(song.flowScore ?? null)
            setComments(song.comments ?? '')

            setTimeout(() => {
                vocalInputRef.current?.focus()
            }, 0)
        } else {
            setVocalScore(null)
            setBackgroundScore(null)
            setLyricScore(null)
            setCohesionScore(null)
            setFlowScore(null)
            setComments('')
        }

        setFocusedField(null)
    }, [song])

    function validateAndSetScore(setValue, value) {
        if (isNaN(value)) {
            setValue(null)
            return
        }

        if (value < 0 || value > 10) {
            window.alert("Please enter a number between 0 and 10")
            setValue(null)
            return
        }

        setValue(value)
    }

    function handleSaveComponents() {
        if ([vocalScore, backgroundScore, lyricScore, cohesionScore, flowScore].some(v => v == null || isNaN(v))) {
            return
        }

        const updatedSong = {
            ...song,
            vocalScore,
            backgroundScore,
            lyricScore,
            cohesionScore,
            flowScore,
            totalScore: (vocalScore + backgroundScore + lyricScore + cohesionScore + flowScore) / 5,
            comments
        }

        onComplete(updatedSong)
    }

    if (song == null) {
        return (<>
            <div className='flex flex-col h-full items-center justify-center'>
                <h1 className='text-white/50'>No Songs Queued</h1>
            </div>
        </>)
    }

    return (<>
        <div
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSaveComponents()
                }
            }}
        >
            <div className=''>
                <h1 className="text-lightest-blue text-2xl font-bold p-2 text-decoration-line: underline">
                    <a href={song.externalUrls} target="_blank" rel="noopener noreferrer">
                        {song.name}
                    </a>
                </h1>
                <span className='text-white font-semibold'>{song.artists}</span>
            </div>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,3fr)]'>
                <div className='items-center m-2 rounded-2xl'>
                    <h3 className='font-semibold'>Vocals</h3>
                    <div>
                        <input 
                            className="bg-mid-blue p-1 w-15 rounded-md m-1"
                            ref={vocalInputRef}
                            type = "number"
                            min = "0"
                            max = "10"
                            value = {vocalScore ?? ''}
                            onChange = {e => validateAndSetScore(setVocalScore, e.target.valueAsNumber)}
                            onFocus={() => setFocusedField('vocals')}
                        />
                    </div>
                    
                    <h3 className='font-semibold'>Background</h3>
                    <div>
                        <input 
                            className="bg-mid-blue p-1 w-15 rounded-md m-1"
                            type = "number"
                            min = "0"
                            max = "10"
                            value = {backgroundScore ?? ''}
                            onChange = {e => validateAndSetScore(setBackgroundScore, e.target.valueAsNumber)}
                            onFocus={() => setFocusedField('background')}
                        />
                    </div>
                    
                    <h3 className='font-semibold'>Lyrics</h3>
                    <div>
                        <input 
                            className="bg-mid-blue p-1 w-15 rounded-md m-1"
                            type = "number"
                            min = "0"
                            max = "10"
                            value = {lyricScore ?? ''}
                            onChange = {e => validateAndSetScore(setLyricScore, e.target.valueAsNumber)}
                            onFocus={() => setFocusedField('lyrics')}
                        />
                    </div>

                    <h3 className='font-semibold'>Cohesion</h3>
                    <div>
                        <input 
                            className="bg-mid-blue p-1 w-15 rounded-md m-1"
                            type = "number"
                            min = "0"
                            max = "10"
                            value = {cohesionScore ?? ''}
                            onChange = {e => validateAndSetScore(setCohesionScore, e.target.valueAsNumber)}
                            onFocus={() => setFocusedField('cohesion')}
                        />
                    </div>
                    
                    <h3 className='font-semibold'>Flow</h3>
                    <div>
                        <input 
                            className="bg-mid-blue p-1 w-15 rounded-md m-1"
                            type = "number"
                            min = "0"
                            max = "10"
                            value = {flowScore ?? ''}
                            onChange = {e => validateAndSetScore(setFlowScore, e.target.valueAsNumber)}
                            onFocus={() => setFocusedField('flow')}
                        />
                    </div>
                </div>

                <div className='flex flex-col max-h-80 m-2 rounded-2xl'>
                    <h1 className='font-semibold'>
                        {focusedField && (scoreFields[focusedField].label + ': ' + (scoreFields[focusedField].value ?? ''))}
                    </h1>
                    <ul className='flex-1 bg-mid-blue rounded-xl m-1 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-light-blue snap-y snap-mandatory'>
                        {focusedField && matchlist.length === 0 && (
                            <span className="text-white/50">No matched songs</span>
                        )}
                        {matchlist.map((song) => 
                            <li 
                                key = {song.id}
                                className="p-2 flex items-center snap-start"
                            >
                                {song.albumArt != null && (<img className="rounded-[5px] w-10 h-10 mr-2" src = {song.albumArt} />)}
                                <div className="text-left flex flex-col flex-1 whitespace-nowrap overflow-hidden">
                                    <span>{song.name}</span>
                                    <span className="text-white/50">{song.artists}</span>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className='m-4 mt-0'>
                <h3 className='font-semibold'>Comments</h3>

                <div>
                    <textarea
                        className="bg-mid-blue rounded-2xl w-19/20 m-1 p-2"
                        value = {comments}
                        onChange = {e => setComments(e.target.value)}
                        rows = "5"
                    />
                </div>

                <button 
                    className="text-black cursor-pointer bg-light-blue p-1 pr-2 pl-2 rounded-full hover:bg-lightest-blue"
                    onClick = {handleSaveComponents}
                >
                    Save
                </button>
            </div>
        </div>
    </>)
}

export default SongForm