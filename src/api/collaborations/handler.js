const ClientError = require('../../error/ClientError');

class collaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validatePostCollaborationSchema(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            const id = await this._collaborationsService.addCollaboration(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                    collaborationId: id,
                },
            });

            response.code(201);
            return response;
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateDeleteCollaborationSchema(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collaborationsService.deleteCollaboration(playlistId, userId);

            return {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
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

module.exports = collaborationsHandler;
