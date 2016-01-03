var mongoose = require('mongoose');

var Choice = mongoose.model('Choice', mongoose.Schema({ 
	name: String,
	rankings : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' }] 
}));

module.exports = Choice;