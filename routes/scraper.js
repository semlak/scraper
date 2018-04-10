var express = require('express');
var router = express.Router();
// var UserController = require('../controllers/UserController.js');
// var axios = require("axios");
// const request = require("request");
// var cheerio = require("cheerio");
// var HeadlineModel = require('../models/HeadlineModel.js');

var HeadlineController = require('../controllers/HeadlineController.js');


router.get("/", HeadlineController.scrape);


module.exports = router;
