'use strict';
function Streamer(args){

	var _this = this;

	_this.defaults = {
		timestamp: moment().unix(), // unix timestamp
		htmlObj: (args.obj ? args.obj : null),
		pollURL: (args.url ? args.url : false),
		counter: (args.counter ? args.counter : null),
		timeout: (args.timeout ? args.timeout : 30),
		_timeout: null, // object reference for window.setTimeout
		_timer: 0
	};
	_this.startFetching();

}

Streamer.prototype.startFetching = function(){

	var _this = this;

	this.defaults._timer = this.defaults.timeout;
	Arbiter.publish('streamer/timer/update', {
		htmlObj: this.defaults.counter,
		timer: this.defaults._timer
	});

	this.defaults._timeout = window.setInterval(function(){
		_this.gogoTimer();
	}, 1000);

};

Streamer.prototype.gogoTimer = function(){

	var _this = this;

	if (this.defaults._timer > 0) {
		this.defaults._timer--;
		Arbiter.publish('streamer/timer/update', {
			htmlObj: this.defaults.counter,
			timer: this.defaults._timer
		});
	}else{
		window.clearInterval(_this.defaults._timeout);
		this.fetch();
	}

};

Streamer.prototype.fetch = function(){

	var _this = this;

	reqwest({
		url: _this.defaults.pollURL + '?timestamp=' + _this.defaults.timestamp,
		type: 'json',
		success: function(resp){
			if (resp.response && resp.timestamp){
				if (resp.timestamp > _this.defaults.timestamp){
					Arbiter.publish('streamer/fetchupdate', {
						htmlObj: _this.defaults.htmlObj,
						updateURL: resp.response
					});
					_this.defaults.timestamp = resp.timestamp;
				}
			}
			_this.startFetching();
		}
	});

};
