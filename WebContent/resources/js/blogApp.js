var blogApp = angular.module('blogApp',['ngRoute','blogControllers','ngSanitize']);

blogApp.config(function($routeProvider){
	$routeProvider.when('/contents',{ 
		templateUrl : '/blog/contents.html',
		controller : 'contentsCtrl'
	}).when('/subContents',{ 
		templateUrl : '/blog/subContents.html',
		controller : 'subContentsCtrl'
	}).when('/view/:seq',{ 
		templateUrl : '/blog/view.html',
		controller : 'viewCtrl'
	}).otherwise({
		redirectTo: '/contents'
	});
});

var blogControllers = angular.module('blogControllers',[]);

blogControllers.controller('contentsCtrl',['$scope','$http',
	function($scope,$http){
		$http.get('/data/mainContents.json').success(function(data){
			$scope.contents = data;
		});
		$scope.orderProp = "-regDate";
	}
]);

blogControllers.controller('subContentsCtrl',['$scope','$http',
	function($scope,$http){
		$http.get('/data/subContents.json').success(function(data){
			$scope.contents = data;
		});
		$scope.orderProp = "-regDate";
	}
]);

blogControllers.controller('viewCtrl',['$scope','$sce','$routeParams','$http',
	function($scope, $sce, $routeParams, $http){
		$http.get('/data/'+$routeParams.seq+'.json').success(function(data){
			$scope.contents = data;
			$scope.content = $sce.trustAsHtml(data.contents);
		});
	}
]);