module.exports = (app) ->

	app.controller 'HomeController', ($scope, $filter, dataFactory) ->

		#////////////////////////////////////////////////////////////
		# Initial
		#////////////////////////////////////////////////////////////

		self = this
		self.allProducts = []
		self.hideAdvanced = true
		self.selectedAreas = []
		self.areas = []
		self.selectStartDate = ''
		self.selectEndDate = ''

		self.isLoadingVisible = false
		self.loadingMessage = ''

		self.isErrorVisible = false
		self.errorMessage = ''

		self.modalImage = ''

		self.areasTexts =
			buttonDefaultText: 'Select areas'

		self.areasSettings =
			enableSearch: true
			scrollableHeight: '300px'
			scrollable: true
			externalIdProp: ''
			selectionLimit: 2








		#////////////////////////////////////////////////////////////
		# Functions
		#////////////////////////////////////////////////////////////

		self.getDate = (ev, format) ->
			input = $(ev.currentTarget).find('input')
			date = $filter('date')(ev.date, format)
			return date

		self.showLoading = (message) ->
			self.isLoadingVisible = true
			self.loadingMessage = message

		self.hideLoading = () ->
			self.isLoadingVisible = false

		self.showError = (error) ->
			self.isErrorVisible = true
			self.errorMessage = error

		self.init = () ->
			dataFactory.getAreas().then (areas) ->
				self.areas = areas.data

			startDate = $('.date.start').datepicker(
				enableOnReadonly: true
				format: 'dd/mm/yyyy'
				endDate: Date(Date.now())
				immediateUpdates: true
				autoclose: true
				defaultDate: ''
			).on 'changeDate', (ev) ->
				endDate.datepicker("setStartDate", self.getDate(ev, "dd/MM/yyyy"))
				self.selectStartDate = self.getDate(ev, "yyyy-MM-dd")

			endDate = $('.date.end').datepicker(
				enableOnReadonly: true
				format: 'dd/mm/yyyy'
				endDate: Date(Date.now())
				immediateUpdates: true
				autoclose: true
				defaultDate: ''
			).on 'changeDate', (ev) ->
				startDate.datepicker("setEndDate", self.getDate(ev, "dd/MM/yyyy"))
				self.selectEndDate = self.getDate(ev, "yyyy-MM-dd")

			$('input.start-date').blur () ->
				if !$(this).val()
					self.selectStartDate = ''

			$('input.end-date').blur () ->
				if !$(this).val()
					self.selectEndDate = ''


		# Get products
		self.getProducts = () ->
			self.showLoading 'Fetching areas'
			dataFactory.getAreas().then( (areas) ->
				self.hideLoading()
				self.areas = areas
			, (err) ->
				self.showError err
				return
			)

		self.fetchAllProducts = () ->
			self.isErrorVisible = false
			self.showLoading 'Fetching products'
			dataFactory.getProducts(self.selectedAreas, self.selectStartDate, self.selectEndDate).then( (products) ->
				self.hideLoading()
				self.allProducts = products.data
			, (err) ->
				self.showError err
				return
			)

		#////////////////////////////////////////////////////////////
		# Start
		#////////////////////////////////////////////////////////////

		angular.element(document).ready( () ->
			self.init()
		)
	