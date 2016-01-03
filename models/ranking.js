var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/test');

var Ranking = db.model('Ranking', mongoose.Schema({ 
	choice : String,
	factor : String,
	value : Number
}));

module.exports = Ranking;