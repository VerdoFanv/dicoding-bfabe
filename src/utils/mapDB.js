const mapDBToModel = ({
    // eslint-disable-next-line camelcase
    id, title, year, performer, genre, duration, inserted_at, updated_at,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
});

const mapGetSongs = ({ id, title, performer }) => ({
    id,
    title,
    performer,
});

const mapGetPlaylists = ({ id, name, username }) => ({
    id,
    name,
    username,
});

module.exports = { mapDBToModel, mapGetSongs, mapGetPlaylists };
