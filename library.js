module.exports = {
	/**
	 * Normalize the object
	 *
	 * Replaces the values of an object with its percentage
	 * relative to the sum
	 */
	normalize: function(data) {
		data = data || {};
		var sum = Object.keys(data).reduce(function(prev, next) { 
			return prev + data[next]; 
		}, 0);

		Object.keys(data).map(function(key) { 
			data[key] = data[key] / sum; 
		});
		return data;
	},

	/**
	 * Save the factors and choices in Mongo
	 */
	persist: function(factors, choices) {
		var savedFactors = [];
		var Factor = require('./models/factor.js');
		var Choice = require('./models/choice.js');
		var Ranking = require('./models/ranking.js');
		
		for (factor in factors) {
			savedFactors[factor] = Factor.findOneAndUpdate({ name: factor }, { name: factor }, { upsert: true }, this.handler);
		}

		for (choice in choices) {
			var savedChoice = Choice.findOneAndUpdate({ name: choice }, { name: choice }, { upsert: true }, this.handler);
			for (factor in choices[choice]) {
				new Ranking({ 
					choice: choice,
					factor: factor,
					value: choices[choice][factor]
				}).save(this.handler);
			}
		}
	},

	/**
	 * Autocomplete
	 *
	 * Populate the autocomplete list with chocies or factor
	 * 
	 * @param model the Model (Choice, Factor)
	 * @param req the request object
	 * @param res the response object
	 */
	autocomplete: function(model, req, res) {
		var query = model.find({"name": new RegExp(req.query.query, "i")});
		query.select('name');
		var output = [];
		query.exec(function(err, results) {
			for (i in results) {
				output.push(results[i].name);
			}
			res.json(output);
		});
	},

	/**
	 * Calculate
	 *
	 * Crunch the numbers
	 *
	 * @param factors Object
	 * @param choices Object
	 * @return Array
	 */
	calculate: function(factors, choices) {
		for (key in choices) {
			choices[key] = Object.keys(choices[key]).reduce(function(prev, next) {
				return prev + choices[key][next] * factors[next];
			}, 0);
		}
		return this.normalize(choices);
	},

	/** 
	 * Mongoose errorhandler
	 */
	handler: function(error) {
		if (error) console.log(error);
	},

	/**
	 * Get the average rating for this choice 
	 * relative to this characteristic
	 */
	getAverage: function(choice, factor, res) {
		var Ranking = require('./models/ranking.js');
		Ranking.aggregate(
			{ $match: { choice: choice, factor: factor } },
			{ $group: { _id: null, average: { $avg: "$value" } } }
		).exec(function(err, result) {

			var avg = result[0] ? parseInt(result[0].average || 10) : 10
			console.log(avg);
			res.json(avg);
		});
	}
};