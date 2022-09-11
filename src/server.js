require('dotenv').config()

const Hapi = require('@hapi/hapi')

// api
const songs = require('./api/songs')
const albums = require('./api/albums')

// service & validator
const SongsService = require('./service/postgres/SongsService')
const SongsValidator = require('./validator/songs')
const AlbumsValidator = require('./validator/albums')
const AlbumsService = require('./service/postgres/AlbumsService')

const startServer = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumsService(),
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongsService(),
        validator: SongsValidator,
      },
    },
  ])

  server.start()
  console.log(`Server telah berjalan pada ${server.info.uri}`)
}

startServer()
