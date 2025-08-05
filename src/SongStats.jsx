import { useState, useEffect } from 'react'

function SongStats({ song, onChange, onComplete }) {
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

    function handleSaveComponents() {
        if ([vocalScore, backgroundScore, lyricScore, cohesionScore, flowScore].some(v => v == null || isNaN(v))) {
            return
        }

        onChange('vocalScore',      vocalScore)
        onChange('backgroundScore', backgroundScore)
        onChange('lyricScore',      lyricScore)
        onChange('cohesionScore',   cohesionScore)
        onChange('flowScore',       flowScore)

        const sum = vocalScore + backgroundScore + lyricScore + cohesionScore + flowScore
        onChange('totalScore', sum)

        onComplete()
    }

    if (song == null) {
        return (<>
            <div className = "song-stats">
                <h1>No Songs Queued</h1>
            </div>
        </>)
    }

    return (<>
        <div className = "song-stats">
            <h1>{song.name}</h1>
            <h3>Vocals</h3>
            <div className = "vocal">
                <input 
                    type = "number"
                    min = "0"
                    max = "10"
                    placeholder = "Vocals"
                    value = {vocalScore ?? ''}
                    onChange = {e => setVocalScore(e.target.valueAsNumber)}
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
                    onChange = {e => setBackgroundScore(e.target.valueAsNumber)}
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
                    onChange = {e => setLyricScore(e.target.valueAsNumber)}
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
                    onChange = {e => setCohesionScore(e.target.valueAsNumber)}
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
                    onChange = {e => setFlowScore(e.target.valueAsNumber)}
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

export default SongStats