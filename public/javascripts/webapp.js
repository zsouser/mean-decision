angular
	.module('decision', ['ngTagsInput', 'rzModule', 'chart.js'])
	.controller('controller', function($scope, $http) {
	    $scope.choices 	= [];
	    $scope.factors 	= [];
	    $scope.weighted = {};
	    $scope.rankings = {};
	    $scope.series 	= [];
	    $scope.labels	= [];
	    $scope.slider = {
	    	ceil: 100,
	    	floor: 1,
	    	onEnd: function() {
	    		$scope.calculate()
	    	},
	    };
	    $scope.loadChoices = function(query) {
	         return $http.get('/choices?query=' + escape(query));
	    };
	    $scope.loadFactors = function(query) {
	         return $http.get('/factors?query=' + escape(query));
	    };
	    $scope.addChoice = function(choice) {
	    	$scope.rankings[choice.text] = {};
	    	for (factor in $scope.weighted) {
	    		$scope.rankings[choice.text][factor] = 10;//parseInt($http.get('/ranking?choice=' + escape(choice) + '&factor=' + escape($scope.factors[factor])));
	    	}
	    	$scope.calculate();
	    };
	    $scope.removeChoice = function(choice) {
	    	delete $scope.rankings[choice.text];
	    	delete $scope.choices[$scope.choices.indexOf(choice)];
	    	$scope.calculate();
	    };
	    $scope.removeFactor = function(factor) {
	    	delete $scope.factors[$scope.factors.indexOf(factor)];
	    	delete $scope.weighted[factor.text];
	    	for (choice in $scope.rankings) {
	    		delete $scope.rankings[choice][factor.text];
	    	}
	    	$scope.calculate();
	    };
	    $scope.addFactor = function(factor) {
	    	$scope.weighted[factor.text] = 10;
	    	for (choice in $scope.rankings) {
	    		$scope.rankings[choice][factor.text] = 10;//parseInt($http.get('/ranking?choice=' + escape($scope.choices[choice]) + '&factor=' + escape(factor)));
	    	}
	    	$scope.calculate();
	    };
	    $scope.calculate = function() {
	    	$http.post('/decide', {
	    		factors: $scope.weighted,
	    		choices: $scope.rankings
	    	}).then(function(response) {
	    		$scope.answers = response.data;
	    		$scope.series = [];
	    		$scope.labels = [];
	    		for (key in $scope.answers) {
		    		$scope.series.push(($scope.answers[key] * 100).toFixed(2));
		    		$scope.labels.push(key);
		    	}
	    	}, function(response) { console.log(response) });	
	    };
	});