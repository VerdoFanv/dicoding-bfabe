require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// songs
const songs = require('./api/songs');
const SongsService = require('./service/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./service/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./service/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// colaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./service/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const initServer = async () => {
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsService(collaborationsService);

    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator,
            },
        },
    ]);

    server.start();
    console.log(`Server telah berjalan pada ${server.info.uri}`);
};

initServer();
