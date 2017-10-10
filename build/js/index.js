'use strict';

angular.module('app', ['ui.router', 'ngCookies', 'validation']);

'use strict';
angular.module('app').value('dict', {}).run(['dict', '$http', function(dict, $http){
  $http.get('data/city.json').success(function(resp){
    dict.city = resp;
  });
  $http.get('data/salary.json').success(function(resp){
    dict.salary = resp;
  });
  $http.get('data/scale.json').success(function(resp){
    dict.scale = resp;
  });
}]);

'use strict';
/*
since we do not have back end we used this file to deal with post and get request
*/
angular.module('app').config(['$provide', function($provide){
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
    //modifres post request
    //change it to get request
    //and send the request back
    $delegate.post = function(url, data, config) {
      //defer of time
      var def = $q.defer();
      //send the get request if success
      $delegate.get(url).success(function(resp) {
        //resolve the confilt
        def.resolve(resp);
      }).error(function(err) {
        def.reject(err);
      });
      return {
        //parameter is cd
        //finish the result
        success: function(cb){
          def.promise.then(cb);
        },
        //catch the error
        //return errorr
        error: function(cb) {
          def.promise.then(null, cb);
        }
      }
    }
    //return delegate as ret value
    return $delegate;
  }]);
}]);

'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('main', {
    url: '/main',
    templateUrl: 'view/main.html',
    controller: 'mainCtrl'
  }).state('position', {
    url: '/position/:id',
    templateUrl: 'view/position.html',
    controller: 'positionCtrl'
  }).state('company', {
    url: '/company/:id',
    templateUrl: 'view/company.html',
    controller: 'companyCtrl'
  }).state('search', {
    url: '/search',
    templateUrl: 'view/search.html',
    controller: 'searchCtrl'
  }).state('login', {
    url: '/login',
    templateUrl: 'view/login.html',
    controller: 'loginCtrl'
  }).state('register', {
    url: '/register',
    templateUrl: 'view/register.html',
    controller: 'registerCtrl'
  }).state('me', {
    url: '/me',
    templateUrl: 'view/me.html',
    controller: 'meCtrl'
  }).state('post', {
    url: '/post',
    templateUrl: 'view/post.html',
    controller: 'postCtrl'
  }).state('favorite', {
    url: '/favorite',
    templateUrl: 'view/favorite.html',
    controller: 'favoriteCtrl'
  });
  $urlRouterProvider.otherwise('main');
}])

'use strict';
angular.module('app').config(['$validationProvider', function($validationProvider) {
  var expression = {
    phone: /^1[\d]{10}$/,
    password: function(value) {
      var str = value + ''
      return str.length > 5;
    },
    required: function(value) {
      return !!value;
    }
  };
  var defaultMsg = {
    phone: {
      success: '',
      error: '必须是11位手机号'
    },
    password: {
      success: '',
      error: '长度至少6位'
    },
    required: {
      success: '',
      error: '不能为空'
    }
  };
  $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);

'use strict';
angular.module('app').controller('companyCtrl', ['$http', '$state', '$scope', function($http, $state, $scope){
  $http.get('data/company.json?id='+$state.params.id).success(function(resp){
    $scope.company = resp;
    //$scope.$broadcast('abc', {id:1});
  });
  /*
  $scope.$on('cba', function(event, data){
    console.log(event, data);
  }); */



}]);

'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('data/myFavorite.json').success(function(resp) {
    $scope.list = resp;
  });
}]);

'use strict';
angular.module('app').controller('loginCtrl', ['cache', '$state', '$http', '$scope', function(cache, $state, $http, $scope){
  $scope.submit = function() {
    $http.post('data/login.json', $scope.user).success(function(resp){
      cache.put('id',resp.id);
      cache.put('name',resp.name);
      cache.put('image',resp.image);
      $state.go('main');
    });
  }
}]);

'use strict';
angular.module('app').controller('mainCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('/data/positionList.json').success(function(resp){
    $scope.list = resp;
      console.log(resp);
  });
}]);

'use strict';
angular.module('app').controller('meCtrl', ['$state', 'cache', '$http', '$scope', function($state, cache, $http, $scope){
  if(cache.get('name')) {
    $scope.name = cache.get('name');
    $scope.image = cache.get('image');
  }
  $scope.logout = function() {
    cache.remove('id');
    cache.remove('name');
    cache.remove('image');
    $state.go('main');
  };
}]);

