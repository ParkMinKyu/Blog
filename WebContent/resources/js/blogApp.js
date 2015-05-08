var blogApp = angular.module('blogApp',['ngRoute','menuControllers','blogControllers','ngSanitize']);

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

var menuControllers = angular.module('menuControllers',[]);
menuControllers.controller('menuCtrl',['$scope', '$sce', '$http',
	function($scope, $sce, $http){
		$http.get('/data/menu.json').success(function(data){
			var menuList = data.menuList;
			var menuHtml = '';
	    	for(var i = 0 ; i < menuList.length ; i ++){
	    		var $ul = $('<ul class="nav navbar-nav">');
	    		var menu = menuList[i]; 
	    		var childs = menu.child;
	    		if(childs.length == 0){
	    			$ul.append('<li><a href="'+menu.url+'">'+menu.title+' <span class="badge pull-right pull-right">'+menu.count+'</span></a></li>');
	    		}else{
	    			var $li = $('<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'+menu.title+' <span class="caret"></span></a></li>');
	    			var $cul = $('<ul class="dropdown-menu" role="menu">');
	    			$li.append($cul);
	    			for(var j = 0 ; j < childs.length ; j ++){
	    				var child = childs[j];
	    				if(child.isLine){
	    					var $cli = $('<li class="divider"></li>');
	    					$cul.append($cli);
	    				}
	    				else{
	    					var $cli = $('<li><a href="'+child.url+'">'+child.title+' <span class="badge pull-right pull-right">'+child.count+'</span></a></li>');
	    					$cul.append($cli);
	    				}
	    			}
	    			$ul.append($li);
	    		}
	    		menuHtml += $ul[0].outerHTML;
	    	}
	    	$scope.menu = $sce.trustAsHtml(menuHtml);  
	    	
		});
	}
]);

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