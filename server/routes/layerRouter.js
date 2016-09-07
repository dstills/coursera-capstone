var express = require('express');
var bodyParser = require('body-parser');

var layerRouter = express.Router();
layerRouter.use(bodyParser.json());
layerRouter.route('/')
  .get(function(req, res, next) {
    
  })
;
module.exports = layerRouter;