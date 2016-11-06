require('./config')( (config) ->
  if !config
    console.log ".env file required"
    return

  start()
)

start = () ->

  #------------------------------------------------------#
  # Load ENV vars
  #------------------------------------------------------#

  env = require 'node-env-file'
  env '.env'

  #------------------------------------------------------#
  # Module dependencies.
  #------------------------------------------------------#

  app = require './app'
  http = require 'http'
  helpers = require('./helpers/server')(app)

  #------------------------------------------------------#
  # Get port from environment and store in Express.
  #------------------------------------------------------#

  port = helpers.normalizePort(process.env.PORT or '3000' )
  app.set('port', port)

  #------------------------------------------------------#
  # Create HTTP server.
  #------------------------------------------------------#

  server = http.createServer(app)

  #------------------------------------------------------#
  # Listen on provided port, on all network interfaces.
  #------------------------------------------------------#

  server.listen(port)
  console.log('APP started on ' + process.env.baseurl + ":" + port)
  server.on('error', helpers.onError)