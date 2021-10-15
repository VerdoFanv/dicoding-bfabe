const autoBind = require('auto-bind');
const successResponse = require('../../utils/response');

class collaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        autoBind(this);
    }

    async postCollaborationHandler(request, h) {
        this._validator.validatePostCollaborationSchema(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        const id = await this._collaborationsService.addCollaboration(playlistId, userId);

        return successResponse(h, {
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborationId: id,
            },
            statusCode: 201,
        });
    }

    async deleteCollaborationHandler(request) {
        this._validator.validateDeleteCollaborationSchema(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._collaborationsService.deleteCollaboration(playlistId, userId);

        return {
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        };
    }
}

module.exports = collaborationsHandler;
