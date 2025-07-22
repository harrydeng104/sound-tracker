import { useState, useEffect } from 'react'

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const playlistId   = "4S0TiIINuzUV63b1TYFNK8";

function SongList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
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
    }, [])

    return (<>
        <div>
            <h1>Songs</h1>
            <ul>
                {items.map((name, i) => (
                <li key={i}>{name}</li>
                ))}
            </ul>
        </div>
    </>)
}

export default SongList