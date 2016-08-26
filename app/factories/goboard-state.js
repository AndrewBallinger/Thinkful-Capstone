/* global angular _ Immutable firebase */
angular.module('goboardFactories')
  .factory('goboardState', function($firebaseAuth, $firebaseArray, $rootScope, CONSTANTS, goboardLogic) { 
    var state = {};
    var moves = [];

    var to_move = CONSTANTS.PIECE.BLACK;
    var blank_position = Immutable.Map();
    var last_position = Immutable.Map();

    var auth = $firebaseAuth();
    var signin = () => (auth.$signInAnonymously().catch((err) => { console.error(err); signin()}));
    signin();
    
    firebase.auth().onAuthStateChanged( function(user) {
      var ref = firebase.database().ref().child("development");
      moves = $firebaseArray(ref);

      $rootScope.$watchCollection(moves, () => {
        last_position = _.reduce(moves, (acc, move) => { return goboardLogic.applyMove(acc,move) }, blank_position);
      });
      
    });

    state.lookupPiece = (space) => {
      return goboardLogic.lookupPiece(last_position, space);
    }

    state.placePiece = (space) => {
      var move = {time: new Date(), row: parseInt(space.row), column: parseInt(space.column), piece: to_move };
      if ( !goboardLogic.moveIsValid(last_position, move) ) return;

      to_move = (to_move === CONSTANTS.PIECE.BLACK) ? CONSTANTS.PIECE.WHITE : CONSTANTS.PIECE.BLACK;
      moves.$add(move);
      last_position = goboardLogic.applyMove(last_position, move);
    }
    
    state.clearBoard = (spaces) => {
      to_move = CONSTANTS.PIECE.BLACK;
      blank_position = Immutable.Map(
        _.reduce(spaces, (m, s) => { m[goboardLogic.moveKey(s)] = CONSTANTS.PIECE.EMPTY; return m }, {} ));
      last_position = blank_position;
      console.log("State is tracking " + last_position.size + " spaces");
    }
    
    state.blackToMove = () => to_move === CONSTANTS.PIECE.BLACK;



    return state;
  });
