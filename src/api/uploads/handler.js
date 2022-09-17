class UploadImagesHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postUploadImagesHandler = this.postUploadImagesHandler.bind(this)
  }

  async postUploadImagesHandler({ payload }, h) {
    const { data } = payload

    this._validator.validateUploadHeadersSchema(data.hapi.headers)

    const filename = await this._service.uploadFile(data, data.hapi)

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/${filename}`,
      },
    })

    response.code(201)
    return response
  }
}

module.exports = UploadImagesHandler
