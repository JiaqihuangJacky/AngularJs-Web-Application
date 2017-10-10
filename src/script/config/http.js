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
