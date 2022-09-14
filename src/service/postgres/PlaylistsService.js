const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const { mapGetPlaylists, mapGetSongs } = require('../../utils/mapDB')
const InvariantError = require('../../error/InvariantError')
const NotFoundError = require('../../error/NotFoundError')
const AuthorizationError = require('../../error/AuthorizationError')

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool()
    this._collaborationsService = collaborationsService
  }

  async addPlaylist(songName, owner) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, songName, owner],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists(owner) {
    const query = {
      text: `
                SELECT playlists.id, playlists.name, users.username
                FROM playlists
                LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                INNER JOIN users ON playlists.owner = users.id
                WHERE playlists.owner = $1 OR collaborations.user_id = $1
                GROUP BY playlists.id, users.id
            `,
      values: [owner],
    }

    const result = await this._pool.query(query)

    return result.rows.map(mapGetPlaylists)
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus playlist, Id tidak ditemukan')
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak mempunyai akses. Atas resource ini...')
    }
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = nanoid(16)
    const query = {
      text: 'INSERT INTO playlistsongs VALUES ($1, $2, $3)',
      values: [id, playlistId, songId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist')
    }
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `
                SELECT songs.* FROM songs
                LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
                WHERE playlistsongs.playlist_id = $1
                GROUP BY songs.id
            `,
      values: [playlistId],
    }
    const result = await this._pool.query(query)

    return result.rows.map(mapGetSongs)
  }

  async deleteSongFromPlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1',
      values: [playlistId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari playlist. Id playlist tidak ditemukan')
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
