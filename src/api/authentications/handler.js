const ClientError = require('../../error/ClientError');

class AuthenticationsHandler {
    constructor({
        authenticationsService, usersService, tokenManager, validator,
    }) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    async postAuthenticationHandler(request, h) {
        try {
            this._validator.validatePostAuthenticationPayload(request.payload);

            const { username, password } = request.payload;
            const id = await this._usersService.verifyUserCrendential(username, password);

            const jwtAccessToken = this._tokenManager.generateAccessToken({ id });
            const jwtRefreshToken = this._tokenManager.generateRefreshToken({ id });

            await this._authenticationsService.addRefreshToken(jwtRefreshToken);

            const response = h.response({
                status: 'success',
                message: 'Authentication berhasil ditambahkan',
                data: {
                    accessToken: jwtAccessToken,
                    refreshToken: jwtRefreshToken,
                },
            });

            response.code(201);
            return response;
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    async putAuthenticationHandler(request, h) {
        try {
            this._validator.validatePutAuthenticationPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._tokenManager.verifyRefreshToken(refreshToken);
            const { id } = this._authenticationsService.verifyRefreshToken(refreshToken);

            const jwtAccessToken = this._tokenManager.generateAccessToken({ id });

            return {
                status: 'success',
                message: 'Authentication berhasil diperbarui',
                data: {
                    accessToken: jwtAccessToken,
                },
            };
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    async deleteAuthenticationHandler(request, h) {
        try {
            this._validator.validateDeleteAuthenticationPayload(request.payload);

            const { refreshToken } = request.payload;
            await this._tokenManager.verifyRefreshToken(refreshToken);
            await this._authenticationsService.deleteRefreshToken(refreshToken);

            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus',
            };
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    _failedResponse(error, server) {
        if (error instanceof ClientError) {
            const response = server.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode);
            return response;
        }

        // Server ERROR!
        const response = server.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        return response;
    }
}

module.exports = AuthenticationsHandler;
