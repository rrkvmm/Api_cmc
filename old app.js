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
app.use('/symbol', symbolRouter);
app.use('/mongo', mongoRoute);

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

var timer = ""
var fetch_status = ""
var store_status = ""
var api_serve    = ""
cron.schedule('10 * * * * *', async () => {

  if (job_flag == 0) {
    timer = Date.now()

    if (job_status == 0) {
      fetch_status = 1
      let data = await common_api.save_data_summary()
      job_flag = 0;
      job_status = 1;

    }

    else if (job_status == 1) {


      job_flag = 1;
      let trades = await common_api.save_data_trades()

      job_flag = 0;
      job_status = 2;

    }
    else if (job_status == 2) {
      job_flag = 1;
      let ticker = await common_api.save_data_ticker()

      job_flag = 0;
      job_status = 0;

    }
    else if (job_status == 3) {

    }
    else if (job_status == 4) {
    }
  }
});

const port = 5003;
app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});


module.exports = app;
