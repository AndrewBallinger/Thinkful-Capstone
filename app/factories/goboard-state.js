/* global angular _ Immutable */
angular.module('goboardFactories')
  .factory('goboardState', function(CONSTANTS, goboardLogic) { 
    var state = {};
    
    var moves = [];
    var to_move = CONSTANTS.PIECE.BLACK;
    var last_position = Immutable.Map();

    state.lookupPiece = (space) => {
      return goboardLogic.lookupPiece(last_position, space);
    }

    state.placePiece = (space) => {
      var move = {time: new Date(), row: parseInt(space.row), column: parseInt(space.column), piece: to_move };
      if ( !goboardLogic.moveIsValid(last_position, move) ) return;

      to_move = (to_move === CONSTANTS.PIECE.BLACK) ? CONSTANTS.PIECE.WHITE : CONSTANTS.PIECE.BLACK;

      last_position = goboardLogic.applyMove(last_position, move);
      moves.push(moves);
    }

    state.clearBoard = (spaces) => {
      moves = [];
      to_move = CONSTANTS.PIECE.BLACK;
      last_position = Immutable.Map(
        _.reduce(spaces, (m, s) => { m[goboardLogic.moveKey(s)] = CONSTANTS.PIECE.EMPTY; return m }, {} ));
      console.log("State is tracking " + last_position.size + " spaces");
    }
    
    state.blackToMove = () => to_move === CONSTANTS.PIECE.BLACK;

    return state;
  });
