var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');
// var axios = require("axios");
const request = require("request");
var cheerio = require("cheerio");
var HeadlineModel = require('../models/HeadlineModel.js');

var HeadlineController = require('../controllers/HeadlineController.js');


// router.get('/', UserController.list);

router.get("/", (req, res) => {
  let publicationUrls = [
    "http://www.echojs.com/",
    "https://www.washingtonpost.com",
    "http://www.wedgelive.com/"
  ]

  publicationUrls.forEach(mainUrl => {

  // mainUrl = ;
  // axios.get(mainUrl).then(function(response) {
  request(mainUrl, (err, response, html) => {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      let results = [];
    if (mainUrl.match(/echojs/i)) {

      results = $("article h2").map(function(i, element) {
        // console.log("i", i, "element", element)
        return {
          title: $(this).children("a").text(),
          url: $(this).children("a").attr("href"),
          articleDate: null,
          summary: null,
          publication: mainUrl
        }
      }).toArray();
    }
    else if (mainUrl.match(/washingtonpost/)) {
      results = $(".headline a").map(function(i, element) {
        console.log($(element).parent().parent().find(".timestamp.time").data("timestamp"));
        return {
          title: $(element).text(),
          url: $(element).attr("href"),
          articleDate: new Date(Number($(element).parent().parent().find(".timestamp.time").data("timestamp"))),
          summary: $(element).parent().parent().find(".blurb").text(),
          publication: mainUrl
        }
      }).toArray();
    }
    else {
      results = $(".blog-posts.hfeed").children().map(function(i, element) {
        // console.log(element);
        return {
          title: $(element).find(".post-title a").text(),
          url: $(element).find(".post-title a").attr("href"),
          articleDate: $(element).find(".timestamp-link .published").attr("title"),
          summary: $(element).find(".post-body").text(),
          publication: mainUrl,
          imageURL: $(element).find("img").attr("src")
          
        }
      }).toArray();
    }
    console.log("results: ", results);

  // Now, we grab every h2 within an article tag, and do the following:
    if (true) {
      results.forEach(result=>
        HeadlineModel.findOneAndUpdate(
          {url: result.url},
          result,
          {upsert: true, new: true, runValidators: true, })
            .then(headline => console.log(headline))
            .catch(err => console.log("error\n\n\n", err))
        );
      // HeadlineModel.bulkWrite(results.map(result => {
      //   return {
      //     insertOne: result
      //   }
      // }))
    }
    else {
      HeadlineModel.insertMany(results, {ordered: false})
        .then(headlines => res.json(headlines))
        .catch(err => res.json(err));
    }
  });
  })
      res.json("done")
})

module.exports = router;
