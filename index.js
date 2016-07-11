// Copyright (C) 2016 Chun Wei Li (Lee) <jessy1092@gmail.com>
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

'use strict';

let emojione = require('emojione');


function respOnFilterKeyDown(request, state) {

  let {charCode, seqNum} = request;
  let {compositionString} = state;

  let response = {
    return: false,
    success: true,
    seqNum
  };

  if (compositionString !== '' || charCode === ':'.charCodeAt(0)) {
    response['return'] = true;
  }

  return response;
}

function respOnKeyDown(request, state) {

  let {keyCode, seqNum} = request;

  let response = {
    success: true,
    return: true,
    seqNum
  };

  if (state['action'] === 'UPDATE_STRING') {
    response['compositionString'] = state['compositionString'];
    response['compositionCursor'] = state['compositionCursor'];
    return response;
  }

  if (state['action'] === 'COMMIT_STRING') {
    response['commitString']      = state['commitString'];
    response['compositionString'] = state['compositionString'];
    return response;
  }

  return response;

}

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

      console.log('Get emoji short name');
      console.log(emojikey);
      console.log(emojione.shortnameToUnicode(emojikey));
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
  textReducer(request, preState) {

    if (request['method'] === 'init') {
      return Object.assign({}, preState, {
        action: '',
        compositionString: '',
        compositionCursor: 0,
        showCandidates: false
      });
    }

    if (request['method'] === 'onKeyDown') {
      return reduceOnKeyDown(request, preState);
    }

    if (request['method'] === 'onCompositionTerminated') {
      return reduceOnCompositionTerminated(request, preState);
    }
    return preState;
  },

  response(request, state) {
    if (request['method'] === 'filterKeyDown') {
      return respOnFilterKeyDown(request, state);

    } else if (request['method'] === 'onKeyDown') {
      return respOnKeyDown(request, state);
    }
    return {success: true, seqNum: request['seqNum']};
  }
}
