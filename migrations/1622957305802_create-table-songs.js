exports.up = (pgm) => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(60)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(300)',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
        performer: {
            type: 'TEXT',
            notNull: true,
        },
        genre: {
            type: 'TEXT',
        },
        duration: {
            type: 'INT',
        },
        inserted_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('songs');
};
