express = require 'express'
path = require 'path'
favicon = require 'serve-favicon'
logger = require 'morgan'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
methodOverride = require 'method-override'

app = express()

# view engine setup
app.set('views', path.join(__dirname, 'build/views'))
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("view options", { layout: false });

# uncomment after placing your favicon in /app
# app.use(favicon(__dirname + '/app/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb',extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'build')))
app.use(methodOverride())

# api setup
require('./api')(app)

# development error handler
# will print stacktrace
if (app.get('env') == 'development')
  app.use (err, req, res, next) ->
    res.status(err.status || 500)
    res.render('error.html', {
      message: err.message,
      error: err
    })

# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status(err.status || 500)
  res.render('error.html', {
    message: err.message,
    error: {}
  })

# angular routes handler
app.get '*', (req, res) ->
  res.render('layouts/layout.html')

module.exports = app
