var mongoose = require('mongoose');

var Factor = mongoose.model('Factor', mongoose.Schema({ 
	name: String,
	rankings : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' }] 
}));

module.exports = Factor;