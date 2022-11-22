import mysql from "promise-mysql";

export var pool = null;

const createSqlPool = async(config) => {
    // Establish a connection to the database
    return mysql.createPool({
        connectionLimit: 5,
        // 'connectTimeout' is the maximum number of milliseconds before a timeout
        // occurs during the initial connection to the database.
        connectTimeout: 5000, // 10 seconds
        // 'acquireTimeout' is the maximum number of milliseconds to wait when
        // checking out a connection from the pool before a timeout error occurs.
        acquireTimeout: 5000, // 10 seconds
        // 'waitForConnections' determines the pool's action when no connections are
        // free. If true, the request will queued and a connection will be presented
        // when ready. If false, the pool will call back with an error.
        waitForConnections: true, // Default: true
        // 'queueLimit' is the maximum number of requests for connections the pool
        // will queue at once before returning an error. If 0, there is no limit.
        queueLimit: 2, // Default: 0
        user: process.env.DB_USER, // e.g. 'my-db-user'
        password: process.env.DB_PASS, // e.g. 'my-db-password'
        database: process.env.DB_NAME, // e.g. 'my-database'
        host: process.env.DB_HOST,
        // Specify additional properties here.
        ...config,
    });
};

export const instanciateDB = async() => {
    return await createSqlPool().then((connectionPool) => {
        pool = connectionPool;
        return connectionPool;
    });
}