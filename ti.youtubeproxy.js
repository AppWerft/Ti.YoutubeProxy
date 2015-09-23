var HTTPRequest = require('./lib/ts.httprequest/ts.httprequest');
var VideoProvider = require('./lib/ts.videoprovider/ts.videoprovider');
var Promise = require('./lib/org.favo.promise');

var GOOGLEAPIKEY = Ti.App.Properties.getString('GOOGLEAPIKEY');
const ENDPOINT = 'https://www.googleapis.com/youtube/v3/';

var _getPlaylistsByChannelId = function(channelid) {
	var defer = Promise.defer();
	function handleResponse(response) {
		var result = JSON.parse(response);
		var items = result.items.map(function(item) {
			return {
				title : item.snippet.title,
				data : item.id
			};
		});
		defer.resolve(items);
	}
	function handleError(e) {
		defer.reject(e);
	}
	(new HTTPRequest({
		url : ENDPOINT + "playlists?maxResults=50&part=snippet%2CcontentDetails&channelId=" + channelid + "&key=" + GOOGLEAPIKEY,
		method : "GET",
		success : handleResponse,
		error : handleError,
	})).send();
};

var _getVideosByplaylistId = function(playlistid) {
	var defer = Promise.defer();
	function handleResponse(response) {
		var playlists = JSON.parse(this.responseText);
		defer.resolve(playlists.items.map(function(v) {
			return {
				image : v.snippet.thumbnails.default.url.replace(/default/, 'hqdefault'),
				title : v.snippet.title.replace(/^[\s]+/g, ''),
				id : v.snippet.resourceId.videoId,
				description : v.snippet.description.split('\n')[0],
			};
		}));
	}
	function handleError(e) {
		defer.reject(e);
	}
	(new HTTPRequest({
		url : ENDPOINT + 'playlistItems?&maxResults=50&part=snippet%2CcontentDetails%2Cstatus&playlistId=' + playlistid + '&key=' + GOOGLEAPIKEY,
		method : "GET",
		success : handleResponse,
		error : handleError,
	})).send();
};

var getUrlById = function(id) {
	var defer = Promise.defer();
	VideoProvider.getVideoUrl('youtube', id).then(function onSuccess(url) {
		defer.resolve(url);
	}, function onError(e) {
		Ti.API.error(e);
	});
};

exports.getPlaylistsByChannelId = _getPlaylistsByChannelId;
exports.getVideosByplaylistId = _getVideosByplaylistId;
exports.getUrlById = _getUrlById;
