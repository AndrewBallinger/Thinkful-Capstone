/* globals angular */
(function() {
  angular.module('foreignModules', []);
  angular.module('foreignModules')
         .factory('firebaseSync', function($q, $rootScope) {
           var deferred = $q.defer();
           var mockResult = [];
           mockResult.$watch = (args) => $rootScope.$watch(mockResult, args);

           deferred.resolve(mockResult);
           return {
             registerForMoves: () => deferred.promise
           };
         });
})();

