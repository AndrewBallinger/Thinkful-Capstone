/* global angular */
(function() {
  angular.module('goboardComponents')
         .component('goControls', {
           templateUrl: 'components/controls/controls.html',
           controllerAs: 'controls',
           controller: function ControlsController(goboardState) {
             var controls = this;
             controls.undo = goboardState.undo;
             return controls;
           }
         });
})();
