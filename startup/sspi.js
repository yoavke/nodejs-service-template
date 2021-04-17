
module.exports = (req, res, next) => {
    let nodeSSPI = require('node-sspi')
    let nodeSSPIObj = new nodeSSPI({
        retrieveGroups: true
    })
    nodeSSPIObj.authenticate(req, res, function (err) {
        req.user = req.connection.user;
        res.finished || next();
    })
}

