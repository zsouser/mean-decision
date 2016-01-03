var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/test');

var Choice = db.model('Choice', mongoose.Schema({ 
	name: String,
	rankings : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' }] 
}));

module.exports = Choice;