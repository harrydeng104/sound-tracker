import { useState, useEffect } from 'react'

const clientId = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET

function SongList() {
    const [items, setItems] = useState([])
    const [newId, setNewId] = useState("")
    const [playlistId, setPlaylistId] = useState("") 

    function handleInputChange(event) {
        setNewId(event.target.value)
    }

    function setId() {
        let id = newId.trim()

        const match = id.match(/playlist\/([A-Za-z0-9]+)/)

        if (match) {
            id = match[1];
        }

        setPlaylistId(id)
        setNewId("")
    }

    useEffect(() => {
        if (!playlistId) return
        const getData = async () => {
            const url = "https://accounts.spotify.com/api/token"

            try {
                const token = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        grant_type:    "client_credentials",
                        client_id:     clientId,
                        client_secret: clientSecret,
                    }),
                })
                
                const response = await token.json()
                const access_token = response.access_token
                
                const body = await fetch(
                    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                    { headers: { Authorization: `Bearer ${access_token}` } }
                )

                const fullResponse = await body.json()
                const items = fullResponse.items

                setItems(items.map(i => i.track.name))
            }
            catch (error) {
                console.error(error)
            }
        }

        getData()
    }, [playlistId])

    return (<>

        <div className = "song-list">
            <h1>Songs</h1>
                <div> 
                    <input 
                        type = "text"
                        placeholder = "Enter playlist link..."
                        value = {newId}
                        onChange = {handleInputChange}
                        onKeyDown = { e => { if (e.key === 'Enter') setId() }}
                    />
                    <button 
                        className = "enter-button"
                        onClick = {setId}
                    >
                        Enter
                    </button>
                </div>
            <ul>
                {items.map((name, i) => (
                <li key = {i}>
                    {name}
                </li>
                ))}
            </ul>
        </div>
    </>)
}

export default SongList