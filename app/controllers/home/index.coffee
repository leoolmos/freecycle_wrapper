module.exports = (app) ->

	app.controller 'HomeController', ($scope, $filter, dataFactory) ->

		#////////////////////////////////////////////////////////////
		# Initial
		#////////////////////////////////////////////////////////////

		self = this
		self.allProducts = []
		self.selectedAreas = []
		self.areas = []
		self.selectStartDate = ''
		self.selectEndDate = ''

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

		self.getDate = (ev, format) ->
			input = $(ev.currentTarget).find('input')
			date = $filter('date')(ev.date, format)
			return date


		self.init = () ->
			dataFactory.getAreas().success (areas) ->
				self.areas = areas

			startDate = $('.date.start').datepicker(
				enableOnReadonly: true
				format: 'dd/mm/yyyy'
				endDate: Date(Date.now())
				immediateUpdates: true
				autoclose: true
			).on 'changeDate', (ev) ->
				endDate.datepicker("setStartDate", self.getDate(ev, "dd/MM/yyyy"))
				self.selectStartDate = self.getDate(ev, "yyyy-MM-dd")

			endDate = $('.date.end').datepicker(
				enableOnReadonly: true
				format: 'dd/mm/yyyy'
				endDate: Date(Date.now())
				immediateUpdates: true
				autoclose: true
			).on 'changeDate', (ev) ->
				startDate.datepicker("setEndDate", self.getDate(ev, "dd/MM/yyyy"))
				self.selectEndDate = self.getDate(ev, "yyyy-MM-dd")

		# Get products
		self.getProducts = () ->
			dataFactory.getAreas().then( (areas) ->
				self.areas = areas
			, (err) ->
				alert err
				return
			)

		self.fetchAllProducts = () ->
			dataFactory.getProducts(self.selectedAreas, self.selectStartDate, self.selectEndDate).then( (products) ->
				self.allProducts = products.data
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
	