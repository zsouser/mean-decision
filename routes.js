var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Choice = require('./models/choice.js');
var Factor = require('./models/factor.js');
var Ranking = require('./models/ranking.js');

/**
 * Normalize the object
 *
 * Replaces the values of an object with its percentage
 * relative to the sum
 */
function normalize(data) {
	data = data || {};
	var sum = Object.keys(data).reduce(function(prev, next) { 
		return prev + data[next]; 
	}, 0);

	Object.keys(data).map(function(key) { 
		data[key] = data[key] / sum; 
	});
	return data;
}

/**
 * Save the factors and choices in Mongo
 */
function persist(factors, choices) {
	var db = mongoose.connect('mongodb://localhost/test');
	
	for (factor in factors) {
		savedFactors[factor] = Factor.findOneAndUpdate({ name: factor }, { name: factor }, { upsert: true }, handler);
	}

	for (choice in choices) {
		var savedChoice = Choice.findOneAndUpdate({ name: choice }, { name: choice }, { upsert: true }, handler);
		for (factor in choices[choice]) {
			new Ranking({ 
				choice: choice,
				factor: factor,
				value: choices[choice][factor]
			}).save(handler);
		}
	}

	db.disconnect();
}

function autocomplete(model, req, res) {
	var db = mongoose.connect('mongodb://localhost/test');
	var query = model.find({"name": new RegExp(req.query.query, "i")});
	query.select('name');
	var output = [];
	query.exec(function(err, results) {
		for (i in results) {
			output.push(results[i].name);
		}
		db.disconnect();
		res.json(output);
	});
}

/** 
 * Mongoose error handler
 */
function handler(error) {
	console.log(error || 'Saved');
}

/**
 * Perform the calculation
 */
router.post('/decide', function(req, res, next) {
	var factors = normalize(req.body.factors),
		choices = req.body.choices || {},
		results = {}
		savedFactors = {};

	persist(factors, choices);

	Object.keys(choices).map(function(key) {
		choices[key] = Object.keys(choices[key]).reduce(function(prev, next) {
			return prev + choices[key][next] * factors[next];
		}, 0);
	});

	res.json(normalize(choices));
});

/** 
 * Display the Angular interface
 */
router.get('/', function(req, res, next) {
	res.render('decide');
});

router.get('/factors', function(req, res, next) {
	autocomplete(Factor, req, res);
});

router.get('/choices', function(req, res, next) {
	autocomplete(Choice, req, res);
});

module.exports = router;
