const { TruncateHeaderSchema } = require('./schema');
const InvariantError = require('../../error/InvariantError');

const TruncateValidator = {
    validateTruncateHeaderSchema: (header) => {
        const validationResult = TruncateHeaderSchema.validate(header);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = TruncateValidator;
