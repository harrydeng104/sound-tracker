import { useState, useEffect } from 'react'

function SongForm({ song, onChange, onComplete }) {
    const [vocalScore, setVocalScore] = useState(null)
    const [backgroundScore, setBackgroundScore] = useState(null)
    const [lyricScore, setLyricScore] = useState(null)
    const [cohesionScore, setCohesionScore] = useState(null)
    const [flowScore, setFlowScore] = useState(null)
    const [totalScore, setTotalScore] = useState(null)

    useEffect(() => {
        setVocalScore(null)
        setBackgroundScore(null)
        setLyricScore(null)
        setCohesionScore(null)
        setFlowScore(null)
        setTotalScore(null)
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
            totalScore: (vocalScore + backgroundScore + lyricScore + cohesionScore + flowScore) / 5
        }

        onComplete(updatedSong)
    }

    if (song == null) {
        return (<>
            <div className = "song-stats">
                <h1>No Songs Queued</h1>
            </div>
        </>)
    }

    return (<>
        <div className = "song-form">
            <h1>{song.name}</h1>
            <h3>Vocals</h3>
            <div className = "vocal">
                <input 
                    type = "number"
                    min = "0"
                    max = "10"
                    placeholder = "Vocals"
                    value = {vocalScore ?? ''}
                    onChange = {e => validateAndSetScore(setVocalScore, e.target.valueAsNumber)}
                />
            </div>
            
            <h3>Background</h3>
            <div className = "background">
                <input 
                    type = "number"
                    min = "0"
                    max = "10"
                    placeholder = "Background"
                    value = {backgroundScore ?? ''}
                    onChange = {e => validateAndSetScore(setBackgroundScore, e.target.valueAsNumber)}
                />
            </div>
            
            <h3>Lyrics</h3>
            <div className = "lyric">
                <input 
                    type = "number"
                    min = "0"
                    max = "10"
                    placeholder = "Lyrics"
                    value = {lyricScore ?? ''}
                    onChange = {e => validateAndSetScore(setLyricScore, e.target.valueAsNumber)}
                />
            </div>

            <h3>Cohesion</h3>
            <div className = "cohesion">
                <input 
                    type = "number"
                    min = "0"
                    max = "10"
                    placeholder = "Cohesion"
                    value = {cohesionScore ?? ''}
                    onChange = {e => validateAndSetScore(setCohesionScore, e.target.valueAsNumber)}
                />
            </div>
            
            <h3>Flow</h3>
            <div className = "flow">
                <input 
                    type = "number"
                    min = "0"
                    max = "10"
                    placeholder = "Flow"
                    value = {flowScore ?? ''}
                    onChange = {e => validateAndSetScore(setFlowScore, e.target.valueAsNumber)}
                />
            </div>

            <button 
                className = "save-button"
                onClick = {handleSaveComponents}
            >
                Save
            </button>
        </div>
    </>)
}

export default SongForm