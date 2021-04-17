function jsonResponse(req, res, next) {
    res.header("Content-Type", 'application/json');
    next();
};

module.exports = jsonResponse;