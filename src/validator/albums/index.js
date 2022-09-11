const InvariantError = require('../../error/InvariantError')
const { AlbumsPayloadSchema } = require('./schema')

const AlbumnsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = AlbumnsValidator
