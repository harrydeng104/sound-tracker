import { useState, useEffect, useRef } from 'react'

function SongForm({ song, onChange, onComplete }) {
    const [vocalScore, setVocalScore] = useState(null)
    const [backgroundScore, setBackgroundScore] = useState(null)
    const [lyricScore, setLyricScore] = useState(null)
    const [cohesionScore, setCohesionScore] = useState(null)
    const [flowScore, setFlowScore] = useState(null)
    const [totalScore, setTotalScore] = useState(null)
    const [comments, setComments] = useState('')

    const vocalInputRef = useRef(null)

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
            <div>
                <h1>No Songs Queued</h1>
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
            <h1 className="text-2xl font-semibold">
                <a href={song.externalUrls} target="_blank" rel="noopener noreferrer">
                    {song.name}
                </a>
            </h1>
            <span>{song.artists}</span>
            <h3>Vocals</h3>
            <div>
                <input 
                    className="border border-white"
                    ref={vocalInputRef}
                    type = "number"
                    min = "0"
                    max = "10"
                    value = {vocalScore ?? ''}
                    onChange = {e => validateAndSetScore(setVocalScore, e.target.valueAsNumber)}
                />
            </div>
            
            <h3>Background</h3>
            <div>
                <input 
                    className="border border-white"
                    type = "number"
                    min = "0"
                    max = "10"
                    value = {backgroundScore ?? ''}
                    onChange = {e => validateAndSetScore(setBackgroundScore, e.target.valueAsNumber)}
                />
            </div>
            
            <h3>Lyrics</h3>
            <div>
                <input 
                    className="border border-white"
                    type = "number"
                    min = "0"
                    max = "10"
                    value = {lyricScore ?? ''}
                    onChange = {e => validateAndSetScore(setLyricScore, e.target.valueAsNumber)}
                />
            </div>

            <h3>Cohesion</h3>
            <div>
                <input 
                    className="border border-white"
                    type = "number"
                    min = "0"
                    max = "10"
                    value = {cohesionScore ?? ''}
                    onChange = {e => validateAndSetScore(setCohesionScore, e.target.valueAsNumber)}
                />
            </div>
            
            <h3>Flow</h3>
            <div>
                <input 
                    className="border border-white"
                    type = "number"
                    min = "0"
                    max = "10"
                    value = {flowScore ?? ''}
                    onChange = {e => validateAndSetScore(setFlowScore, e.target.valueAsNumber)}
                />
            </div>

            <h3>Comments</h3>
            <div>
                <textarea
                    className="border border-white"
                    value = {comments}
                    onChange = {e => setComments(e.target.value)}
                    rows = "3"
                />
            </div>

            <button 
                className="cursor-pointer bg-blue-950 pr-1 pl-1"
                onClick = {handleSaveComponents}
            >
                Save
            </button>
        </div>
    </>)
}

export default SongForm