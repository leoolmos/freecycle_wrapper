fs = require 'fs'

module.exports = (app) ->

  fs.readdirSync(__dirname).forEach (file) ->
    # Don't include this file in an infinate loop!
    if (file.indexOf('index')!=-1)
      return
    # Don't include anything without a file extension
    if (file.indexOf('.')==-1)
      return
    # Don't files starting with a dot
    if (file.indexOf('.')==0)
      return
    name = file.substr(0, file.indexOf('.'))
    console.log "Add api: " + name
    require('./' + name)(app);