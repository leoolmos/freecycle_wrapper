module.exports = (app) ->

	methods = {

		#------------------------------------------------------#
		# Normalize a port into a number, string, or false.
		#------------------------------------------------------#

		normalizePort: (val) ->
			port = parseInt(val, 10)

			if isNaN(port)
				# named pipe
				return val

			if port >= 0
				# port number
				return port

			return false

		#------------------------------------------------------#
		# Event listener for HTTP server "error" event.
		#------------------------------------------------------#

		onError: (error) ->
			if error.syscall != 'listen'
				throw error

			bind = if typeof port == 'string'
					'Pipe ' + port
				else
					'Port ' + port

			# handle specific listen errors with friendly messages
			switch error.code
				when 'EACCES'
					console.error bind + ' requires elevated privileges'
					process.exit 1
				when 'EADDRINUSE'
					console.error bind + ' is already in use'
					process.exit 1
				else
					throw error

	}

	return methods