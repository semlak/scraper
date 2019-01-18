var HeadlineModel = require('../models/HeadlineModel.js');

const request = require("request");
var cheerio = require("cheerio");

/**
 * HeadlineController.js
 *
 * @description :: Server-side logic for managing Headlines.
 */


let requestPromise = url => {
  // console.log('creating promise, url', url)
  return new Promise((resolve, reject) => {
    // console.log('about to run request')
    request(url, (err, response, html) => {
      // console.log("inside request callback, err", err, "response", response, "html", html)
      // console.log("inside request callback, err", err, "response", typeof response, "html", typeof html)
      // console.log("resolve", typeof resolve, "reject", typeof reject)
      // console.log("inside request callback, err", err, "response", response, "html", html)
      if (err) {
        console.log("rejecting")
        reject(err);
      } 
      else {
        console.log("resolving")
        // resolve(response, html);
        resolve(html);
      }
    })
  })
}


module.exports = {

    /**
     * HeadlineController.list()
     */
    list: (req, res) => {
        HeadlineModel.find().sort({articleDate: -1}).exec((err, Headlines) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Headline.',
                    error: err
                });
            }
            return res.json(Headlines);
        });
    },

    /**
     * HeadlineController.show()
     */
    show: (req, res) => {
        var id = req.params.id;
        HeadlineModel.findOne({_id: id}, (err, Headline) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Headline.',
                    error: err
                });
            }
            if (!Headline) {
                return res.status(404).json({
                    message: 'No such Headline'
                });
            }
            return res.json(Headline);
        });
    },

    /**
     * HeadlineController.create()
     */
    create: (req, res) => {
        var Headline = new HeadlineModel({
			title : req.body.title,
			url : req.body.url,
			articleDate : req.body.articleDate,
			// savedDate : req.body.savedDate,
			articleNotes : req.body.articleNotes

        });

        Headline.save((err, Headline) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Headline',
                    error: err
                });
            }
            return res.status(201).json(Headline);
        });
    },

    /**
     * HeadlineController.update()
     */
    update: (req, res) => {
        var id = req.params.id;
        // console.log(id, req.body);
        HeadlineModel.update({_id: id}, {$set: {isSaved: req.body.isSaved || req.body.isSaved === "true"}}).then(response => {
        // HeadlineModel.find({_id: id}).then(response => {
            // console.log(response);
            res.json(response);
        }).catch(err => res.json(err)); 
    },

    /**
     * HeadlineController.remove()
     */
    remove: (req, res) => {
        var id = req.params.id;
        HeadlineModel.findByIdAndRemove(id, (err, Headline) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Headline.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },


    scrape: (req, res) => {
        let publicationUrls = [
            "https://www.washingtonpost.com",
            "http://www.wedgelive.com/"
        ]
        let headlineDocuments = [];
        let requestPromises = publicationUrls.map(mainUrl => requestPromise(mainUrl).then(html => {
            // console.log(html)
            var $ = cheerio.load(html);
            let results = [];
            if (mainUrl.match(/washingtonpost/)) {
                results = $(".headline a").map(function(i, element) {
                //console.log("hey", $(element).parent().parent().find(".timestamp.time").data("timestamp"));
                let timestamp = $(element).parent().parent().find(".timestamp.time").data("timestamp");
                return {
                    title: $(element).text(),
                    url: $(element).attr("href"),
                    articleDate: timestamp ? (new Date(Number($(element).parent().parent().find(".timestamp.time").data("timestamp")))) : null,
                    summary: $(element).parent().parent().find(".blurb").text(),
                    publication: mainUrl,
                    isSaved: false
                }
                }).toArray();
            }
            else {
                results = $(".blog-posts.hfeed").children().map(function(i, element) {
                return {
                    title: $(element).find(".post-title a").text(),
                    url: $(element).find(".post-title a").attr("href"),
                    articleDate: $(element).find(".timestamp-link .published").attr("title"),
                    summary: $(element).find(".post-body").text(),
                    publication: mainUrl,
                    imageURL: $(element).find("img").attr("src"),
                    isSaved: false
                    
                }
                }).toArray();
            }
            // return results;
            headlineDocuments.push(results);
            })
        )

        Promise.all(requestPromises).then( () => {
            let results = [].concat.apply([], headlineDocuments);
            Promise.all(results.map(result=>
            HeadlineModel.findOneAndUpdate(
                {url: result.url},
                result,
                {upsert: true, new: true, runValidators: true, })
                .then(headline => {
                  // console.log(headline)
                })
                .catch(err => console.log("error\n\n\n", err))
            ))
            .then(repsonse => res.json({results: "Done with scraping articles"}))
            .catch(err => res.json({error: "Error while scraping articles"}))
        })
    }



};
