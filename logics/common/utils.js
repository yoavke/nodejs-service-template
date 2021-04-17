const sql = require('mssql/msnodesqlv8');

const createResponse = (status, message) => ({ status, message });

/** Creates a request object to execute using the pool
 * @param pool:        SQL connection pool
 * @param inputList:   objects with "name", "value" keys
 * 
 * Return
 *          sql server request object
 */
const createRequest = (pool, ...inputList) => {
    const request = new sql.Request(pool);
    inputList.forEach(input => {
        request.input(input.name, input.value);
    });

    return request;
}

/** Reseting the res status code for client and setting the client's message
 * 
 * @param Object res           the res object you get from Express
 * @param Object resultObj     the result object created in logics
 */
const responseStatus = (res, resultObj) => {
    if (resultObj.status == 'failed') {
        res.status(400);
        return { status: 'failed', message: resultObj.message }
    } else {
        res.status(200);
        return resultObj.message || { result: 'success', data: 'empty' };
    }
}

/** Formatting the JSON response
 * 
 * @param {*} json  the json response to parse
 */
const stringify = (json) => {
    return JSON.stringify(json, null, 3);
}

module.exports = {
    createResponse,
    createRequest,
    responseStatus,
    stringify
};