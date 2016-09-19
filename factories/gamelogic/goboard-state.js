/* global angular _ Immutable */
(function() {
  angular.module('goboardFactories')
  .factory('goboardState', function($rootScope, CONSTANTS, goboardLogic, firebaseSync) {
    var lastPosition;
    var blankPosition;

    var state = {};
    var moves = [];

    firebaseSync.registerForMoves('development').then((registeredMoves) => {
      moves = registeredMoves;

      $rootScope.$watchCollection(moves, () => {
        lastPosition = _.reduce(moves, (acc, move) => { return goboardLogic.applyMove(acc, move); }, blankPosition);
      });

      moves.$watch(() => {
        lastPosition = _.reduce(moves, (acc, move) => { return goboardLogic.applyMove(acc, move); }, blankPosition);
      });
    });

    state.lookupPiece = (space) => {
      return goboardLogic.lookupPiece(lastPosition, space);
    };

    state.placePiece = (space) => {
      var toMove = state.nextMove();

      var move = {time: new Date(), row: parseInt(space.row), column: parseInt(space.column), piece: toMove };
      if (!goboardLogic.moveIsValid(lastPosition, move)) return;

      moves.$add(move);
      lastPosition = goboardLogic.applyMove(lastPosition, move);
    };

    state.clearBoard = (spaces) => {
      blankPosition = Immutable.Map(
        _.reduce(spaces, (m, s) => { m[goboardLogic.moveKey(s)] = CONSTANTS.PIECE.EMPTY; return m; }, {}));
      lastPosition = blankPosition;
      console.log('State is tracking ' + lastPosition.size + ' spaces');
    };

    state.blackToMove = () => state.nextMove() === CONSTANTS.PIECE.BLACK;

    state.nextMove = () => moves.length % 2 === 0 ? CONSTANTS.PIECE.BLACK : CONSTANTS.PIECE.WHITE;

    state.undo = () => {
      moves.$remove(moves[moves.length - 1]);
    };

    return state;
  });
})();
