var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var symbolRouter = require('./routes/symbolRoutes');
var mongoRoute = require('./routes/mongoRoute');
require('dotenv').config()
var common_api = require('./common/common_api');
var constant = require('./common/constant');
const winston = require('winston');
const expressWinston = require('express-winston');
var cron = require('node-cron');
const fs = require('fs');
var app = express();
var job_status = 0
var job_flag = 0
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/symbol', symbolRouter);
app.use('/symbol', mongoRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/api/test', (req, res) => {
  res.json({ 'message': 'Hello winston!' });
});

var job_status = 0
var job_flag = 0
cron.schedule('60 * * * * *', async () => {
 
    timer = Date.now()
    console.log("==================job_status==============",job_status)
    if (job_status == 0) {
    
      let data = await common_api.save_summary_in_mongo_with_json()
      job_status = 1;
      console.log("==================save_data_summary==============")
      console.log("==================save_data_summary==============",data)
      console.log("==================job_status==============",job_status)
    }

    else if (job_status == 1) {
      console.log("==================job_status==============",job_status)
      let trades = await common_api.save_Trades_in_mongo_with_json()
      console.log("==================save_data_ticker==============",trades)
      job_status = 2;
      console.log("==================job_status==============",job_status)
    }
    else if (job_status == 2) {
      console.log("==================job_status==============",job_status)
     
      constant.fetch_traders_data =  constant.traders_Data
      constant.fetch_tickers_Data =  constant.tickers_Data
      constant.fetch_Summary_Data =  constant.Summary_Data
      console.log("==================save_data_ticker==============")
      
   
      job_status = 0;
      console.log("==================job_status==============",job_status)
    }
    else if (job_status == 3) {

    }
    else if (job_status == 4) {

  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});


module.exports = app;
