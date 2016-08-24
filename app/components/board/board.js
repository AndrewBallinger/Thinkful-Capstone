/*global angular _*/
angular.module('goboardComponents')
  .component('board', { 
    templateUrl: 'components/board/board.html',
    controller: function BoardController() {
      var board = this;
      var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
      
      board.$onInit = () => {
        if (board.size === undefined) board.size = 17;

        board.spaces = _.flatten(
          _.map(letters.slice(0, board.size),
            (letter) => _.map( _.range(1, board.size + 1),
              (number) =>  { return { row: letter, column: number }})));
        
        console.log("Size " + board.size + " board initialized") };

      return board;
    },
    controllerAs: "board",
    bindings: {
      size: "<",
      spaces: "@"
    }
  });
