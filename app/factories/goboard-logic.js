/* global angular _ Immutable */
angular.module('goboardFactories')
  .factory('goboardLogic', function(CONSTANTS) {
    var goboardLogic = {};

    goboardLogic.moveKey = (move) => {
      return '' + ( String.fromCharCode(64 + parseInt(move.row)) + move.column ) ;
    }

    goboardLogic.maybeConvertAddress = (position, address) => {
      if (position == undefined) {
        debugger
      };
      address.piece = position.get(goboardLogic.moveKey(address), false);
      return address
    } ;

    goboardLogic.getNeighbors = (position, move) => {
      var neighbors = [];
      var top    = {row: move.row - 1, column: move.column + 0};
      var left   = {row: move.row + 0, column: move.column - 1};
      var right  = {row: move.row + 0, column: move.column + 1};
      var bottom = {row: move.row + 1, column: move.column - 0};

      [top,left,right,bottom] = [top,left,right,bottom].map((a) => goboardLogic.maybeConvertAddress(position, a));

      if (top.piece)    neighbors.push(top);
      if (left.piece)   neighbors.push(left);
      if (right.piece)  neighbors.push(right);
      if (bottom.piece) neighbors.push(bottom);
      return neighbors;
    }

    goboardLogic.findKills = (position, move) => {
      var neighbors = goboardLogic.getNeighbors(position, move);
      var deaths = _.reduce( neighbors.map((n) => goboardLogic.findDeaths({}, position, n)),
                            (a,b) => angular.merge(a, b),
                             {});
      deaths = _.pick(deaths, (d) => d.piece !== move.piece);
      return deaths;
    }

    goboardLogic.applyLifeAndDeath = (position, move) => {
      var deaths = goboardLogic.findKills(position, move);

      if (_.keys(deaths).length == 0) return position;

      console.log("Found deaths: " + _.keys(deaths));


      var removed_white_pieces = _.keys(_.filter(deaths, (d) => d.piece === CONSTANTS.PIECE.WHITE)).length;
      var removed_black_pieces = _.keys(_.filter(deaths, (d) => d.piece === CONSTANTS.PIECE.BLACK)).length;
      var old_score = position.get(CONSTANTS.SCORE, { white: 0, black:0 });
      var new_score = { white: old_score.white + removed_black_pieces, black: old_score.black + removed_white_pieces };

      position = position.set(CONSTANTS.SCORE, new_score);
      deaths = _.reduce(_.keys(deaths), (acc, key) => { acc[key] = CONSTANTS.PIECE.EMPTY; return acc }, {});
      return position.merge(deaths);
    }

    goboardLogic.findDeaths = (group, position, move) => {
      group[goboardLogic.moveKey(move)] =  move;

      var neighbors = goboardLogic.getNeighbors(position, move);
      for (let neighbor of neighbors) {
        if (neighbor.piece === CONSTANTS.PIECE.EMPTY) {
          return {};
        }

        if (!group[goboardLogic.moveKey(neighbor)]) {
          if (neighbor.piece === move.piece) {
            var deaths = goboardLogic.findDeaths(group, position, neighbor);
            if (_.keys(deaths).length == 0) return {};
          }
        }
      }

      return group;
    }

    goboardLogic.applyMove = (position, move) => {
      var key = goboardLogic.moveKey(move);
      console.log("Applying move for " + key );
      
      if (position.get(key) === CONSTANTS.PIECE.EMPTY) {
        position = position.set(key, move.piece);
       } else {
          return position;
        }

      position = goboardLogic.applyLifeAndDeath(position, move);
      return position;
    }

   goboardLogic.moveIsValid = (position, move) => {
      if (goboardLogic.lookupPiece(position, move) !== CONSTANTS.PIECE.EMPTY) return false; //No playing over an opponents pieces

      var potential_position = position.set(goboardLogic.moveKey(move), move.piece);

      var kills = _.keys(goboardLogic.findKills(potential_position, move));
      var potential_suicides = _.keys(goboardLogic.findDeaths({}, potential_position, move)).length;

      if (potential_suicides > 0) {
        if (kills.length == 0) {
          return false; //No suicides without capture
        }
      }

      return true;
    }

    goboardLogic.lookupPiece = (position, space) => {
      return position.get(goboardLogic.moveKey(space));
    }

    return goboardLogic;
  });