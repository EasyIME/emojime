'use strict';

let emojione = require('emojione');
let KEYCODE  = require('nime/lib/keyCodes');
let debug    = require('debug')('nime:emojime:reducer');

function reduceOnKeyDown(request, preState) {

  let {keyCode, charCode, seqNum} = request;
  let {compositionString, compositionCursor} = preState;

  // Start input
  if (compositionString === '' && charCode === ':'.charCodeAt(0)) {
    return Object.assign({}, preState, {
      action: 'UPDATE_STRING',
      compositionString: ':',
      compositionCursor: 1
    });
  }

  if (compositionString !== '') {

    // Move cursor left
    if (keyCode === KEYCODE.VK_LEFT) {
      if (compositionCursor > 0) {
        return Object.assign({}, preState, {
          action: 'UPDATE_STRING',
          compositionCursor: compositionCursor - 1
        });
      }
      return Object.assign({}, preState, {action: ''});
    }

    // Move cursor right
    if (keyCode === KEYCODE.VK_RIGHT) {
      if (compositionCursor < compositionString.length) {
        return Object.assign({}, preState, {
          action: 'UPDATE_STRING',
          compositionCursor: compositionCursor + 1
        });
      }
      return Object.assign({}, preState, {action: ''});
    }

    // Exist composition mode
    if (keyCode === KEYCODE.VK_ESCAPE) {
      return Object.assign({}, preState, {
        action: 'UPDATE_STRING',
        compositionString: '',
        compositionCursor: 0
      });
    }

    if (charCode === ':'.charCodeAt(0)) {
      let emojikey = compositionString + ':';

      debug('Get emoji short name');
      debug(emojikey);
      debug(emojione.shortnameToUnicode(emojikey));
      return Object.assign({}, preState, {
        action: 'COMMIT_STRING',
        commitString: emojione.shortnameToUnicode(emojikey),
        compositionString: '',
        compositionCursor: 0
      });

    }

    if (
      (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)) ||
      (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0))) {

      return Object.assign({}, preState, {
        action: 'UPDATE_STRING',
        compositionString: compositionString + String.fromCharCode(charCode),
        compositionCursor: compositionCursor + 1
      });
    }
  }

  return preState;
}

function reduceOnCompositionTerminated(request, preState) {
  return Object.assign({}, preState, {
    commitString: '',
    compositionString: '',
    compositionCursor: 0
  });
}

module.exports = {
  reduceOnKeyDown,
  reduceOnCompositionTerminated
};
