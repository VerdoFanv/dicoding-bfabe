const successResponse = (server, { message, data, statusCode = 200 }) => {
    const result = {
        status: 'success',
    };

    if (message) {
        result.message = message;
    }

    if (data) {
        result.data = data;
    }

    return server.response(result).code(statusCode);
};

module.exports = successResponse;
