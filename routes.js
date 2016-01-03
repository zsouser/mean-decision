var express = require('express');
var router = express.Router();
var Library = require('./library.js')

/**
 * Perform the calculation
 */
router.post('/decide', function(req, res, next) {
	var factors = Library.normalize(req.body.factors),
		choices = req.body.choices || {};

	Library.persist(factors, choices);
	results = Library.calculate(factors, choices);
	res.json(results);
});

/** 
 * Display the Angular interface
 */
router.get('/', function(req, res, next) {
	res.render('decide');
});

router.get('/factors', function(req, res, next) {
	var Factor = require('./models/factor.js');
	Library.autocomplete(Factor, req, res);
});

router.get('/choices', function(req, res, next) {
	var Choice = require('./models/choice.js');
	Library.autocomplete(Choice, req, res);
});

router.get('/ranking', function(req, res, next) {
	Library.getAverage(req.query.choice, req.query.factor, res);
})

module.exports = router;
