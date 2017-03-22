# SendToKodi

:tv: send almost every video from chrome to kodi with SendToKodi

- supported [sites](https://rg3.github.io/youtube-dl/supportedsites.html)
- if you send a playlist it will automatically create a playlist and starts playing

## Requirements

To use this extension your need to install SendToKodi Addon in Kodi
[plugin.video.sendtokodi](https://github.com/firsttris/plugin.video.sendtokodi)

Since we are using [youtube-dl](https://github.com/rg3/youtube-dl) in there is no other plugin dependency.
Your are basically playing raw streams in Kodi

## Install
[Go to Chrome Webstore](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)

## Development

1. Clone
2. Install [yarn](https://yarnpkg.com): `npm install -g yarn`
3. Run `yarn`
6. Run `npm run start`
7. Load your extension on Chrome following:
    1. Access `chrome://extensions/`
    2. Check `Developer mode`
    3. Click on `Load unpacked extension`
    4. Select the `build` folder

#### Chrome-Extension Stack
- [Webpack](https://webpack.github.io/)
- [Buble](https://buble.surge.sh/)
- [VueJs](https://github.com/vuejs/vue)
- [Bootstraps](https://github.com/twbs/bootstrap)

#### Sources
I forked this boilerplate from [chrome-extension-webpack-boilerplate](https://github.com/samuelsimoes/chrome-extension-webpack-boilerplate)