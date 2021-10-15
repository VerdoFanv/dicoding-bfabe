const autoBind = require('auto-bind');
const successResponse = require('../../utils/response');

class ExportSongsHandler {
    constructor({ exportsService, playlistsService, validator }) {
        this._exportsService = exportsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        autoBind(this);
    }

    async postExportSongsHandler(request, h) {
        this._validator.validateExportSongsPayload(request.payload);

        const { playlistId: id } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(id, userId);

        const message = {
            playlistId: id,
            targetEmail: request.payload.targetEmail,
        };

        await this._exportsService.sendMessage('export:playlists', JSON.stringify(message));

        return successResponse(h, {
            status: 'success',
            message: 'Permintaan Anda sedang kami proses',
            statusCode: 201,
        });
    }
}

module.exports = ExportSongsHandler;
