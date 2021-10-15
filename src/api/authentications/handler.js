const autoBind = require('auto-bind');
const successResponse = require('../../utils/response');

class AuthenticationsHandler {
    constructor({
        authenticationsService, usersService, tokenManager, validator,
    }) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        autoBind(this);
    }

    async postAuthenticationHandler({ payload }, h) {
        this._validator.validatePostAuthenticationPayload(payload);

        const { username, password } = payload;
        const id = await this._usersService.verifyUserCrendential(username, password);

        const jwtAccessToken = this._tokenManager.generateAccessToken({ id });
        const jwtRefreshToken = this._tokenManager.generateRefreshToken({ id });

        await this._authenticationsService.addRefreshToken(jwtRefreshToken);

        return successResponse(h, {
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken,
            },
            statusCode: 201,
        });
    }

    async putAuthenticationHandler({ payload }, h) {
        this._validator.validatePutAuthenticationPayload(payload);

        const { refreshToken } = payload;
        await this._tokenManager.verifyRefreshToken(refreshToken);
        const { id } = this._authenticationsService.verifyRefreshToken(refreshToken);

        const jwtAccessToken = this._tokenManager.generateAccessToken({ id });

        return successResponse(h, {
            message: 'Authentication berhasil diperbarui',
            data: {
                accessToken: jwtAccessToken,
            },
        });
    }

    async deleteAuthenticationHandler({ payload }, h) {
        this._validator.validateDeleteAuthenticationPayload(payload);

        const { refreshToken } = payload;
        await this._tokenManager.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);

        return successResponse(h, {
            message: 'Refresh token berhasil dihapus',
        });
    }
}

module.exports = AuthenticationsHandler;
