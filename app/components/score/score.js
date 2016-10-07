/* global angular */
(function() {
  angular.module('goboardComponents')
         .component('goScore', {
           templateUrl: 'components/score/score.html',
           controllerAs: 'score',
           controller: function ScoreController(goboardState) {
             var score = this;
             score.blackScore = () => goboardState.score().black;
             score.whiteScore = () => goboardState.score().white;
             return score;
           }
         });
})();
