/* global angular */
angular.module('goboardControllers')
  .controller('gameController', ['goboardState', function(goboardState) {
    var game = this;
    game.turn = () => goboardState.blackToMove() ? 'blacks-turn' : 'whites-turn';
    return game;
  }]);
