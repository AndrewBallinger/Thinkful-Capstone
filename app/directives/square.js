/* global angular */
angular.module('goboardDirectives')
  .directive('square', ($window) => {
    return {
      link: (scope, element) => {
        var resize = () => {
          var targetWidth = element.attr('width') || '100%';
          var targetHeight = element.attr('height') || '100%';
          element.css({ 'width': targetWidth, 'height': targetHeight });
          var width = element.prop('offsetWidth');
          var height = element.prop('offsetHeight');
          if (width > height) {
            element.css('width', height + 'px');
            element.css('height', height + 'px');
          } else {
            element.css('height', width + 'px');
            element.css('width', width + 'px');
          }
        };

        resize();
        angular.element($window).on('resize', resize);
        scope.$on('$destroy', () => angular.element($window).off('resize', resize));
      }};
  });
