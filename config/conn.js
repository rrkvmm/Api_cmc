const Pool = require('pg').Pool
// const mongoose = require("mongoose");
const pool = new Pool({
  user: 'postgres',
  host: '103.160.192.14',
  database: 'OpenAPIServer',
  password: '123456',
  port: 5432,
})
// const mongodb =  mongoose.connect('mongodb://localhost:27017/cmc_api',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }
// );
module.exports = Object.freeze({
    pool: pool,
    // mongodb : mongodb

   
});
