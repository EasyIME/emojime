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

let nime = require('nime');
let KEYCODE = require('nime/lib/keyCodes');
let emojione = require('emojione');

let server = nime.createServer();

server.on('connection', (service) => {

  let candidateList = [];
  let showCandidates = false;
  let compositionString = '';
  let compositionCursor = 0;

  service.on('filterKeyDown', (msg, keyHandler) => {

    console.log('custom filterKeyDown');

    let charCode = keyHandler.charCode;
    let seqNum = msg['seqNum'];

    let response = {
      'return': false
    };

    if (compositionString !== '' || charCode === ':'.charCodeAt(0)) {
      response['return'] = true;
    }

    service.writeSuccess(seqNum, response);
  });

  service.on('onKeyDown', (msg, keyHandler) => {
    console.log('custom onKeyDown');

    let keyCode = keyHandler.keyCode;
    let charCode = keyHandler.charCode;
    let seqNum = msg['seqNum'];

    let response = {
      'return': true
    };

    if (compositionString === '' && charCode === ':'.charCodeAt(0)) {
      compositionString = ':';
      compositionCursor = 1;

      response['compositionString'] = compositionString;
      response['compositionCursor'] = compositionCursor;

    } else if (compositionString !== '') {

      if (charCode === ':'.charCodeAt(0)) {
        let emojikey = compositionString + ':';
        compositionString = '';
        compositionCursor = 0;

        console.log('Get emoji short name');
        console.log(emojikey);
        console.log(emojione.shortnameToUnicode(emojikey));
        response['commitString'] = emojione.shortnameToUnicode(emojikey);
        response['compositionString'] = '';

      } else if (
        (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)) ||
        (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0))) {

        compositionString += String.fromCharCode(charCode);
        compositionCursor += 1;
      }
      response['compositionString'] = compositionString;
      response['compositionCursor'] = compositionCursor;

    }
    service.writeSuccess(seqNum, response);
  });
});

server.listen();
