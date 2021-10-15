const TruncateHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'Truncate All Table',
    version: '1.0.0',
    register: (server, { service, validator }) => {
        const truncateHandler = new TruncateHandler(service, validator);
        server.route(routes(truncateHandler));
    },
};
