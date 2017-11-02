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
