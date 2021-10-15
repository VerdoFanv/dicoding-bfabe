const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../error/InvariantError');

class CollaborationsService {
    constructor(cacheControl) {
        this._pool = new Pool();
        this._cacheControl = cacheControl;
    }

    async addCollaboration(playlistId, userId) {
        const id = `collab-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Gagal menambahkan kolaborasi');
        }

        await this._cacheControl.del(`songs:${playlistId}`);
        await this._cacheControl.del(`playlists:${userId}`);

        return result.rows[0].id;
    }

    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Gagal menghapus kolaborasi');
        }

        await this._cacheControl.del(`songs:${playlistId}`);
        await this._cacheControl.del(`playlists:${userId}`);
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Gagal memverifikasi kolaborasi');
        }
    }
}

module.exports = CollaborationsService;
