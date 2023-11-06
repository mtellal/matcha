const mariadb = require('mariadb');

const pool = mariadb.createPool({
    database: 'matcha',
    host: 'mariadb',
    port: process.env.MARIADB_PORT,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_ROOT_PASSWORD,
    multipleStatements: true,
    acquireTimeout: 20000,
    connectionLimit: 20
})

export default pool;