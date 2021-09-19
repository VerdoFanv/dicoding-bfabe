const ClientError = require('../../error/ClientError');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {
                title = 'untitled', year, performer, genre, duration,
            } = request.payload;

            const id = await this._service.addSongs({
                title, year, performer, genre, duration,
            });

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId: id,
                },
            });

            response.code(201);
            return response;
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    async getSongsHandler(h) {
        try {
            const getSongs = await this._service.getSongs();

            return {
                status: 'success',
                data: {
                    songs: getSongs,
                },
            };
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    async getSongByIdHandler(request, h) {
        try {
            const { songId } = request.params;
            const getSong = await this._service.getSongById(songId);

            return {
                status: 'success',
                data: {
                    song: getSong,
                },
            };
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {
                title, year, performer, genre, duration,
            } = request.payload;
            const { songId } = request.params;

            await this._service.editSongById(songId, {
                title, year, performer, genre, duration,
            });

            return {
                status: 'success',
                message: 'lagu berhasil diperbarui',
            };
        } catch (error) {
            return this._failedResponse(error, h);
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const { songId } = request.params;
            await this._service.deleteSongById(songId);

            return {
                status: 'success',
                message: 'lagu berhasil dihapus',
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

        const response = server.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server.',
        });

        response.code(500);
        return response;
    }
}

module.exports = SongsHandler;
