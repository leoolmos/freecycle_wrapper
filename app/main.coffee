app = require 'app'

require("routes")(app)
require("services/data")(app)
require("controllers/home/index")(app)
