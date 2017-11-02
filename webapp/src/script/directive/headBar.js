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
