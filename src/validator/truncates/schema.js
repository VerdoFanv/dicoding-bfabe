const Joi = require('joi');

const TruncateHeaderSchema = Joi.object({
    'x-auth-token': Joi.string().required(),
}).unknown();

module.exports = { TruncateHeaderSchema };
