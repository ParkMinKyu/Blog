'use strict';
var blogApp = angular.module('blogApp',
		['ngRoute','menuControllers','blogControllers','rssControllers','angulike','ngSanitize'])
		.run([
		      '$rootScope', function ($rootScope) {
		    	  $rootScope.facebookAppId = '[FacebookAppId]'; // set your facebook app id here
		      }
	]);

blogApp.constant('appConfig',{
	appUrl : "http://parkminkyu.github.io",
	contextPath : "/Blog"
});

blogApp.config(function($routeProvider){
	$routeProvider.when('/contents',{ 
		templateUrl : '/blog/contents.html',
		controller : 'contentsCtrl'
	}).when('/subContents/:seq',{ 
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
menuControllers.controller('menuCtrl',['appConfig','$scope', '$sce', '$http',
	function(appConfig,$scope, $sce, $http){
		$http.get(appConfig.contextPath+'/data/menu.json').success(function(data){
			var menuList = data.menuList;
			var menuHtml = '';
	    	for(var i = 0 ; i < menuList.length ; i ++){
	    		var $ul = $('<ul class="nav navbar-nav">');
	    		var menu = menuList[i]; 
	    		var childs = menu.child;
	    		if(childs.length == 0){
	    			$ul.append('<li><a href="#subContents/'+menu.seq+'">'+menu.title+' <span class="badge pull-right pull-right">'+menu.count+'</span></a></li>');
	    		}else{
	    			var $li = $('<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">'+menu.title+' <span class="caret"></span></a></li>');
	    			var $cul = $('<ul class="dropdown-menu" role="menu">');
	    			$li.append($cul);
	    			for(var j = 0 ; j < childs.length ; j ++){
	    				var child = childs[j];
	    				if(!child.isLine){
	    					var $cli = $('<li><a href="#subContents/'+child.seq+'">'+child.title+' <span class="badge pull-right pull-right">'+child.count+'</span></a></li>');
	    					$cul.append($cli);
	    				}
	    				else{
	    					var $cli = $('<li class="divider"></li>');
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

blogControllers.controller('contentsCtrl',['appConfig','$scope','$http',
	function(appConfig,$scope,$http){
		$http.get(appConfig.contextPath+'/data/mainContents.json').success(function(data){
			$scope.contents = data;
			$scope.appConfig = appConfig;
		});
		$scope.orderProp = "-regDate";
	}
]);

blogControllers.controller('subContentsCtrl',['appConfig', '$scope', '$routeParams', '$http',
	function( appConfig,$scope, $routeParams, $http){
		$http.get(appConfig.contextPath+'/data/subContents.json').success(function(data){
			$scope.contents = data;
			$scope.menuSeq = $routeParams.seq;
			$scope.appConfig = appConfig;
			$scope.orderProp = "-regDate";
		});
	}
]);

blogControllers.controller('viewCtrl',['appConfig', '$scope','$sce','$routeParams','$http',
	function(appConfig, $scope, $sce, $routeParams, $http){
		$http.get(appConfig.contextPath+'/data/'+$routeParams.seq+'.json').success(function(data){
			$scope.contents = data;
			$scope.content = $sce.trustAsHtml(data.contents);
			$scope.myModel = {
					Url: appConfig.appUrl + appConfig.contextPath + '/blog/main.html#/view/' +data.seq,
					Name: data.title 
			};
			$scope.appConfig = appConfig;
			$(window).scrollTop(0);
		});
	}
]);

var rssControllers = angular.module('rssControllers',[]);

rssControllers.controller('rssCtrl',['appConfig','$scope', 'FeedService','$http',
	function(appConfig, $scope, Feed,$http){
		$http.get(appConfig.contextPath+'/data/rss.json').success(function(data){
			var rssList = data.rssList;
			$scope.rssList = new Array();
			for(var i = 0 ; i < rssList.length ; i ++){
				$scope.rssList.push(rssList[i]);
				var rss = rssList[i];
				Feed.parseFeed(rss.url,rss.getCount).then(function(res){
					for(var i = 0 ; i < $scope.rssList.length ; i ++){
						if($scope.rssList[i].url == res.data.responseData.feed.feedUrl){
							$scope.rssList[i].data = res.data.responseData.feed.entries; 
						}
					}
				});
			}
		});
	}
]);

rssControllers.factory('FeedService',['$http',function($http){
    return {
        parseFeed : function(url,count){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+count+'&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    };
}]);