'use strict';
angular.module('app').controller('positionCtrl', ['$log', '$q', '$http', '$state', '$scope', 'cache', function($log, $q, $http, $state, $scope, cache){
  $scope.isLogin = !!cache.get('name');
  $scope.message = $scope.isLogin?'Send resume':'Login in';
  function getPosition() {
    var def = $q.defer();
    $http.get('data/position.json', {
      params: {
        id: $state.params.id
      }
    }).success(function(resp) {
      $scope.position = resp;
      if(resp.posted) {
        $scope.message = 'Has Sent';
      }
      def.resolve(resp);
    }).error(function(err) {
      def.reject(err);
    });
    return def.promise;
  }
  function getCompany(id) {
    $http.get('data/company.json?id='+id).success(function(resp){
      $scope.company = resp;
    })
  }
  getPosition().then(function(obj){
    getCompany(obj.companyId);
  });
  $scope.go = function() {
    if($scope.message !== 'Has Sent') {
      if($scope.isLogin) {
        $http.post('data/handle.json', {
          id: $scope.position.id
        }).success(function(resp) {
          $log.info(resp);
          $scope.message = 'Has Sent';
        });
      } else {
        $state.go('login');
      }
    }
  }
}]);

'use strict';
angular.module('app').controller('postCtrl', ['$http', '$scope', function($http, $scope){
  $scope.tabList = [{
    id: 'all',
    name: 'All'
  }, {
    id: 'pass',
    name: 'Interview'
  }, {
    id: 'fail',
    name: 'No fit'
  }];
  $http.get('data/myPost.json').success(function(res){
    $scope.positionList = res;
  });
  $scope.filterObj = {};
  $scope.tClick = function(id, name) {
    switch (id) {
      case 'all':
        delete $scope.filterObj.state;
        break;
      case 'pass':
        $scope.filterObj.state = '1';
        break;
      case 'fail':
        $scope.filterObj.state = '-1';
        break;
      default:

    }
  }
}]);

'use strict';
angular.module('app').controller('registerCtrl', ['$interval', '$http', '$scope', '$state', function($interval, $http, $scope, $state){
  $scope.submit = function(){
    $http.post('data/regist.json',$scope.user).success(function(resp){
    console.log(resp);
    //register successfuly using
    $state.go('login');
    });
  }
  //each time successfully click we send
  var count = 60;
  $scope.send = function() {
    $http.get('data/code.json').success(function(resp){
      if(1===resp.state) {
        count = 60;
        $scope.time = '60s';
        var interval = $interval(function() {
          if(count<=0) {
            $interval.cancel(interval);
            $scope.time = '';
          } else {
            count--;
            $scope.time = count + 's';
          }
        }, 1000);
      }
    });
  }
}]);

'use strict';
angular.module('app').controller('searchCtrl', ['dict', '$http', '$scope', function(dict, $http, $scope){
$scope.search = function(){
    $http.get('data/positionList.json').success(function(resp) {
      $scope.positionList = resp;
    });
  };
  $scope.search();
  $scope.sheet = {};
  $scope.tabList = [{
    id:'city',
    name:'City'
  },{
    id:'salary',
    name:'Wage'
  },{
    id: 'scale',
    name: 'Company-Size'
  }];
  $scope.filterObj = {};
  var tabId = '';
  $scope.tClick = function(id,name) {
    tabId = id;
    $scope.sheet.list = dict[id];
    $scope.sheet.visible = true;

  };

  $scope.sClick = function(id,name) {
    if(id) {
      angular.forEach($scope.tabList, function(item){
        if(item.id===tabId) {
          item.name = name;
        }
      });
    // used for the filter
     $scope.filterObj[tabId + 'Id'] = id;
    } else {
      //not used the delete the filter
      delete $scope.filterObj[tabId + 'Id'];
      angular.forEach($scope.tabList, function(item){
        if(item.id===tabId) {
          switch (item.id) {
            case 'city':
              item.name = '城市';
              break;
            case 'salary':
              item.name = '薪水';
              break;
            case 'scale':
              item.name = '公司规模';
              break;
            default:
          }
        }
      });
    }
  }

}]);

