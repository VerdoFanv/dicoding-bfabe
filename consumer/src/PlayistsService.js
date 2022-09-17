const { Pool } = require('pg')

class PlayistsService {
  constructor(cacheControl) {
    this._pool = new Pool()
    this._cacheControl = cacheControl
  }

  async getPlaylists(playlistId) {
    try {
      const result = await this._cacheControl.get(`playlist:${playlistId}`)
      return JSON.parse(result)
    } catch {
      const query = {
        text: `
                    SELECT songs.title, songs.year, songs.performer, songs.genre, songs.duration FROM songs
                    LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
                    WHERE playlistsongs.playlist_id = $1
                `,
        values: [playlistId],
      }

      const result = await this._pool.query(query)
      const parseToJSON = JSON.stringify(result.rows)

      await this._cacheControl.set(`playlist:${playlistId}`, parseToJSON)

      return result.rows
    }
  }
}

module.exports = PlayistsService
