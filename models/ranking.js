var mongoose = require('mongoose');

var Ranking = mongoose.model('Ranking', mongoose.Schema({ 
	choice : String,
	factor : String,
	value : Number
}));

module.exports = Ranking;