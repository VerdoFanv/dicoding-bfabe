const routes = (handler) => [
    {
        method: 'DELETE',
        path: '/truncate',
        handler: handler.deleteAllTableHandler,
    },
];

module.exports = routes;
