const routes = require('./routes')
const AlbumsHandler = require('./handler')

module.exports = {
  name: 'albums',
  version: '1.0',
  register: (server, { 
    albumsService, 
    songsService,
    validator 
  }) => {
    const albumsHandler = new AlbumsHandler({
      albumsService, 
      songsService,
      validator,
    })

    server.route(routes(albumsHandler))
  },
}