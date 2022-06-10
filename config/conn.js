const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '103.160.192.13',
  database: 'Lyotrade_API_Sprint',
  password: '123456',
  port: 5432,
})
module.exports = Object.freeze({
    pool: pool,
   
});
