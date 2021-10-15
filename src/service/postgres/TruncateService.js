const { Pool } = require('pg');

const TruncateService = {
    async deleteAllTable() {
        const pool = new Pool();
        const query = 'TRUNCATE songs, users, authentications, playlists, playlistsongs CASCADE';

        await pool.query(query);
    },
};

module.exports = TruncateService;
