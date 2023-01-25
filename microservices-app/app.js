var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var submittedRouter = require('./routes/submitted');
var lowScoreApprovalRouter = require('./routes/low-score-approval');
var lowScoreApprovedRouter = require('./routes/low-score-approved');
var crmRouter = require('./routes/crm');
var checkRouter = require('./routes/check');
var provisionedRouter = require('./routes/provisioned');
var upsellRouter = require('./routes/upsell');
var notifyRouter = require('./routes/notify');
var manualApprovalRouter = require('./routes/manual-approval');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/submitted', submittedRouter);
app.use('/low-score-approval', lowScoreApprovalRouter);
app.use('/low-score-approved', lowScoreApprovedRouter);
app.use('/crm', crmRouter);
app.use('/check', checkRouter);
app.use('/provisioned', provisionedRouter);
app.use('/upsell', upsellRouter);
app.use('/notify', notifyRouter);
app.use('/manual-approval', manualApprovalRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
