var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var NoteSchema = new Schema({
	'body' : String,
	'articleId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Headline'
	},
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'likes' : Array
});

module.exports = mongoose.model('Note', NoteSchema);
