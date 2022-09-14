const ClientError = require('../../error/ClientError')

class AlbumsHandler {
  constructor({ albumsService, songsService, validator }) {
    this._albumsService = albumsService
    this._songsService = songsService
    this._validator = validator

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
  }

  async postAlbum({ payload }, h) {
    try {
      await this._validator.validateAlbumPayload(payload)
      const { name, year } = payload

      const albumId = await this._albumsService.addAlbum({ name, year })

      const response = h.response({
        status: 'success',
        data: { albumId },
      })

      response.code(201)
      return response
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async getAlbumById({ params }, h) {
    try {
      const { id } = params
      const album = await this._albumsService.getAlbumById(id)
      const songs = await this._songsService.getSongsByAlbumId(id)

      return {
        status: 'success',
        data: {
          album: {
            ...album,
            songs,
          },
        },
      }
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async putAlbumById({ params, payload }, h) {
    try {
      await this._validator.validateAlbumPayload(payload)
      const { id } = params
      await this._albumsService.editAlbumById(id, payload)

      return {
        status: 'success',
        message: 'Album has beed updated!',
      }
    } catch (error) {
      return this._failedResponse(error, h)
    }
  }

  async deleteAlbumById({ params }, h) {
    try {
      const { id } = params
      await this._albumsService.deleteAlbumById(id)

      return {
        status: 'success',
        message: 'Album has beed deleted!',
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

    const response = server.response({
      status: 'error',
      message: 'Sorry, there was a server failure!',
    })

    response.code(500)
    return response
  }
}

module.exports = AlbumsHandler