'use strict';
angular.module("app").directive('appCompany', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      com: '='
    },
    templateUrl: 'view/template/company.html'
  };
}]);

'use strict';
angular.module('app').directive('appFoot', [function(){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/foot.html'
  }
}]);

'use strict';
//using appHead since html does not care it
angular.module('app').directive('appHead', ['cache', function(cache){
  return {
    restrict: 'A', //return target, using attribute to use the property
    replace: true, //replace the value
    templateUrl: 'view/template/head.html', //tempalte location
    link: function($scope) {
      $scope.name = cache.get('name') || '';
    }
  };
}]);

'use strict';
//using appHead since html does not care it
angular.module('app').directive('appHeadBar', [function(){
  return {
    restrict: 'A', //return target, using attribute to use the property
    replace: true, //replace the value
    templateUrl: 'view/template/headBar.html', //tempalte location
    scope:{
        text: '@'
    },
    link: function($scope){
      $scope.back = function(){
        window.history.back();
      };

      /*
      //receive the broadcast from positionClass.js
      $scope.$on('abc', function(event, data){
        console.log(event, data);
      });*/


    }
  };
}]);

'use strict';
angular.module('app').directive('appPositionClass', [function(){
  return {
    restrict: 'A',
      replace: true,
      scope: {
        com: '='
      },
      templateUrl: 'view/template/positionClass.html',
      link: function($scope) {
        $scope.showPositionList = function(idx) {
          $scope.positionList = $scope.com.positionClass[idx].positionList;
          $scope.isActive = idx;
        }
        //wait until come send back the here
        //as long as the first value is here
        //then we can init the first property
        //watch will make the run time slow
        $scope.$watch('com', function(newVal){
          if(newVal) $scope.showPositionList(0);
        });
      }
    };
}]);

'use strict';
angular.module("app").directive('appPositionInfo', ['$http', function($http){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionInfo.html',
    scope: {
      isActive: '=',
      isLogin: '=',
      pos: '='
    },
    link: function($scope) {
      $scope.$watch('pos', function(newVal) {
        if(newVal) {
          $scope.pos.select = $scope.pos.select || false;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        }
      })
      $scope.favorite = function() {
        $http.post('data/favorite.json', {
          id: $scope.pos.id,
          select: !$scope.pos.select
        }).success(function(resp) {
          $scope.pos.select = !$scope.pos.select;
          $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
        });
      }
    }
  }
}]);

'use strict';
angular.module('app').directive('appPositionList', ['$http', function($http){
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionList.html',
    scope: {
      data: '=',
      filterObj: '=',
      isFavorite: '='
    },
    link: function($scope) {
      $scope.select = function(item) {
        $http.post('data/favorite.json', {
          id: item.id,
          select: !item.select
        }).success(function(resp){
          item.select = !item.select;
        })
      };
    }
  };
}]);

'use strict';
angular.module('app').directive('appSheet', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope:{
      list: '=',
      visible: '=',
      select: '&' 
    },
    templateUrl: 'view/template/sheet.html'
  };
}]);

'use strict';
angular.module('app').directive('appTab', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      list: '=',
      tabClick: '&'
    },
    templateUrl: 'view/template/tab.html',
    link: function($scope) {
      $scope.click = function(tab) {
        $scope.selectId = tab.id;
        $scope.tabClick(tab);
      };
    }
  };
}]);

'use strict';
angular.module('app').filter('filterByObj', [function(){
  return function(list, obj) {
    var result = [];
    angular.forEach(list, function(item){
      //default variables
      var isEqual = true;
      for(var e in obj){
        //check if the item are the same
        if(item[e]!==obj[e]) {
          //is not equal, then change it to false
          isEqual = false;
        }
      }
      //if we found equal, then we push it to the results
      if(isEqual) {
        result.push(item);
      }
    });
    //return a list of result
    return result;
  };
}]);

'use strict';
angular.module('app').service('cache', ['$cookies', function($cookies){
    this.put = function(key, value){
      $cookies.put(key, value);
    };
    this.get = function(key) {
      return $cookies.get(key);
    };
    this.remove = function(key) {
      $cookies.remove(key);
    };
}]);
