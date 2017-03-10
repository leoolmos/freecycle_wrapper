module.exports = (app) ->
	request = require 'request'
	cheerio = require 'cheerio'
	fs = require 'fs'
	path = require 'path'
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
		allAreas = []

		getAreaId = new RegExp('.*\.org\/(.*)')

		getCountries = (callbackGetCountries) ->
			request 'https://www.freecycle.org/browse?noautodetect=1', (error, response, body) ->
				$ = cheerio.load(body)

				for country in $('#active_country_list > section > ul > li > a')
					allAreas.push {
						link: $(country).attr('href')
						text: $(country).html()
					}

				console.log "Countries done"
				console.log ""

				callbackGetCountries()

		getGroups = (callbackGetGroups) ->
			async.eachSeries allAreas, ( (country, callbackCountry) ->
				console.log "Getting groups from: ", country.text
				request country.link, (error, response, body) ->
					$ = cheerio.load(body)
					country.groups = []

					for group in $('#content article ul li a')
						country.groups.push {
							id: $(group).attr('href').substr($(group).attr('href').lastIndexOf('/') + 1);
							link: $(group).attr('href')
							text: $(group).html()
						}

					callbackCountry()
			), (done) ->
				console.log "Groups done"
				console.log ""
				callbackGetGroups()

		getAreas = (callbackGetAreas) ->

			console.log 'Getting Areas'

			async.eachSeries allAreas, ( (country, callbackCountry) ->
				async.eachSeries country.groups, ( (group, callbackGroup) ->
					console.log "Getting areas from: ", group.text

					request group.link, (error, response, body) ->
						# console.log 'Group ' + group.text
						$ = cheerio.load(body)

						group.areas = []
						async.eachSeries $('#active_groups ul li a'), ((area, callbackArea) ->
							# console.log $(area).html() + ' (' + group.text + ')'
							group.areas.push {
								id: getAreaId.exec($(area).attr('href'))[1]
								label: $(area).html()
							}
							callbackArea()
						), (done) ->
							callbackGroup()
				), (done) ->
					callbackCountry()
			), (done) ->
				callbackGetAreas()
				return

		getCountries () ->
			getGroups () ->
				getAreas () ->
					newJson = []

					newObj = allAreas.filter (country) ->
						country.groups.filter (group) ->
							if !group.areas
								return newJson.push
									'id': group.id,
									'label': group.text,
									'groupBy': country.text

							group.areas.filter (area) ->
								return newJson.push
									'id': area.id,
									'label': area.label,
									'groupBy': country.text + '/' + group.text

					jsonAllStr = JSON.stringify(allAreas)
					jsonStr = JSON.stringify(newJson)

					fs.writeFile path.join(__dirname + "/../app/mocks/original.json"), jsonAllStr, (err) ->
						if (err)
							throw err

					fs.writeFile path.join(__dirname + "/../app/mocks/areas.json"), jsonStr, (err) ->
						if (err)
							throw err
						console.log 'Areas Done'


	app.post '/api/products', (req, res) ->

		if req.body.area.length < 1 then return res.send 400, 'Area required'

		date_start = req.body.date_start
		date_end = req.body.date_end

		if !date_start
			date_start = moment().subtract(30, 'days').format('YYYY-MM-DD')
		if !date_end
			date_end = moment().format('YYYY-MM-DD')

		console.log date_start
		console.log date_end

		allProducts = []

		areas = req.body.area
		resultsperpage = 50

		patternId = new RegExp('/posts/(.*)/')
		patternDate = new RegExp('<span>.*<\/span> (.*)')

		pages = ''
		currentPage = 1

		getUrl = (area) ->
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
				dateHtml = $('#group_post #post_details div:last-child').html()
				dateStr = patternDate.exec(dateHtml)[1]
				date = moment(dateStr, 'ddd MMM D HH:mm:ss YYYY').format('DD/MM/YYYY HH:mm')
				description = $($('#group_post > div')[1]).children('p').html()
				id = patternId.exec(url)[1]
				image = ''

				if $($('#group_post > div')[1]).children('.floatLeft.textCenter').children('a').length
					image = $($('#group_post > div')[1]).children('.floatLeft.textCenter').children('a').attr('href')

				details = {
					id: id
					date: date
					description: description
					image: image
				}

				callbackGetDetails details

		fetchProducts = (body, callbackFetchProducts) ->
			$ = cheerio.load(body)
			async.eachSeries $('tr'), ((el, callbackLines) ->
				area = $('#content h2 a').html()
				link = $(el).children('td:nth-child(2)').children('a').attr('href')
				name = $(el).children('td:nth-child(2)').children('a').html()
				getDetails link, (details) ->
					allProducts.push
						area: area
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

		init = () ->
			async.eachSeries areas, ((area, callbackAreas) ->
				currentPage = 1
				console.log "Fetching " + area.label
				request getUrl(area.id), (error, response, body) ->
					$ = cheerio.load(body)
					pages = $('a[href^=\'?page\']').not(':has("span")')
					pagesTotal = parseInt(pages.length + 1)
					page = 0

					async.eachSeries Array(pagesTotal), ((page, callbackPages) ->
						console.log "============="
						console.log "new page"
						console.log getUrl(area.id)
						request getUrl(area.id), (error, response, body) ->
							currentPage++
							fetchProducts body, () ->
								callbackPages()
					), () ->
						callbackAreas()
						return
			), () ->
				console.log("Finish all areas")
				res.jsonp allProducts

		init();

