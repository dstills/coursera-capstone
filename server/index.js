var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var routes = require('./routes/index');
var layerRouter = require('./routes/layerRouter');
var config = require('./config');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected correctly to server');
});

var app = express();

app.all('*', function(req, res, next) {
  if (req.secure) {
    return next();
  }
  res.redirect('https://' + req.hostname + ':' + app.get('secPort') + req.url);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteded: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', routes);
app.use('/layers', layerRouter);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;