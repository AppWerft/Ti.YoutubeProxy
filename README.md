###Ti.YoutubeProxy###

Some useful tools to realize a youtube API. It is a fork of Matthias Benkorts awesome  module with some extension to walk thru youtube 

####Usage####
```javasacript
Ti.App.Properties.setString('GOOGLEAPIKEY','1234567890abcdef');

var YT = require('ti.youtubeproxy');
YT.getPlaylistsByChannelId('abcd').then(function(_res) {
    console.log(_res);
});


var player = Ti.Media.createMediaPlayer({/*some pretty properties*/});
YT.getUrlById('youtubeid')then(function(_url){
    player.setUrl(_url);
});


```