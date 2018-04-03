var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LikeSchema = new Schema({
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'noteId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Note'
	}
});

module.exports = mongoose.model('Like', LikeSchema);
