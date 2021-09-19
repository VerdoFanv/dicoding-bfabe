require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const SongsService = require('./service/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const initServer = async () => {
    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register({
        plugin: songs,
        options: {
            service: new SongsService(),
            validator: SongsValidator,
        },
    });

    server.start();
    console.log(`Server telah berjalan pada ${server.info.uri}`);
};

initServer();
