require('dotenv').config();
const autoBind = require('auto-bind');
const successResponse = require('../../utils/response');

class UploadImagesHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postUploadImagesHandler({ payload }, h) {
        const { data } = payload;

        this._validator.validateUploadHeadersSchema(data.hapi.headers);

        const filename = await this._service.uploadFile(data, data.hapi);

        return successResponse(h, {
            message: 'Gambar berhasil diunggah',
            data: {
                pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/${filename}`,
            },
            statusCode: 201,
        });
    }
}

module.exports = UploadImagesHandler;
