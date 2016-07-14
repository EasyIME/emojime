'use strict';

let emojione = require('emojione');
let debug    = require('debug')('nime:emojime:reducer');

function reduceOnKeyDown(request, preState) {

  let {keyCode, charCode, seqNum} = request;
  let {compositionString, compositionCursor} = preState;

  if (compositionString === '' && charCode === ':'.charCodeAt(0)) {
    return Object.assign({}, preState, {
      action: 'UPDATE_STRING',
      compositionString: ':',
      compositionCursor: 1
    });
  }

  if (compositionString !== '') {
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

    } else if (
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
