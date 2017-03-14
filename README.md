# sendToKodi chrome

:tv: sendToKodi Google Chrome Extension let's you send almost every video from chrome to kodi.

- supported [sites](https://rg3.github.io/youtube-dl/supportedsites.html)
- if you send a playlist it will automatically create a playlist and starts playing

## Requirement

You need to install our SendToKodi plugin:
[plugin.video.sendtokodi](https://github.com/firsttris/plugin.video.sendtokodi)

Since we are using [youtube-dl](https://github.com/rg3/youtube-dl) in there is no other plugin dependency.
Your are basically playing raw streams in Kodi

## Stack
Chrome Extensions uses
- [Webpack](https://webpack.github.io/)
- [Buble](https://buble.surge.sh/)
- [VueJs](https://github.com/vuejs/vue)
- [Bootstraps](https://github.com/twbs/bootstrap)

## Development

1. Clone
2. Install [yarn](https://yarnpkg.com): `npm install -g yarn`.
3. Run `yarn`.
4. Change the package's name and description on `package.json`.
5. Change the name of your extension on `src/manifest.json`.
6. Run `npm run start`
7. Load your extension on Chrome following:
    1. Access `chrome://extensions/`
    2. Check `Developer mode`
    3. Click on `Load unpacked extension`
    4. Select the `build` folder.
8. Have fun.

## Sources
I forked this boilerplate and added Buble, VueJs, Bootstraps   
[chrome-extension-webpack-boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate)  
Samuel Simões ~ [@samuelsimoes](https://twitter.com/samuelsimoes) ~ [Blog](http://blog.samuelsimoes.com/)