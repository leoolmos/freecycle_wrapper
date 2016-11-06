module.exports = (app) ->
	request = require 'request'
	cheerio = require 'cheerio'
	async = require 'async'
	moment = require 'moment'

	sortResults = (obj, prop, asc, callbackSortResults) ->
		obj = obj.sort((a, b) ->
			if asc
				if a[prop] > b[prop] then 1 else if a[prop] < b[prop] then -1 else 0
			else
				if b[prop] > a[prop] then 1 else if b[prop] < a[prop] then -1 else 0
		)
		callbackSortResults(obj)
		return

	app.get '/api/areas', (req, res) ->
		allGroups = []
		allAreas = []

		getAreaId = new RegExp('.*\.org\/(.*)')

		getGroups = (callbackGetGroups) ->
			request 'https://www.freecycle.org/browse/UK', (error, response, body) ->
				$ = cheerio.load(body)

				for group in $('#active_regions ul li a')
					allGroups.push {
						link: $(group).attr('href')
						text: $(group).html()
					}

				callbackGetGroups()

		getAreas = (callbackGetAreas) ->

			async.eachSeries allGroups, ( (group, callbackGroup) ->

				request group.link, (error, response, body) ->
					# console.log 'Group ' + group.text
					$ = cheerio.load(body)

					async.eachSeries $('#active_groups ul li a'), ((area, callbackArea) ->
						# console.log $(area).html() + ' (' + group.text + ')'
						allAreas.push {
							id: getAreaId.exec($(area).attr('href'))[1]
							label: $(area).html() + ' (' + group.text + ')'
						}
						callbackArea()
					)

					callbackGroup()
			), (done) ->
				callbackGetAreas()
				return



		getGroups( () ->
			getAreas( () ->
				sortResults allAreas, 'label', true, (allAreas) ->
					console.log allAreas
					res.jsonp allAreas
			)
		)

	app.post '/api/products', (req, res) ->

		if !req.body.area then return res.send 400, 'Area required'

		if !req.body.date_start then return res.send 400, 'Start date required'
		date_start = moment(req.body.start_date).format()

		if !req.body.date_end then return res.send 400, 'End date required'
		date_end = moment(req.body.date_end).format()

		allProducts = []

		area = ''
		date_start = ''
		date_end = ''
		resultsperpage = 50

		patternId = new RegExp('/posts/(.*)/')
		patternDate = new RegExp('<span>.*<\/span> (.*)')

		pages = ''
		currentPage = 1
		area = req.body.area

		getUrl = ->
			'https://groups.freecycle.org/group/' + area + '/posts/search?page=' + currentPage + '&resultsperpage=' + resultsperpage + '&showall=off&include_offers=on&include_wanteds=off&include_receiveds=off&include_takens=off&date_start=' + date_start + '&date_end=' + date_end

		checkImage = (url, callbackCheckImage) ->
			request url, (err, resp) ->
				if resp.statusCode == 200
					callbackCheckImage url
					return
				callbackCheckImage ''
				return
			return

		getDetails = (url, callbackGetDetails) ->
			request url, (error, response, body) ->
				$ = cheerio.load(body)
				dateHtml = $('#group_post #post_details div:nth-child(2)').html()
				description = $($('#group_post > div')[1]).children('p').html()
				id = patternId.exec(url)[1]
				image = ''

				if $($('#group_post > div')[1]).children('.floatLeft.textCenter').children('a').length
					image = 'https://groups.freecycle.org/group/BromleyUK/post_image/' + id

				details = {
					id: id
					date: patternDate.exec(dateHtml)[1]
					description: description
					image: image
				}

				callbackGetDetails details
				

		fetchProducts = (body, callbackFetchProducts) ->
			$ = cheerio.load(body)
			async.eachSeries $('tr'), ((el, callbackLines) ->
				link = $(el).children('td:nth-child(2)').children('a').attr('href')
				name = $(el).children('td:nth-child(2)').children('a').html()
				getDetails link, (details) ->
					allProducts.push
						link: link
						date: details.date
						name: name
						description: details.description
						id: details.id
						image: details.image
					callbackLines()
					return
				return
			), ->
				callbackFetchProducts()
				return
			return

		fetchUrl = (url, callbackFetchUrl) ->
			request url, (error, response, body) ->
				$ = cheerio.load(body)
				if currentPage == 1
					pages = $('a[href^=\'?page\']').not(':has("span")')
				currentPage++
				fetchProducts body, ->
					callbackFetchUrl()
					return
				return
			return

		checkPages = () ->
			if pages
				console.log currentPage
				console.log pages.length + 1
				if currentPage <= pages.length + 1
					fetchUrl getUrl(currentPage), checkPages
				else
					res.jsonp allProducts
			return

		fetchUrl getUrl(currentPage), checkPages

