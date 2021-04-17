const express = require('express');
const router = express.Router();

const logics = require('../logics/sampleLogics'),
    utils = require('../logics/common/utils');

const logRequest = require('../middlewares/logRequest'),
    logResponse = require('../middlewares/logResponse');

router.get('/', [logRequest], async (req, res, next) => {
    const result = logics.getSample();
    res.value = utils.responseStatus(res, result);
    next();
});

router.put('/', [logRequest], async (req, res, next) => {
    //implement
});

router.post('/', [logRequest], async (req, res, next) => {
    //implement
});

router.all('*', [logResponse], (req, res) => {
    if (!res.value) {
        return res.status(500).send('Bad request');
    }

    return res.send(utils.stringify(res.value));
});

module.exports = {
    router,
};