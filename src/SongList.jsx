import { useState, useEffect } from 'react'
import clsx from 'clsx'

const clientId = import.meta.env.VITE_CLIENT_ID
const clientSecret = import.meta.env.VITE_CLIENT_SECRET

function SongList({ onSongsLoaded, onSelectSong, onDelete, selectedSongId, songs }) {
    const [newId, setNewId] = useState("")
    const [playlistId, setPlaylistId] = useState("") 
    const [reload, forceReload] = useState(0)

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
        forceReload(c => c + 1)
    }

    function deleteSong(index) {
        const songToDelete = songs[index] 
        onDelete(songToDelete.id)
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

                let allItems = []
                let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`
                let headers = { Authorization: `Bearer ${access_token}` } 

                while (nextUrl != null) {
                    const body = await fetch(nextUrl, { headers })
                    const fullResponse = await body.json()
                    allItems.push(...fullResponse.items)
                    nextUrl = fullResponse.next
                }
                
                const mapItems = allItems
                    .filter(item => item.track != null)
                    .map(item => {
                        const song = item.track

                        return {
                            id: song.id,
                            name: song.name,
                            artists: song.artists.map(a => a.name).join(', '),
                            album: song.album.name,
                            albumArt: song.album.images[0]?.url,
                            releaseDate: song.album.release_date,
                            durationMs: song.duration_ms,
                            externalUrls: song.external_urls.spotify,
                            
                            vocalScore: null,
                            backgroundScore: null, 
                            lyricScore: null, 
                            cohesionScore: null,
                            flowScore: null, 
                            totalScore: null,
                            comments: '',

                            completed: false,
                        }
                    })

                onSongsLoaded(mapItems)
            }
            catch (error) {
                console.error(error)
            }
        }

        getData()
    }, [playlistId, reload])

    return (<>
        <div>
            <h1>Songs</h1>
                <div className="border border-white"> 
                    <input 
                        type = "text"
                        placeholder = "Enter playlist link..."
                        value = {newId}
                        onChange = {handleInputChange}
                        onKeyDown = {e => { if (e.key === 'Enter') setId() }}
                    />
                    <button 
                        onClick = {setId}
                    >
                        Enter
                    </button>
                </div>
            <ul>
                {songs.map((song, index) => 
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
                        </div>
                        <button
                            className="ml-2 cursor-pointer"
                            onClick = {e => {
                                e.stopPropagation()
                                deleteSong(index)
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

export default SongList