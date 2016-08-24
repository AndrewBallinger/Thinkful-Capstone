/*global angular */
angular.module('goboardComponents')
  .component('space', { 
    templateUrl: 'components/space/space.html',
    require: '^^board',
    scope: true,
    controller: function SpaceController() {
      var space = this;

      return space;
    },
    controllerAs: "space",
    bindings: {
      row: "@",
      column: "@"
    }
  });
