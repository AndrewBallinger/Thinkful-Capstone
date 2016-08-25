/*global angular _*/
angular.module('goboardComponents')
  .component('board', { 
    templateUrl: 'components/board/board.html',
    controller: function BoardController() {
      var board = this;
      var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
      board.TOPO = { BOTTOM: 'bottom', RIGHT: 'right', LEFT: 'left', TOP: 'top', STAR: 'star'  };
      
      board.$onInit = () => {
        if (board.size === undefined) board.size = 19;

        board.spaces = _.flatten(
          _.map(letters.slice(0, board.size),
            (letter) => _.map( _.range(1, board.size + 1),
              (number) =>  { return {
                row: letter,
                column: number }})));

        console.log("Size " + board.size + " board initialized") };

      board.getTopology = (space) => {
        var topo = [];
        if (space.column === 1) topo.push(board.TOPO.LEFT);
        if (space.column === board.size) topo.push(board.TOPO.RIGHT);
        if (space.row === "A") topo.push(board.TOPO.TOP); 
        if (space.row === letters.slice(0, board.size)[board.size-1]) topo.push(board.TOPO.BOTTOM);
        if (board.isStarPoint(space)) topo.push(board.TOPO.STAR);
        return topo;
      }

      board.isStarPoint = (space) => {
        var row_index = letters.findIndex((l) => l === space.row) + 1; //Using 1 indexed not 0 indexed to keep the notation natural
        var col_index = space.column;

        var edge_stars = [];
        if (board.size % 2 == 1 && board.size > 13) edge_stars.push(Math.ceil(board.size / 2)); //Odd boards have center points on the edges
        if (board.size % 2 == 0 && board.size > 13) { //Do something interesting with even boards... Not traditional
          edge_stars.push(Math.ceil(board.size / 2.5)); 
          edge_stars.push(board.size - Math.ceil(board.size / 2.5) + 1); 
        }

        var life_and_death_near = (board.size > 12) ? 4 : 3
        var life_and_death_far  = (board.size - life_and_death_near + 1) //Off by one, go is played on fenceposts.

        if (row_index == life_and_death_near || row_index == life_and_death_far) { //Left and right lines of life and death
          if (col_index == life_and_death_near)     return true;
          if (col_index == life_and_death_far)      return true;
          if (edge_stars.findIndex((i) => i === col_index) > -1) return true;
        }

        if (col_index == life_and_death_near || col_index == life_and_death_far) { //Top and bottom lines of life and death
          if (edge_stars.findIndex((i) => i === row_index) > -1) return true;
        }

        if (board.size % 2 == 1) { //odd board size, center point
          if (row_index == Math.ceil( board.size / 2 ) && col_index == Math.ceil(board.size / 2)) return true;
        } else if (board.size > 13) {
          if (edge_stars.findIndex((i) => i === row_index) > -1 &&
              edge_stars.findIndex((i) => i === col_index) > -1 ) return true; //Just throw some stars around to match the edges.
        }

        return false;
      }
      
      return board;
    },
    controllerAs: "board",
    bindings: {
      size: "<",
      spaces: "@"
    }
  });
