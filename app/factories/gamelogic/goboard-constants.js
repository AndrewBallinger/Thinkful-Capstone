/* global angular */
angular.module('goboardFactories')
  .factory('CONSTANTS', function() {
    var CONSTANTS = {};
    CONSTANTS.PIECE = { BLACK: 'BLACK', WHITE: 'WHITE', EMPTY: 'EMPTY' };
    CONSTANTS.SCORE = 'SCORE';
    return CONSTANTS;
  });
