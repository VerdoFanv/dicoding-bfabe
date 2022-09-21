const { TruncatePayloadSchema } = require('./schema')
const InvariantError = require('../../error/InvariantError')

const TruncateValidator = {
  validateTruncateHeaderSchema: (header) => {
    const validationResult = TruncatePayloadSchema.validate(header)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = TruncateValidator
