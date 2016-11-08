module.exports = (grunt) ->

	grunt.initConfig
		pkg: grunt.file.readJSON("package.json")

		## Browserify ------------------------------------------------------------

		browserify:
			compile:
				options:
					browserifyOptions:
						extensions: '.coffee'
						debug: true
						paths: ['app/']
					transform: ['coffeeify']

				files:
					"build/js/compiled.js": "app/main.coffee"

		## Bower ----------------------------------------------------------------

		bower_concat:
			all:
				dest:
					'js': 'build/js/libs.js'
					'css': 'build/css/libs.css'
				mainFiles: bootstrap: [
					'dist/css/bootstrap.css'
					'dist/js/bootstrap.js'
				]
				include: [
					'angular'
					'angular-route'
					'jquery'
					'bootstrap'
					'angular-sanitize'
					'angular-click-outside'
					'lodash'
					'bootstrap-datepicker'
					'underscore'
					'angularjs-dropdown-multiselect'
				]
				dependencies:
					'angular-route': 'angular'
					'bootstrap': 'jquery'
					'angular-sanitize': 'angular'
					'angular-click-outside': 'angular'
					'lodash': 'angular'
					'bootstrap-datepicker': 'bootstrap'
					'underscore': 'jquery'
					'angularjs-dropdown-multiselect': 'underscore'
				bowerOptions: relative: false


		## Copy -----------------------------------------------------------------

		copy:
			images:
				expand: true
				cwd: 'app/src/images/'
				src: ['**/*.{png,jpg,svg,gif}']
				dest: 'build/images'
			views:
				expand: true
				cwd: 'app/views/'
				src: ['**/*.html']
				dest: 'build/views'
			mocks:
				expand: true
				cwd: 'app/mocks/'
				src: ['**']
				dest: 'build/mocks'
			components:
				expand: true
				cwd: 'app/components/'
				src: ['**/*.html']
				dest: 'build/components'
			bootstrap_map:
				expand: true
				cwd: 'bower_components/bootstrap/dist/css/'
				src: ['bootstrap.css.map']
				dest: 'build/css'
			bootstrap_fonts:
				expand: true
				cwd: 'bower_components/bootstrap/dist/fonts/'
				src: ['**']
				dest: 'build/fonts/'
			datepicker_map:
				expand: true
				cwd: 'bower_components/bootstrap-datepicker/dist/css/'
				src: ['bootstrap-datepicker3.css.map']
				dest: 'build/css'



		## Concat ---------------------------------------------------------------

		concat:
			css:
				separator: ''
				src: ['build/css/src/**/*.css']
				dest: 'build/css/compiled.css'



		## Less ---------------------------------------------------------------

		less:
			development:
				files: [
					expand: true,
					compress: true,
					cwd: 'app/',
					src: ['**/*.less'],
					dest: 'build/css/src',
					ext: '.css'
				]

		## Clean ---------------------------------------------------------------

		clean:
			build:
				src: ['build']
			compile_css:
				src: ['build/css/compile.css']
			compile_js:
				src: ['build/js/compile.js']
			libs:
				src: ['build/js/libs.js']
			mocks:
				src: ['build/mocks']
			css_src:
				src: ['build/css/src']
			images:
				src: ['build/images']
			views:
				src: ['build/views']
			components:
				src: ['build/components']

		## Watch ---------------------------------------------------------------

		watch:
			options:
				spawn: false
				livereload: true

			coffee:
				files: ['app/**/*.coffee']
				tasks: ['clean:compile_js','browserify:compile']

			bower:
				files: ['bower_components/*']
				tasks: ['bower_concat']

			less:
				files: ['app/**/*.less']
				tasks: ['clean:compile_css','less','concat:css','clean:css_src']

			mocks:
				files: ['app/mocks/**']
				tasks: ['clean:mocks','copy:mocks']

			images:
				files: ['app/src/images/**/*']
				tasks: ['clean:images','copy:images']

			views:
				files: ['app/views/**/*']
				tasks: ['clean:views','copy:views']

			components:
				files: ['app/components/**/*.html']
				tasks: ['clean:components','copy:components']

	## Load Tasks --------------------------------------------------------------

	## measures the time each task takes
	require('time-grunt')(grunt);

	## load grunt tasks
	require('load-grunt-tasks')(grunt);

	## Register Tasks ----------------------------------------------------------

	grunt.registerTask "default", ['clean:build','browserify:compile','bower_concat','less','concat:css','copy:images','copy:bootstrap_map','copy:mocks', 'copy:datepicker_map','copy:bootstrap_fonts','copy:views','copy:components']