module.exports = (app) ->

	app.factory 'dataFactory', [
		'$http', '$q', '$location'
		($http, $q, $location) ->
			apiUrl = '/api'
			dataFactory = {}

			dataFactory.getAreas = () ->
				# $http.get apiUrl + '/areas'
				
				$http.get('./mocks/areas.json')



			dataFactory.getProducts = (area, start_date, end_date) ->
				deferred = $q.defer()

				req =
					method: 'POST'
					url: apiUrl + '/products'
					data:
						area: area
						date_start: start_date
						date_end: end_date

				$http(req).then ( (products) ->
					deferred.resolve products
				), (err) ->
					deferred.reject err.data

				deferred.promise


			dataFactory
		]
