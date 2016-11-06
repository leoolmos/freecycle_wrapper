module.exports = (app) ->

	app.controller 'HomeController', ($scope, $filter, dataFactory) ->

		#////////////////////////////////////////////////////////////
		# Initial
		#////////////////////////////////////////////////////////////

		self = this
		self.allProducts = []
		self.selectedAreas = []
		self.areas = []

		self.areasTexts =
			buttonDefaultText: 'Select areas'

		self.areasSettings =
			enableSearch: true
			scrollableHeight: '300px'
			scrollable: true
			externalIdProp: ''








		#////////////////////////////////////////////////////////////
		# Data Functions
		#////////////////////////////////////////////////////////////

		self.init = () ->
			dataFactory.getAreas().success (areas) ->
				self.areas = areas

			$('.date').datepicker(
				enableOnReadonly: true
				format: 'dd/mm/yyyy'
				endDate: Date(Date.now())
				immediateUpdates: true
				autoclose: true
			).on 'changeDate', (ev) ->
				input = $(ev.currentTarget).find('input')
				date = $filter('date')(ev.date, "yyyy-MM-dd")

				if input.hasClass('start-date')
					self.selectStartDate = date
				if input.hasClass('end-date')
					self.selectEndDate = date


		# Get products
		self.getProducts = () ->
			dataFactory.getAreas().then( (areas) ->
				self.areas = areas
			, (err) ->
				alert err
				return
			)

		# Get products
		self.getProducts = () ->
			dataFactory.getProducts(area, startDate, endDate).then( (products) ->
				self.allProducts = products
			, (err) ->
				alert err
				return
			)


		#////////////////////////////////////////////////////////////
		# Start
		#////////////////////////////////////////////////////////////

		angular.element(document).ready( () ->
			self.init()
		)
	