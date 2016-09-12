/* globals angular */
(function () {
  angular.module('foreignModules', []);
  angular.module('foreignModules')
         .factory('firebaseSync', function ($q) {
           var deferred = $q.defer();
           deferred.resolve([]);
           return {
             registerForMoves: deferred.promise
           };
         });
})();

