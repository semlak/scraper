var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');
var axios = require("axios");
var cheerio = require("cheerio");
var HeadlineModel = require('../models/HeadlineModel.js');

var HeadlineController = require('../controllers/HeadlineController.js');


// router.get('/', UserController.list);
router.get("/", (req, res) => {
  let mainUrl = "http://www.echojs.com/";

  axios.get(mainUrl).then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

  // Now, we grab every h2 within an article tag, and do the following:
    // var Headline = new HeadlineModel({
    //   title : req.body.title,
    //   url : req.body.url,
    //   publication: mainUrl
    //   articleDate : req.body.articleDate,
    //   savedDate : req.body.savedDate,
    //   articleNotes : req.body.articleNotes

    // });

    // Headline.save((err, Headline) => {
    //     if (err) {
    //         return res.status(500).json({
    //             message: 'Error when creating Headline',
    //             error: err
    //         });
    //     }
    //     return res.status(201).json(Headline);
    // });

    let results = $("article h2").map(function(i, element) {
      // console.log("i", i, "element", element)
      return {
        title: $(this).children("a").text(),
        url: $(this).children("a").attr("href"),
        articleDate: null,
        summary: null,
      }
    })
    console.log("results: ", results.toArray());
    HeadlineModel.insertMany(results.toArray())
      .then(headlines => res.json(headlines))
      .catch(err => res.json(err));
    // HeadlineModel.insertMany(results, (err, headlines) => {
    //   if (err) throw err;
    //   res.json(headlines);
    // })

    // $("article h2").each(function(i, element) {
    //   // Save an empty result object
    //   var result = {};

    //   // Add the text and href of every link, and save them as properties of the result object
    //   result.title = $(this)
    //     .children("a")
    //     .text();
    //   result.link = $(this)
    //     .children("a")
    //     .attr("href");
    //   console.log(result);



    //   // Create a new Article using the `result` object built from scraping
    //   // db.Article.create(result)
    //   //   .then(function(dbArticle) {
    //   //     // View the added result in the console
    //   //     console.log(dbArticle);
    //   //   })
    //   //   .catch(function(err) {
    //   //     // If an error occurred, send it to the client
    //   //     return res.json(err);
    //   //   });
    // });

    // If we were able to successfully scrape and save an Article, send a message to the client
    // res.send("Scrape Complete");
  });
})

module.exports = router;
