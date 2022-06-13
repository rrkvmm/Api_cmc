const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '103.160.192.14',
  database: 'OpenAPIServer',
  password: '123456',
  port: 5432,
})
module.exports = Object.freeze({
    pool: pool,
   
});
