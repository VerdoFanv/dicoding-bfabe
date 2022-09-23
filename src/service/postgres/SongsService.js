const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../error/InvariantError')
const NotFoundError = require('../../error/NotFoundError')
const { mapDBToModel } = require('../../utils/mapDB')

class SongsService {
  constructor(cacheControl) {
    this._pool = new Pool()
    this._cacheControl = cacheControl
  }

  async addSongs({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add music!')
    }

    await this._cacheControl.del('songs')

    return result.rows[0].id
  }

  async getSongs({ title, performer }) {
    try {
      const result = await this._cacheControl.get('songs')
      return JSON.parse(result)
    } catch (error) {
      const query = `SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER('%${title}%') AND LOWER(performer) LIKE LOWER('%${performer}%')`

      const result = await this._pool.query(query)
      await this._cacheControl.set('songs', JSON.stringify(result.rows), (60 * 30))

      return result.rows
    }
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Music tidak ditemukan')
    }

    await this._cacheControl.del('songs')

    return result.rows.map(mapDBToModel)[0]
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    }

    await this._cacheControl.del('songs')

    const result = await this._pool.query(query)
    return result.rows
  }

  async editSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update music, ID not found!')
    }

    await this._cacheControl.del('songs')
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus music. Id tidak ditemukan!')
    }

    await this._cacheControl.del('songs')
  }
}

module.exports = SongsService
