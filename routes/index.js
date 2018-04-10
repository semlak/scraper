var express = require('express');
var router = express.Router();

var HeadlineModel = require('../models/HeadlineModel.js');
var NoteModel = require('../models/NoteModel.js');


/* GET home page. */
router.get('/', (req, res, next) => {
 HeadlineModel
    .find()
    .sort({articleDate: -1})
    .then(headlines =>  {
      // console.log(headlines);
      res.render('index', {title: "Headlines", headlines: headlines})
    })
    .catch(err => res.render('index', {title: 'Express', error : "Unable to load headlines."}))
  // res.render('index', { title: 'Express' , });
});

router.get('/saved_articles', (req, res, next) => {
  HeadlineModel
    .find({isSaved: true})
    .sort({articleDate: -1})
    .then(headlines => {
      res.render('index', {title: "Headlines", headlines: headlines})
    })
    .catch(err => res.render('index', {title: 'Express', error : "Unable to load headlines."}))
})


    router.get("/reset/", (req, res) => {
        console.log("received request to drop database collections")
        HeadlineModel.collection.drop()
        .catch(err => console.log(err))
        NoteModel.collection.drop().catch(err => console.log(err));
        res.json("done");

    })

module.exports = router;
