const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const submittedRouter = require('./routes/submitted');
const lowScoreApprovalRouter = require('./routes/low-score-approval');
const lowScoreApprovedRouter = require('./routes/low-score-approved');
const crmRouter = require('./routes/crm');
const checkRouter = require('./routes/check');
const provisionedRouter = require('./routes/provisioned');
const upsellRouter = require('./routes/upsell');
const notifyRouter = require('./routes/notify');
const manualApprovalRouter = require('./routes/manual-approval');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
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
