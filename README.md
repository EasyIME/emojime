Emoji Input Method Editor
=============
The 'real' input method editor of Emoji on windows. Implement by [emojione](http://emojione.com/), [PIME](https://github.com/EasyIME/PIME), [NIME](https://github.com/EasyIME/NIME).


#### Node

- Node v4.x 32 bit (Must be 32 bit.)
- Install [node-gyp](https://github.com/nodejs/node-gyp) dependecise for c binding through [node-ffi](https://github.com/node-ffi/node-ffi). Please see [node-gyp document](https://github.com/nodejs/node-gyp#installation) to setup your environment.


#### Development

Now NIME doesn't has it own installation, so we use PIME for development `emojime`.

- Prepare Node v4.x environment.
- Install [PIME](https://github.com/EasyIME/PIME/releases) v0.09
- Kill `PIMELauncher.exe` process
- Kill `pythonw.exe` process
- `npm i`
- `npm start`


#### Input method rule

It is following [emojione codes](http://emoji.codes/).

`:rocket:` => 🚀
`:heart:` => ❤️
`:relaxed` => ☺️


## Reference

- [PIME](https://github.com/EasyIME/PIME)
- [Virtual-Key Codes](https://msdn.microsoft.com/zh-tw/library/windows/desktop/dd375731%28v=vs.85%29.aspx)
- [NIME](https://github.com/EasyIME/NIME)
- [emojione](http://emojione.com/)
