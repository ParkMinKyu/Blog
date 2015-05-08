var blogApp = angular.module('blogApp',['ngRoute','blogControllers','ngSanitize']);

blogApp.config(function($routeProvider){
	$routeProvider.when('/contents',{ 
		templateUrl : '/Blog/blog/contents.html',
		controller : 'contentsCtrl'
	}).when('/subContents',{ 
		templateUrl : '/Blog/blog/subContents.html',
		controller : 'subContentsCtrl'
	}).when('/view/:seq',{ 
		templateUrl : '/Blog/blog/view.html',
		controller : 'viewCtrl'
	}).otherwise({
		redirectTo: '/contents'
	});
});

var blogControllers = angular.module('blogControllers',[]);

blogControllers.controller('contentsCtrl',['$scope','$http',
	function($scope,$http){
		$http.get('/Blog/data/mainContents.json').success(function(data){
			$scope.contents = data;
		});
		$scope.orderProp = "-regDate";
	}
]);

blogControllers.controller('subContentsCtrl',['$scope','$http',
	function($scope,$http){
		$http.get('/Blog/data/subContents.json').success(function(data){
			$scope.contents = data;
		});
		$scope.orderProp = "-regDate";
	}
]);

blogControllers.controller('viewCtrl',['$scope','$sce','$routeParams','$http',
	function($scope, $sce, $routeParams, $http){
		$http.get('/Blog/data/'+$routeParams.seq+'.json').success(function(data){
			$scope.contents = data;
			$scope.content = $sce.trustAsHtml(data.contents);
		});
	}
]);