/* global angular _ Immutable */
(function() {
  angular.module('goboardFactories')
  .factory('goboardState', function($rootScope, CONSTANTS, goboardLogic, firebaseSync) {
    var history = _([blankPosition]);
    var blankPosition;

    var state = {};
    var moves = [];

    firebaseSync.registerForMoves('development').then((registeredMoves) => {
      moves = registeredMoves;

      $rootScope.$watchCollection(moves, () => {
        history = _.reduce(moves, (acc, move) => {
          acc.push(goboardLogic.applyMove(acc.last(), move));
          return acc;
        }, _([blankPosition]));
      });

      moves.$watch(() => {
        history = _.reduce(moves, (acc, move) => {
          acc.push(goboardLogic.applyMove(acc.last(), move));
          return acc;
        }, _([blankPosition]));
      });
    });

    state.lookupPiece = (space) => {
      return goboardLogic.lookupPiece(history.last(), space);
    };

    state.placePiece = (space) => {
      var toMove = state.nextMove();

      var move = {time: new Date(), row: parseInt(space.row), column: parseInt(space.column), piece: toMove };
      if (!goboardLogic.moveIsValid(history, move)) return;

      moves.$add(move);
      history.push(goboardLogic.applyMove(history.last(), move));
    };

    state.clearBoard = (spaces) => {
      blankPosition = Immutable.Map(
        _.reduce(spaces, (m, s) => { m[goboardLogic.moveKey(s)] = CONSTANTS.PIECE.EMPTY; return m; }, {}));
      history = _([blankPosition]);
    };

    state.blackToMove = () => state.nextMove() === CONSTANTS.PIECE.BLACK;

    state.nextMove = () => moves.length % 2 === 0 ? CONSTANTS.PIECE.BLACK : CONSTANTS.PIECE.WHITE;

    state.undo = () => {
      if (history.size() <= 1) return;
      moves.$remove(moves[moves.length - 1]);
      history.pop();
    };

    return state;
  });
})();
