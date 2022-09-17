const { UploadHeadersSchema } = require('./schema')
const InvariantError = require('../../error/InvariantError')

const UploadsValidator = {
  validateUploadHeadersSchema: (header) => {
    const validationResult = UploadHeadersSchema.validate(header)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = UploadsValidator
