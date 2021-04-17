const logger = require('../startup/logging');

function request(req, res, next) {
    logger.info(`Request ${req.method.toUpperCase()} ${req.originalUrl} - User: ${req.user} Params: ${JSON.stringify(req.params)} Querystring: ${JSON.stringify(req.query)} Payload: ${JSON.stringify(req.body)}`)
    next();
}

module.exports = {
    request,
};