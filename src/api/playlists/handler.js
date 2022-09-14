const ClientError = require('../../error/ClientError')

class playlistsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this)
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this)
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this)
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistSchema(request.payload)
      const { name } = request.payload

      const { id: credentialId } = request.auth.credentials
      const id = await this._service.addPlaylist(name, credentialId)

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId: id,
        },
      })

      response.code(201)
      return response
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const result = await this._service.getPlaylists(credentialId)

      return {
        status: 'success',
        data: {
          playlists: result,
        },
      }
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistOwner(playlistId, credentialId)
      await this._service.deletePlaylistById(playlistId)

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      }
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePostSongToPlaylistSchema(request.payload)

      const { songId } = request.payload
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.addSongToPlaylist(songId, playlistId)

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      })

      response.code(201)
      return response
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async getSongsFromPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      const result = await this._service.getSongsInPlaylist(playlistId)

      return {
        status: 'success',
        data: {
          songs: result,
        },
      }
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this._validator.validateDeleteSongFromPlaylistSchema(request.payload)

      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.deleteSongFromPlaylistById(playlistId)

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      }
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  _failedResponse(error, server) {
    if (error instanceof ClientError) {
      const response = server.response({
        status: 'fail',
        message: error.message,
      })
      response.code(error.statusCode)
      return response
    }

    // Server ERROR!
    const response = server.response({
      status: 'error',
      message: error.message,
    })

    response.code(500)
    return response
  }
}

module.exports = playlistsHandler
