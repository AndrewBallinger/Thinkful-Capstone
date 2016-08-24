/* global angular */
angular.module('goboardDirectives')
  .directive('square', ($window) => { return {
    link: (scope, element) => {
      var resize = () => {

        var target_width = element.attr('width') || "100%";
        var target_height = element.attr('height') || "100%";
        element.css({ 'width': target_width, "height": target_height });
        var width = element.prop('offsetWidth');
        var height = element.prop('offsetHeight');
        if (width > height) {
          element.css('width',   height + "px");
          element.css('height',  height + "px");
        } else {
          element.css('height', width + "px");
          element.css('width',  width + "px");
        }
      }

      resize();
      angular.element($window).on('resize', resize);
      scope.$on('$destroy', () => angular.element($window).off('resize', resize)); }}});
