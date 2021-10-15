const autoBind = require('auto-bind');
const successResponse = require('../../utils/response');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postSongHandler({ payload }, h) {
        this._validator.validateSongPayload(payload);
        const {
            title = 'untitled', year, performer, genre, duration,
        } = payload;

        const id = await this._service.addSongs({
            title, year, performer, genre, duration,
        });

        return successResponse(h, {
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId: id,
            },
            statusCode: 201,
        });
    }

    async getSongsHandler(request, h) {
        const getSongs = await this._service.getSongs();

        return successResponse(h, {
            data: {
                songs: getSongs,
            },
        });
    }

    async getSongByIdHandler({ params }, h) {
        const { songId } = params;
        const getSong = await this._service.getSongById(songId);

        return successResponse(h, {
            data: {
                song: getSong,
            },
        });
    }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const {
            title, year, performer, genre, duration,
        } = request.payload;
        const { songId } = request.params;

        await this._service.editSongById(songId, {
            title, year, performer, genre, duration,
        });

        return successResponse(h, {
            message: 'lagu berhasil diperbarui',
        });
    }

    async deleteSongByIdHandler({ params }, h) {
        const { songId } = params;
        await this._service.deleteSongById(songId);

        return successResponse(h, {
            message: 'lagu berhasil dihapus',
        });
    }
}

module.exports = SongsHandler;
