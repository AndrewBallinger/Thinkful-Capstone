/* global angular */
angular.module('goboardComponents')
  .component('space', {
    templateUrl: 'components/space/space.html',
    require: '^^board',
    scope: true,
    controller: function SpaceController($scope, goboardState, CONSTANTS) {
      var space = this;
      space.piece = () => {
        switch (goboardState.lookupPiece(this)) {
          case CONSTANTS.PIECE.BLACK:
            return 'black';
          case CONSTANTS.PIECE.WHITE:
            return 'white';
          default:
            return '';
        }
      };

      space.handleClick = () => {
        goboardState.placePiece(this);
      };

      return space;
    },
    controllerAs: 'space',
    bindings: {
      row: '@',
      column: '@',
      piece: '@'
    }
  });
