const mssql = require("mssql/msnodesqlv8");
const logger = require('./logging');
const config = require('config');

const createCredentials = (host, db) => {
    const credentials = {
        server: host,
        database: db,
        requestTimeout: 45000,
        port: 1443,
        options: {
            trustedConnection: true,
            enableArithAbort: true
        }
    };

    return credentials;
}

const createConnection = (host, db) => {
    const pool = new mssql.ConnectionPool(createCredentials(host, db));
    pool.connect().then(pool => {
        logger.info(`Connected to MSSQL (Host: ${host} DB: ${db})`)
    }).catch(err => { logger.info(`Database ${host}-${db} Connection Failed! Bad Config:  + ${err.message}`, err); return null });
    return pool;
}


/** ------------------------------------------------ */

const dbServer = config.get('dbServer');

const pool = createConnection(dbServer, config.get('dbName'));

/** ------------------------------------------------ */

module.exports = {
    pool
};

//'Driver={SQL Server Native Client 11.0};Server=my-server-host,1443;Database=dbName;Trusted_Connection=yes;'