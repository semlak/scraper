var express = require('express');
var router = express.Router();

var HeadlineModel = require('../models/HeadlineModel.js');
var NoteModel = require('../models/NoteModel.js');


/* GET home page. */
router.get('/', (req, res, next) => {
  // HeadlineModel.find()
  //   .then(headlines => headlines.forEach(headline=> {
  //     let note = new NoteModel({
  //       body : "blahblah",
  //       articleId : headline._id,
  //       userId : null,
  //       likes : []
  //     });

  //     note.save((err, Note) => {
  //         // return res.status(201).json(Note);
  //         // if (!headline.articleNotes) headline.articleNotes = [];
  //         headline.articleNotes.push(Note);
  //         headline.save()
  //     });
  // }))
  HeadlineModel
    .find()
    .then(headlines =>  {
      console.log(headlines);
      res.render('index', {title: "Headlines", headlines: headlines})
    })
    .catch(err => res.render('index', {title: 'Express', error : "Unable to load headlines."}))
  // res.render('index', { title: 'Express' , });
});

module.exports = router;
