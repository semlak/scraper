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

module.exports = router;
