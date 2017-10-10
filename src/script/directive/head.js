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
