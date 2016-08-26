/* global angular _ Immutable firebase */
angular.module('goboardFactories')
  .factory('goboardState', function ($firebaseAuth, $firebaseArray, $rootScope, CONSTANTS, goboardLogic) {
    var state = {}
    var moves = []

    var blank_position = Immutable.Map()
    var last_position = Immutable.Map()

    var auth = $firebaseAuth();
    var signin = () => {
      try {
        auth.$signInAnonymously()
      } catch (err) {
        console.error(err)
        signin()
      }
    }
    signin()

    firebase.auth().onAuthStateChanged(function (user) {
      var ref = firebase.database().ref().child('development')
      moves = $firebaseArray(ref)

      $rootScope.$watchCollection(moves, () => {
        last_position = _.reduce(moves, (acc, move) => { return goboardLogic.applyMove(acc,move) }, blank_position)
      })

      moves.$watch(() => {
        last_position = _.reduce(moves, (acc, move) => { return goboardLogic.applyMove(acc,move) }, blank_position)
      })
    })

    state.lookupPiece = (space) => {
      return goboardLogic.lookupPiece(last_position, space)
    }

    state.placePiece = (space) => {
      var to_move = state.nextMove()

      var move = {time: new Date(), row: parseInt(space.row), column: parseInt(space.column), piece: to_move }
      if (!goboardLogic.moveIsValid(last_position, move)) return

      moves.$add(move)
      last_position = goboardLogic.applyMove(last_position, move)
    }

    state.clearBoard = (spaces) => {
      blank_position = Immutable.Map(
        _.reduce(spaces, (m, s) => { m[goboardLogic.moveKey(s)] = CONSTANTS.PIECE.EMPTY; return m }, {}))
      last_position = blank_position
      console.log('State is tracking ' + last_position.size + ' spaces')
    }

    state.blackToMove = () => state.nextMove() === CONSTANTS.PIECE.BLACK

    state.nextMove = () => moves.length % 2 === 0 ? CONSTANTS.PIECE.BLACK : CONSTANTS.PIECE.WHITE

    return state
  });
