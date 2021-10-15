const UploadImagesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'Uploads File',
    version: '1.0.0',
    register: (server, { service, validator }) => {
        const uploadImagesHandler = new UploadImagesHandler(service, validator);

        server.route(routes(uploadImagesHandler));
    },
};
