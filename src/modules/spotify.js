'use strict';
function Spotify(options) {
	this._settings = {
		element: options.element,
		// Playlist URL (REQUIRED). This can be either the Spotify URI, of the HTTP link.
		url: options.url,
		// Initial Spotify Playbutton track. If null, the most recent track will be loaded.
		track: (options.track ? options.track : null),
		// Widget Title. If this is null, the Spotify playlist title will be used
		title: (options.title ? options.title : ''),
		// Fade animation when other track is clicked
		fade: (options.fade ? options.fade : false),
		// Spotify Playbutton height (default is advised)
		height: (options.height ? options.height : 80),
		// Spotify Playbutton width (default is advised)
		width: (options.width ? options.width : '100%'),
		// The text inside the red banner
		bannerText: (options.bannerText ? options.bannerText : 'DM Playlist'),
		// The amount of most recent tracks we need to fetch, this also depends on the amount available server side
		amount: (options.recentAmount ? options.recentAmount : 5)
	};

	this.load(this._settings.url);
}

Spotify.prototype.load = function(url) {
	var that = this,
		xhr,
		fn = 'onreadystatechange';
	if (window.XDomainRequest) {
		xhr = new window.XDomainRequest();
		fn = 'onload';

		xhr.onprogress = function(){}; // need for IE9, otherwise the ajax-request is aborted: http://stackoverflow.com/a/18392382/1054188
	} else if (window.XMLHttpRequest) {
		xhr = new window.XMLHttpRequest();
	} else {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhr[fn] = function() {
		//override xdomainrequest because no status or readystate is available
		if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304) || fn === 'onload') {
			var response = JSON.parse(xhr.responseText);
			if(that._settings.title === '' && 'undefined' !== typeof response.playlist) {
				that._settings.title = response.playlist.title;
			}
			// Set first track of the list if no track is given
			if (!that._settings.track) {
				that.setTrack(response.tracks[0].id);
			}
			Arbiter.publish('/spotify/load/success', {
				url: url,
				response: response,
				settings: {
					url: that._settings.url,
					element: that._settings.element,
					title: that._settings.title,
					height: that._settings.height,
					width: that._settings.width,
					amount: that._settings.amount,
					bannerText: that._settings.bannerText,
					track: that._settings.track,
					fade: that._settings.fade,
				}
			});
		}
	};
	xhr.open('GET', url);
	xhr.send();
};

Spotify.prototype.setTrack = function(track) {
	this._settings.track = track;
	Arbiter.publish('/spotify/track/select', {
		track: track,
		element: this._settings.element,
	});
};
