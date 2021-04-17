const logger = require('../startup/logging');

function logResponse(req, res, next) {
    logger.info(`Finished processing request ${req.method.toUpperCase()} ${req.originalUrl} response to client: ${res.value ? JSON.stringify(res.value) : null}`);
    next();
}

module.exports = {
    logResponse,
};