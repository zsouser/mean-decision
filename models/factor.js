var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/test');

var Factor = db.model('Factor', mongoose.Schema({ 
	name: String,
	rankings : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ranking' }] 
}));

module.exports = Factor;