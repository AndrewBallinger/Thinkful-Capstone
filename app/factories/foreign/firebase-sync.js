/* global angular firebase */
(function () {
  angular.module('foreignModules')
         .factory('firebaseSync', function ($firebaseAuth, $firebaseArray, $q) {
           var sync = {};
           var queuedRegistrants = [];

           var auth = $firebaseAuth();
           var ref;
           var signin = () => {
             try {
               auth.$signInAnonymously();
             } catch (err) {
               console.error(err);
               signin();
             }
           };

           firebase.auth().onAuthStateChanged(function (user) {
             ref = firebase.database().ref();
             for (var registrant of queuedRegistrants) {
               registrant.resolve(ref);
             }
           });

           signin();

           sync.registerForMoves = (gameId) => {
             var deferred = $q.defer();
             var promise = deferred.promise;
             promise = promise.then((ref) => $firebaseArray(ref.child(gameId)));

             if (ref) {
               deferred.resolve(ref);
             } else {
               queuedRegistrants.push(deferred);
             }

             return promise;
           };

           return sync;
         });
})();
