/* global angular _ Immutable */
angular.module('goboardFactories')
  .factory('goboardState', function() { 
    var state = {};
    
    //TODO move this lib out and inject it, for now I'm still working out separation of concerns for it.
    var lib = {}; 
    
    state.PIECE = { BLACK: "BLACK", WHITE: "WHITE", EMPTY: "EMPTY" };
    state.SCORE = "SCORE";

    var moves = [];
    var to_move = state.PIECE.BLACK;
    var last_position = Immutable.Map();

    lib.moveKey = (move) => {
      return '' + ( String.fromCharCode(64 + parseInt(move.row)) + move.column ) ;
    }

    lib.maybeConvertAddress = (position, address) => { address.piece = position.get(lib.moveKey(address), false); return address } ;
    
    lib.getNeighbors = (position, move) => {
      var neighbors = [];
      var top    = {row: move.row - 1, column: move.column + 0};
      var left   = {row: move.row + 0, column: move.column - 1};
      var right  = {row: move.row + 0, column: move.column + 1};
      var bottom = {row: move.row + 1, column: move.column - 0};

      [top,left,right,bottom] = [top,left,right,bottom].map((a) => lib.maybeConvertAddress(position, a));
      
      if (top.piece)    neighbors.push(top);
      if (left.piece)   neighbors.push(left);
      if (right.piece)  neighbors.push(right);
      if (bottom.piece) neighbors.push(bottom);
      return neighbors;
    }

    lib.findKills = (position, move) => {
      var neighbors = lib.getNeighbors(position, move);
      var deaths = _.reduce( neighbors.map((n) => lib.findDeaths({}, position, n)),
                            (a,b) => angular.merge(a, b),
                             {});
      deaths = _.pick(deaths, (d) => d.piece !== move.piece);
      return deaths;
    }
    
    lib.applyLifeAndDeath = (position, move) => {
      var deaths = lib.findKills(position, move);

      if (_.keys(deaths).length == 0) return position;
      
      console.log("Found deaths: " + _.keys(deaths));
      
      
      var removed_white_pieces = _.keys(_.filter(deaths, (d) => d.piece === state.PIECE.WHITE)).length;
      var removed_black_pieces = _.keys(_.filter(deaths, (d) => d.piece === state.PIECE.BLACK)).length;
      var old_score = position.get(state.SCORE, { white: 0, black:0 });
      var new_score = { white: old_score.white + removed_black_pieces, black: old_score.black + removed_white_pieces };

      position = position.set(state.SCORE, new_score);
      deaths = _.reduce(_.keys(deaths), (acc, key) => { acc[key] = state.PIECE.EMPTY; return acc }, {});
      return position.merge(deaths);
    }

    lib.findDeaths = (group, position, move) => {
      group[lib.moveKey(move)] =  move;
      
      var neighbors = lib.getNeighbors(position, move);
      for (let neighbor of neighbors) {
        if (neighbor.piece === state.PIECE.EMPTY) {
          return {};
        }

        if (!group[lib.moveKey(neighbor)]) {
          if (neighbor.piece === move.piece) {
            var deaths = lib.findDeaths(group, position, neighbor);
            if (_.keys(deaths).length == 0) return {};
          } 
        }
      }
      
      return group;
    }
    
    lib.applyMove = (position, move) => {
      var key = lib.moveKey(move);
      console.log("Applying move for " + key );

      if (position.get(key) === state.PIECE.EMPTY) {
        var new_position = position.set(key, move.piece);
      }

      new_position = lib.applyLifeAndDeath(new_position, move);
      return new_position;
    }

    lib.moveIsValid = (position, move) => {
      if (lib.lookupPiece(position, move) !== state.PIECE.EMPTY) return false; //No playing over an opponents pieces
      
      var potential_position = position.set(lib.moveKey(move), move.piece);

      var kills = _.keys(lib.findKills(potential_position, move));
      var potential_suicides = _.keys(lib.findDeaths({}, potential_position, move)).length;

      if (potential_suicides > 0) {
        if (kills.length == 0) {
          return false; //No suicides without capture
        }
      }

      return true;
    }

    lib.lookupPiece = (position, space) => {
      return position.get(lib.moveKey(space));
    }
    
    state.lookupPiece = (space) => {
      return lib.lookupPiece(last_position, space);
    }

    state.placePiece = (space) => {
      var move = {time: new Date(), row: parseInt(space.row), column: parseInt(space.column), piece: to_move };
      if ( !lib.moveIsValid(last_position, move) ) return;

      to_move = (to_move === state.PIECE.BLACK) ? state.PIECE.WHITE : state.PIECE.BLACK;

      last_position = lib.applyMove(last_position, move);
      moves.push(moves);
    }

    state.clearBoard = (spaces) => {
      moves = [];
      to_move = state.PIECE.BLACK;
      last_position = Immutable.Map(
        _.reduce(spaces, (m, s) => { m[lib.moveKey(s)] = state.PIECE.EMPTY; return m }, {} ));
      console.log("State is tracking " + last_position.size + " spaces");
    }
    
    state.blackToMove = () => to_move === state.PIECE.BLACK;

    return state;
  });
