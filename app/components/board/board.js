/* global angular _ */
angular.module('goboardComponents')
  .component('board', {
    templateUrl: 'components/board/board.html',
    controller: function BoardController(goboardState) {
      var board = this;
      board.TOPO = { BOTTOM: 'bottom', RIGHT: 'right', LEFT: 'left', TOP: 'top', STAR: 'star' };

      board.$onInit = () => {
        if (board.size === undefined) board.size = 19;

        board.spaces = _.flatten(
          _.map(_.range(1, board.size + 1),
            (r) => _.map(_.range(1, board.size + 1),
                         (c) => {
                           return {
                             row: r,
                             column: c };
                         })));

        goboardState.clearBoard(board.spaces);
      };

      board.getTopology = (space) => {
        var topo = [];
        if (space.column === 1) topo.push(board.TOPO.LEFT);
        if (space.column === board.size) topo.push(board.TOPO.RIGHT);
        if (space.row === 1) topo.push(board.TOPO.TOP);
        if (space.row === board.size) topo.push(board.TOPO.BOTTOM);
        if (board.isStarPoint(space)) topo.push(board.TOPO.STAR);
        return topo;
      };

      board.isStarPoint = (space) => {
        var rowIndex = space.row; // Using 1 indexed not 0 indexed to keep the notation natural
        var colIndex = space.column;

        var edgeStars = [];
        if (board.size % 2 === 1 && board.size > 13) edgeStars.push(Math.ceil(board.size / 2)); // Odd boards have center points on the edges
        if (board.size % 2 === 0 && board.size > 13) { // Do something interesting with even boards... Not traditional
          edgeStars.push(Math.ceil(board.size / 2.5));
          edgeStars.push(board.size - Math.ceil(board.size / 2.5) + 1);
        }

        var lifeAndDeathNear = (board.size > 12) ? 4 : 3;
        // Off by one, go is played on fenceposts.
        var lifeAndDeathFar = (board.size - lifeAndDeathNear + 1);

        if (rowIndex === lifeAndDeathNear || rowIndex === lifeAndDeathFar) { // Left and right lines of life and death
          if (colIndex === lifeAndDeathNear) return true;
          if (colIndex === lifeAndDeathFar) return true;
          if (edgeStars.findIndex((i) => i === colIndex) > -1) return true;
        }

        if (colIndex === lifeAndDeathNear || colIndex === lifeAndDeathFar) { // Top and bottom lines of life and death
          if (edgeStars.findIndex((i) => i === rowIndex) > -1) return true;
        }

        if (board.size % 2 === 1) { // odd board size, center point
          if (rowIndex === Math.ceil(board.size / 2) && colIndex === Math.ceil(board.size / 2)) return true;
        } else if (board.size > 13) {
          if (edgeStars.findIndex((i) => i === rowIndex) > -1 &&
              edgeStars.findIndex((i) => i === colIndex) > -1) return true;
             // Just throw some stars around to match the edges.
        }

        return false;
      };

      return board;
    },
    controllerAs: 'board',
    bindings: {
      size: '<',
      spaces: '@'
    }
  });
