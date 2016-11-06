module.exports = (app) ->

	app.config [
		'$routeProvider','$locationProvider'
		($routeProvider, $locationProvider) ->

			# HTML5 History API
			$locationProvider.html5Mode(true);

			$routeProvider
				.when('/',
					templateUrl: 'views/home/index.html'
				)

	]