var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var HeadlineSchema = new Schema({
	'title' : String,
	'url' : {
    type: String,
    unique: true,
  },
  'publication': String,
	'articleDate' : Date,
	'savedDate' : { type: Date, default: Date.now },
  'imageURL': String,
  'summary' : String,
	'articleNotes' : Array
});

module.exports = mongoose.model('Headline', HeadlineSchema);
