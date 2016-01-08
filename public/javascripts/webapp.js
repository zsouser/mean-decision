angular
	.module('decision', ['ngTagsInput', 'rzModule', 'chart.js'])
	.controller('controller', function($scope, $http) {
	    $scope.choices 		= [];
	    $scope.factors 		= [];
	    $scope.weighted 	= {};
	    $scope.rankings 	= {};
	    $scope.series 		= [];
	    $scope.labels		= [];
	    $scope.setup 		= true;
	    $scope.activeFactor = false;
	    $scope.shouldLookup = false;

	    
	    // Default slider options
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
	    $scope.lookup = function() {
	    	var semaphore = 0;
	    	for (choice in $scope.rankings) {
	    		for (factor in $scope.weighted) {
	    			semaphore++;
			    	$http.get('/ranking?choice=' + choice + '&factor=' + factor)
		    			.then(function(response) {
		    				semaphore--;
		    				$scope.rankings[response.data.choice][response.data.factor] = parseInt(response.data.ranking);
		    				if (!semaphore) {
	    						$scope.calculate();
	    					}
		    			}, function(response) { console.log(response) }
	    			);
		    	}
	    	}
	    };
	    $scope.selectFactor = function(factor) {
	    	$scope.activeFactor = factor;
	    }
	    $scope.hideSliders = function() {
	    	$scope.activeFactor = "";
	    }
	    $scope.toggleSetup = function() {
	    	if (Object.keys($scope.rankings).length)
				$scope.setup = !$scope.setup;
	    }
	    $scope.addChoice = function(choice) {
	    	if (choice && choice.text) {
		    	$scope.rankings[choice.text] = {};
		    	for (factor in $scope.weighted) {
		    		$scope.rankings[choice.text][factor] = 10;
		    	}
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
	    	if (factor && factor.text) {
		    	$scope.weighted[factor.text] = 10;
		    	for (choice in $scope.rankings) {
		    		$scope.rankings[choice][factor.text] = 10;
		    	}
			}
	    	$scope.calculate();
	    };
	    $scope.calculate = function() {
	    	$http.post('/decide', {
	    		factors: $scope.weighted,
	    		choices: $scope.rankings
	    	}).then(function(response) {
	    		$scope.series = [];
	    		$scope.labels = [];
	    		for (key in response.data) {
		    		$scope.series.push((response.data[key] * 100).toFixed(2));
		    		$scope.labels.push(key);
		    	}
	    	}, function(response) { console.log(response) });	
	    };
	});