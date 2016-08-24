/*global angular _*/
angular.module('goboardFactories')
  .factory('goboardState', function() { 
    var state = {};
    state.PIECE = { BLACK: "BLACK", WHITE: "WHITE", EMPTY: "EMPTY" };

    var moves = [];
    var to_move = state.PIECE.BLACK;

    state.lookupPiece = (space) => {
      var match =_.filter(moves, (move) => (move.row == space.row && move.column == space.column));
      if (match.length == 0) return state.PIECE.EMPTY;
      return match[0].piece;
    }

    state.placePiece = (space) => {
      moves.push({time: new Date(), row: space.row, column: space.column, piece: to_move });
      to_move = (to_move === state.PIECE.BLACK) ? state.PIECE.WHITE : state.PIECE.BLACK;
    }

    state.blackToMove = () => to_move === state.PIECE.BLACK;

    return state;
  });
