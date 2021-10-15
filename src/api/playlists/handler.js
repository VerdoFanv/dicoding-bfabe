const autoBind = require('auto-bind');
const successResponse = require('../../utils/response');

class playlistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePostPlaylistSchema(request.payload);
        const { name } = request.payload;

        const { id: credentialId } = request.auth.credentials;
        const id = await this._service.addPlaylist(name, credentialId);

        return successResponse(h, {
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId: id,
            },
            statusCode: 201,
        });
    }

    async getPlaylistsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const result = await this._service.getPlaylists(credentialId);

        return successResponse(h, {
            data: {
                playlists: result,
            },
        });
    }

    async deletePlaylistHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(playlistId, credentialId);
        await this._service.deletePlaylistById(playlistId, credentialId);

        return successResponse(h, {
            message: 'Playlist berhasil dihapus',
        });
    }

    async postSongToPlaylistHandler(request, h) {
        this._validator.validatePostSongToPlaylistSchema(request.payload);

        const { songId } = request.payload;
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.addSongToPlaylist(songId, playlistId);

        return successResponse(h, {
            message: 'Lagu berhasil ditambahkan ke playlist',
            statusCode: 201,
        });
    }

    async getSongsFromPlaylistHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        const result = await this._service.getSongsInPlaylist(playlistId);

        return successResponse(h, {
            data: {
                songs: result,
            },
        });
    }

    async deleteSongFromPlaylistHandler(request, h) {
        this._validator.validateDeleteSongFromPlaylistSchema(request.payload);

        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.deleteSongFromPlaylistById(playlistId);

        return successResponse(h, {
            message: 'Lagu berhasil dihapus dari playlist',
        });
    }
}

module.exports = playlistsHandler;
