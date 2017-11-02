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
