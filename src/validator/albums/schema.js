const Joi = require('joi')

const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
})

module.exports = { AlbumsPayloadSchema }