require('dotenv').config();

const autoBind = require('auto-bind');
const AuthorizationError = require('../../error/AuthorizationError');
const successResponse = require('../../utils/response');

class TruncateHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async deleteAllTableHandler({ headers }, h) {
        await this._validator.validateTruncateHeaderSchema(headers);
        const header = headers['x-auth-token'];

        if (header !== process.env.API_KEY) {
            throw new AuthorizationError('Gagal menghapus semua data tabel, Api Token salah!');
        }

        await this._service.deleteAllTable();

        return successResponse(h, {
            message: 'Berhasil menghapus semua data pada tabel...',
        });
    }
}

module.exports = TruncateHandler;
