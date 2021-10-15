const autoBind = require('auto-bind');
const successResponse = require('../../utils/response');

class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postUserHandler({ payload }, h) {
        this._validator.validateUserPayload(payload);

        const { username, password, fullname } = payload;
        const id = await this._service.addUser({ username, password, fullname });

        return successResponse(h, {
            message: 'User berhasil ditambahkan',
            data: {
                userId: id,
            },
            statusCode: 201,
        });
    }
}

module.exports = UsersHandler;
