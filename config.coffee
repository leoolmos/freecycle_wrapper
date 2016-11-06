assert = require 'assert'
fs = require 'fs'
prompt = require 'prompt'

module.exports = (callback) ->

	fs.exists '.env', (exists) ->
		if !exists
			schema = properties:
				baseurl: description: 'Set your base URL (http://localhost)'
				proxyCredentials:
					description: 'Set your base URL'

			prompt.start()

			prompt.get [
				schema
			], (err, result) ->
				fs.writeFile '.env', 'baseurl='+result.baseurl, (err) ->
					if err
						console.log err
						callback false

					callback true
		else
			callback true