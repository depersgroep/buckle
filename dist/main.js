'use strict';
/**
 *
 *	Sometimes stuff has to cycle. Carousels, slideshows, etc...
 *	Look no further 'cause this piece of code will do it all
 * 
 *
 *	@class Cycle
 *	@constructor
 *
 *	@property {Bonzo} cycle The dom element containing the items
 *	@property {Bonzo} [container] The container if left / right positioning is needed
 *  @property {Integer} [containerwidth] Width of the container
 *	@property {Integer} [slidesLimit] Limit of slides
 *	@property {Integer} [initialSlide] default 0 is used but if another slide is the current one
 *	@property {Integer} [step] how many slides should be changed at once
 *	@property {Integer} [slideWidth] The width of 1 slide (for equal cycle items)
 *	@property {Bonzo} [navigation] do we need navigation? Pass array with next / previous /play / pause html objects
 *	@property {Bonzo} [number] do we need numbers? If so pass an array with the number html objects
 *	@property {Bonzo} [bullets] do we need bullets? If so pass an array with the bullets html objects
 *	@property {Boolean} [autoplay] if it should move to the next slide automaticly
 *	@property {Integer} [timer] time between slides on autoplay
 *	@property {Boolean} [loop] continuous loop 1 - 2 - 3 -4 -1 -2 -3 -4 - 1 ...
 *	@property {String} [animation] can be whatever you need in your callback. fade, slide, etc..
 *	@property {function} onSlideChange callback function when the toggle is active
 *
 *	@example
 *
 *		var slideshow = $(obj).data('cycle',
 *			new Cycle({
 *				cycle: $(obj),
 *				container: container,
 *				slides: items,
 *				navigation: (nav.length ? nav : false),
 *				bullets: (bullets.length ? bullets : false),
 *				loop: true,
 *				animation: animation,
 *				autoplay: autoplay,
 *				timer: timer,
 *				onSlideChange: function(args){ // callback function; }
 *			})
 *		);
 *
 */
function Cycle(args) {

	var _this = this;

	_this.defaults = {
		cycle: (args.cycle ? args.cycle : null),
		container: (args.container ? args.container : null),
		containerwidth: (args.containerwidth ? args.containerwidth : false),
		slides: {
			collection: (args.slides ? args.slides : null),
			min: 0,
			max: args.slidesLimit ? args.slidesLimit : (args.slides ? args.slides.length : 0),
			cur: args.initialSlide ? args.initialSlide : 0,
			step: args.step ? args.step : 1,
			slideWidth: args.slideWidth ? args.slideWidth : 0
		},
		callback: {
			onSlideChange: (args.onSlideChange ? args.onSlideChange : function(){})
		},
		settings: {
			/*
					do we need navigation? Pass array with next / previous /
					play / pause html objects */
			nav: (args.navigation ? args.navigation : false),
			/*
					do we need numbers? If so pass an array with the number
					html objects
				*/
			numbers: (args.numbers ? args.numbers : false),
			/*
					do we need bullets? If so pass an array with the bullets
					html objects
				*/
			bullets: (args.bullets ? args.bullets : false),
			/*
					if it should move to the next slide automaticly
				*/
			autoplay: (args.autoplay ? args.autoplay : false),
			/*
					time between slides on autoplay
				*/
			timer: (args.timer ? args.timer : 3000),
			/*
					continuous loop 1 - 2 - 3 -4 -1 -2 -3 -4 - 1 ...
				*/
			infinite: (args.loop ? args.loop : false),
			/*
					animation can be false, slide or fade
				*/
			animation: (args.animation ? args.animation : false),
			/*
					reference for the window.setInterval
				*/
			_interval: null,
			/*
					loop can be true or false
				*/
			loop: (args.loop ? args.loop : false)
		}
	};

	function setupCycle() {

		// get the current active item
		var current = 0;
		_this.defaults.slides.collection.each(function() {
			if ($(this).hasClass('active')) {
				_this.defaults.slides.cur = current;
			}
			current += 1;
		});
		// set the current active item as .js-is-active
		_this.show(_this.defaults.slides.cur);

		if (_this.defaults.settings.nav) {
			navEvents();
		}

		if (_this.defaults.settings.bullets) {
			bulletEvents();
		}

		if (_this.defaults.settings.autoplay) {
			// autoplay is a gogo
			_this.defaults.settings._interval = window.setInterval(function() {
				_this.showNext(true);
			}, _this.defaults.settings.timer);
		}

	}

	function navEvents() {

		bean.on($('.next', _this.defaults.settings.nav)[0], 'click', function(e) {
			e.preventDefault();
			_this.showNext();
		});

		bean.on($('.previous', _this.defaults.settings.nav)[0], 'click', function(e) {
			e.preventDefault();
			_this.showPrevious();
		});

	}

	function bulletEvents() {

		$('.slider__bullet', _this.defaults.settings.bullets).each(function() {
			var ind = arguments[1]; // index
			bean.on(this, 'click', function(e) {
				e.preventDefault();
				_this.stopAutoplay();
				_this.show(ind);
			});
		});

	}

	// if we have a cycle object and there are slides
	if (_this.defaults.cycle && _this.defaults.slides.max) {
		// setup Cycle options / events
		setupCycle();
	}

	return _this;

}

/**
 *
 *	@method show
 *	@for Cycle
 *
 *	@description
 *	Show a specific slide
 *
 *	@param {Integer} slidenumber the index of the slide to show
 *	@param {String} [direction] the direction (left / right) to slide if animated
 *
 *	@example
 *
 *		slideshow.show(slideNumber, 'left');
 *
 */
Cycle.prototype.show = function(slideNumber, direction) {

	var showSlide = false,
		animDirection = (direction ? direction : false);

	// calculate if the number is possible
	if (slideNumber !== '') {
		if (slideNumber >= 0 && slideNumber < this.defaults.slides.max) {
			showSlide = true;
		} else if (slideNumber < 0) {
			if (this.defaults.settings.infinite) {
				showSlide = true;
				slideNumber = this.defaults.slides.max - this.defaults.slides.step;
			}
		} else if (slideNumber >= this.defaults.slides.max) {
			if (this.defaults.settings.infinite) {
				showSlide = true;
				slideNumber = 0;
			}
		}
		if (showSlide) {
			// if the direction is not passed AND we have a slide animation AND the loop isn't infinite
			if (!animDirection && this.defaults.settings.animation === 'slide') {
				animDirection = 'left';
				if (slideNumber < this.defaults.slides.cur) {
					animDirection = 'right';
				}
			}
			this.defaults.slides.cur = slideNumber;
			// call the callback function
			var args = {
				container: this.defaults.container,
				containerwidth: this.defaults.containerwidth,
				slides: this.defaults.slides.collection,
				slideWidth: this.defaults.slides.slideWidth,
				slideNumber: this.defaults.slides.cur,
				slideMax: this.defaults.slides.max,
				slideStep: this.defaults.slides.step,
				animation: this.defaults.settings.animation,
				direction: animDirection,
				bullets: this.defaults.settings.bullets,
				infinite: this.defaults.settings.infinite,
				navigation: this.defaults.settings.nav
			};
			this.defaults.callback.onSlideChange.call(this, args);
		}
	}

	return this;

};

/**
 *
 *	@method showNext
 *	@for Cycle
 *
 *	@description
 *	Shorthand to show the next slide
 *
 *	@example
 *
 *		slideshow.showNext();
 *
 */
Cycle.prototype.showNext = function(isAutoplay) {

	var newPosition = 0;
	this.stopAutoplay(isAutoplay);

	if(this.defaults.settings.loop || (
		this.defaults.slides.cur + this.defaults.slides.step*2 <= this.defaults.slides.max)) {
		newPosition = this.defaults.slides.cur + this.defaults.slides.step;
	} else {
		newPosition = this.defaults.slides.cur + this.defaults.slides.max;
		newPosition -= (this.defaults.slides.cur + this.defaults.slides.step);
	}
	this.show(newPosition, 'left');

	return this;

};

/**
 *
 *	@method showPrevious
 *	@for Cycle
 *
 *	@description
 *	Shorthand to show the previous slide
 *
 *	@example
 *
 *		slideshow.showPrevious();
 *
 */
Cycle.prototype.showPrevious = function(isAutoplay) {

	var newPosition = 0;
	this.stopAutoplay(isAutoplay);

	if(this.defaults.settings.loop || (this.defaults.slides.cur - this.defaults.slides.step > -1)) {
		newPosition = this.defaults.slides.cur - this.defaults.slides.step;
	}

	this.show(newPosition, 'right');

	return this;

};

/**
 *
 *	@method startAutoplay
 *	@for Cycle
 *
 *	@description
 *	start the autoplay
 *
 *	@example
 *
 *		slideshow.startAutoplay();
 *
 */
Cycle.prototype.startAutoplay = function(timer) {

	var that = this;
	this.isPlaying = true;

	//set a default value if needed
	timer = timer || this.defaults.settings.timer;
	if(timer && !this.defaults.settings.autoplay) {

		//if there isn't any autoplay going on right now, start one
		this.defaults.settings.autoplay = true;
		this.defaults.settings._interval = window.setInterval(function() {
			that.showNext(true);
		}, this.defaults.settings.timer);

	}

};

/**
 *
 *	@method stopAutoplay
 *	@for Cycle
 *
 *	@description
 *	stop the autoplay
 *
 *	@example
 *
 *		slideshow.stopAutoplay();
 *
 */
Cycle.prototype.stopAutoplay = function(isAutoplay) {
	this.isPlaying = false;
	if (!isAutoplay && this.defaults.settings.autoplay && this.defaults.settings._interval) {
		var theTimer = this.defaults.settings._interval;
		window.clearInterval(theTimer);
		this.defaults.settings.autoplay = false;
	}
};

'use strict';
/**
 *
 *	Modals you say? Lightboxes? What's in a name. This thing uses
 *	the WAI ARIA specced items to create modals
 * 
 *
 *	@class Dialog
 *	@constructor
 *	@requires Toggle
 *
 *
 *	@property {Bonzo} trigger The dom element item that needs to have tab functionality
 *	@property {boolean} [overlay] does the modal has an overlay, default true
 *	@property {String} [close] the class of the close button, default is none
 *	@property {object} [position] the x / y coordinates. default is 50 / 50 percent
 *	@property {function} onShow callback function when the dialog is shown
 *	@property {function} onHide callback function when the dialog is hidden
 *
 *	@example
 *
 *		new Dialog({
 *	trigger: $('.modal-trigger'),
 *	closer: '.close'
 *	});
 *
 *
 */
function Dialog(args){

	var _this = this;

	_this.defaults = {
			trigger: (args.trigger ? args.trigger : null),
			overlay: (args.overlay === false ? args.overlay : true),
			closer: (args.close ? args.close : false),
			position: (args.position ? args.position : {x: '50%', y: '50%'}),
			onShow: (args.onShow ? args.onShow : $.noop),
			onHide: (args.onHide ? args.onHide : $.noop),
		};

	// console.log('we have to create a dialog');

	// create toggle modules without global close
	$(_this.defaults.trigger).each(function(){
		// if we have a panel create a toggle
		var trigger = $(this),
			id = trigger.attr('data-trigger'),
			modal = $('*[data-modal="' + id + '"]');
		if (id && modal.length){
			trigger.data('toggle',
				new Toggle({
					trigger: this,
					toggle: modal,
					globalClose: false,
					onShow: function(){
						_this.show(trigger, modal);
					},
					onHide: function(){
						_this.hide(trigger, modal);
					}
				})
			);
			if (_this.defaults.closer){
				$(_this.defaults.closer, modal).on('click.dialog.close', function(){
					var tgl = $(_this.defaults.trigger).data('toggle');
					if (tgl){
						tgl.hide.call(tgl);
					}
				});
			}
		}
	});

	return _this;

}

/**
 *
 *	@method show
 *	@for Dialog
 *
 *	@description
 *	calls the show callback function
 *
 *	@example
 *
 *		var obj = new Dialog({
 *	trigger: $('.modal-trigger'),
 *	closer: '.close'
 *	});
 *	obj.show();
 *
 */
Dialog.prototype.show = function(trigger, modal){

	App.views.dialog.unshift($(this.defaults.trigger).data('toggle'));

	this.defaults.onShow.call(this, {
		overlay: this.defaults.overlay,
		modal: modal,
		trigger: trigger,
		position: this.defaults.position
	});

};

/**
 *
 *	@method hide
 *	@for Dialog
 *
 *	@description
 *	calls the hide callback function
 *
 *	@example
 *
 *		var obj = new Dialog({
 *	trigger: $('.modal-trigger'),
 *	closer: '.close'
 *	});
 *	obj.hide();
 *
 */
Dialog.prototype.hide = function(trigger, modal){

	if (App.views.dialog.length){
		App.views.dialog.shift();
	}

	this.defaults.onHide.call(this, {
		overlay: this.defaults.overlay,
		modal: modal,
		trigger: trigger,
		position: this.defaults.position
	});

};

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

'use strict';

 /*jshint unused:false*/
function Swiper(options) {
	var config = {
		minMoveX: 20,
		minMoveY: 20,
		preventDefaultEvents: options.preventDefault !== true ? options.preventDefault : true,
		element: options.element,
		preventDownwardScroll: options.preventDownwardScroll ? options.preventDownwardScroll : false,
		preventUpwardScroll: options.preventUpwardScroll ? options.preventUpwardScroll : false
	};

	this.preventDownwardScroll = function(val) {
		config.preventDownwardScroll = val;
	};
	this.preventUpwardScroll = function(val) {
		config.preventUpwardScroll = val;
	};

	$(config.element).each(function() {
		var startX,
			startY,
			isMoving = false;
		function cancelTouch() {
			bean.on(this, 'touchmove.swiper', onTouchMove);
			startX = null;
			isMoving = false;
		}
		function onTouchMove(e) {
			if(config.preventDefaultEvents) {
				e.preventDefault();
			}
			if(isMoving) {
				var x = e.touches[0].pageX,
					y = e.touches[0].pageY,
					dx = startX - x,
					dy = startY - y;
				if(Math.abs(dx) >= config.minMoveX) {
					cancelTouch();
					if(dx > 0) {
						Arbiter.publish('/swipe/left', {
							element: config.element,
							originalEvent: e
						});
					} else {
						Arbiter.publish('/swipe/right', {
							element: config.element,
							originalEvent: e
						});
					}
				} else if(Math.abs(dy) >= config.minMoveY) {
					cancelTouch();
					if(dy > 0) {
						Arbiter.publish('/swipe/up', {
							element: config.element,
							originalEvent: e
						});
					} else {
						Arbiter.publish('/swipe/down', {
							element: config.element,
							originalEvent: e
						});
					}
				}
				if(dy > 0) {
					if(config.preventDownwardScroll) {
						e.preventDefault();
					}
				} else if(dy < 0) {
					if(config.preventUpwardScroll) {
						e.preventDefault();
					}
				}
			}
		}
		function onTouchStart(e) {
			if (e.touches.length === 1) {
				startX = e.touches[0].pageX;
				startY = e.touches[0].pageY;
				isMoving = true;
				bean.on(this, 'touchmove.swiper', onTouchMove);
			}
		}
		bean.on(this, 'touchstart.swiper', onTouchStart);
	});

	return this;

}
 /*jshint unused:true*/

'use strict';
/**
 *
 *	Our tabs module is used to have multiple toggle items as 
 *	tabbed behaviour items
 * 
 *
 *	@class Tabs
 *	@constructor
 *	@requires Toggle
 *
 *	@property {Bonzo} tabs The dom element item that needs to have tab functionality
 *	@property {event} [mouseEvent] default 'click', can be changed to hover
 *	@property {function} [onTabChange] callback function when the tab is changed
 *	@property {boolean} [noPreventDefault] cancel the default action on the trigger, default false
 *
 *	@example
 *
 *		new Tabs({
 *		tabs: $('.tab-block'),
 *		onTabChange: function(args){ // do stuff; },
 *	});
 *
 *
 */
function Tabs(args){

	if (args){
		var _this = this;

		this.defaults = {
				tabs: (args.tabs ? args.tabs : null),
				mouseEvent: (args.mouseEvent ? args.mouseEvent : 'click'),
				onTabChange: (args.onTabChange ? args.onTabChange : function(){}),
				noPreventDefault: (args.noPreventDefault ? args.noPreventDefault : false)
			};

		// create toggle modules without global close
		$(this.defaults.tabs).each(function(){
			// if we have a panel create a toggle
			var tab = $(this),
				id = tab.attr('aria-controls');
			if (id){
				tab.data('toggle',
					new Toggle({
						trigger: tab,
						toggle: $('#' + id),
						mouseEvent: _this.defaults.mouseEvent,
						globalClose: false,
						toggleClick: false,
						onShow: function(){
							_this.show(tab);
						},
						noPreventDefault: _this.defaults.noPreventDefault
					})
				);
			}
		});
	}

	return this;

}

/**
 *
 *	@method show
 *	@for Tabs
 *
 *	@description
 *	calls the show callback function
 *
 *	@example
 *
 *		var obj = new Tabs({
 *		tabs: $('.tab-block'),
 *		onTabChange: function(args){ // do stuff; },
 *	});
 *	obj.show();
 *
 */
Tabs.prototype.show = function(tab){

	if (tab && this.defaults){
		var _this = this;

		// loop throug the tabs that are not the active one and hide them
		$(this.defaults.tabs).each(function(){
			_this.hide($(this));
		});

		Arbiter.publish('/tabs/show', {
			tab: tab,
			pane: $('#' + tab.attr('aria-controls'))
		});

		_this.defaults.onTabChange.call(_this);
	}

	return this;

};

/**
 *
 *	@method hide
 *	@for Tabs
 *
 *	@description
 *	calls the hide callback function
 *
 *	@example
 *
 *		var obj = new Tabs({
 *		tabs: $('.tab-block'),
 *		onTabChange: function(args){ // do stuff; },
 *	});
 *	obj.hide();
 *
 */
Tabs.prototype.hide = function(tab){

	if (tab && this.defaults){
		// hide the tab
		tab.data('toggle').hide();

		Arbiter.publish('/tabs/hide', {
			tab: tab,
			pane: $('#' + tab.attr('aria-controls'))
		});
	}

	return this;

};

/**
 *
 *	@method destroy
 *	@for Tabs
 *
 *	@description
 *	destroys the tabs instance
 *
 *	@example
 *
 *		var obj = new Tabs({
 *		tabs: $('.tab-block'),
 *		onTabChange: function(args){ // do stuff; },
 *	});
 *	obj.destroy();
 *
 */
Tabs.prototype.destroy = function(){

	if (this.defaults){
		$(this.defaults.tabs).each(function(){
			// if we have a panel create a toggle
			var tab = $(this);
			if (tab.data('toggle')){
				tab.data('toggle').destroy();
				tab.data('toggle', '');
			}
		});
	}

	return this;

};

'use strict';
/**
 *
 *	Our toggle module is used to toggle stuff (classes, whatever)
 *	Each toggle consists of a trigger and a object to toggle.
 * 
 *
 *	@class Toggle
 *	@constructor
 *
 *	@property {Bonzo} toggle The dom element item that needs to be toggled
 *	@property {Bonzo} trigger The dom element item that will trigger the toggle
 *  @property {Boolean} [state] True or false, open or closed, active or disabled, ....
 *	@property {boolean} [globalClose] does the item toggle when you click outside the toggle element, default true
 *	@property {boolean} [noPreventDefault] cancel the default action on the trigger, default false
 *	@property {boolean} [toggleClick] does the item keeps toggling when clicking the trigger, default true
 *	@property {event} [mouseEvent] default 'click', can be changed to hover
 *	@property {function} [onShow] callback function when the toggle is active
 *	@property {function} [hoHide] callback function when the toggle is inactive
 *	@property {function} [onToggle] callback function when the toggle is toggled
 *
 *	@example
 *
 *		new Toggle({
 *		toggle: $('.toggle'),
 *		trigger: $('.trigger'),
 *		onshow: function(args){ // add a class; },
 *		onhide: function(args){ // remove a class}
 *	});
 *
 *
 */

function Toggle(args){

	var _this = this;

	if (args){

		this.defaults = {
				toggle: (args.toggle ? args.toggle : null),
				trigger: (args.trigger ? args.trigger : null),
				state: (args.state ? args.state : false),
				globalClose: (args.globalClose === false ? args.globalClose : true),
				noPreventDefault: (args.noPreventDefault ? args.noPreventDefault : false),
				toggleClick: (args.toggleClick === false ? args.toggleClick : true),
				mouseEvent: (args.mouseEvent ? args.mouseEvent : 'click'),
				onShow: (args.onShow ? args.onShow : function(){}),
				onHide: (args.onHide ? args.onHide : function(){}),
				onToggle: (args.onToggle ? args.onToggle : function(){})
			};
		if (this.defaults.toggle && this.defaults.trigger) {
			if (this.defaults.mouseEvent === 'hover') {
				$(this.defaults.trigger).on('mouseover.toggle mouseout.toggle', function(){
					_this.toggle();
				});
			} else {
				$(this.defaults.trigger).on('click.toggle.trigger', function(e){
					if(!_this.defaults.noPreventDefault){
						e.preventDefault();
					}
					_this.toggle();
				});
			}
		}
		if (this.defaults.state){
			this.show();
		}
	}

	return this;

}


/**
 *
 *	@method toggle
 *	@for Toggle
 *
 *	@description
 *	fires the show or hide function
 *
 *	@example
 *
 *		var obj = new Toggle({
 *		toggle: $('.toggle'),
 *		trigger: $('.trigger'),
 *		onshow: function(args){ // add a class; },
 *		onhide: function(args){ // remove a class}
 *	});
 *	obj.toggle();
 *
 */
Toggle.prototype.toggle = function() {

	if (this.defaults){
		if (this.defaults.toggleClick){
			if (this.defaults.state){
				this.hide();
			}else{
				this.show();
			}
		}else{
			this.show();
		}
		this.defaults.onToggle.call(this.defaults.toggle);
	}

	return this;

};

/**
 *
 *	@method show
 *	@for Toggle
 *
 *	@description
 *	calls the show callback function
 *
 *	@example
 *
 *		var obj = new Toggle({
 *		toggle: $('.toggle'),
 *		trigger: $('.trigger'),
 *		onshow: function(args){ // add a class; },
 *		onhide: function(args){ // remove a class}
 *	});
 *	obj.show();
 *
 */
Toggle.prototype.show = function(){

	if (this.defaults){

		this.defaults.state = true;

		Arbiter.publish('/toggle/show', {
			toggle: this.defaults.toggle
		});

		if (this.defaults.globalClose){

			$(document).on('click.toggle.globalclose', function(e, args){
				var _this = args._this,
					toggleIsOrContainsTarget = $(_this.defaults.toggle)[0].contains(e.target) ||
					$(_this.defaults.toggle)[0] === e.target,
					triggerIsOrContainsTarget = $(_this.defaults.trigger)[0].contains(e.target) ||
					$(_this.defaults.trigger)[0] === e.target;
				if (!toggleIsOrContainsTarget && !triggerIsOrContainsTarget){
					_this.hide(true);
				}
			}, {_this: this});

		}

		this.defaults.onShow.call(this.defaults.toggle);
	}

	return this;

};

/**
 *
 *	@method hide
 *	@for Toggle
 *
 *	@description
 *	calls the hide callback function
 *
 *	@example
 *
 *		var obj = new Toggle({
 *		toggle: $('.toggle'),
 *		trigger: $('.trigger'),
 *		onshow: function(args){ // add a class; },
 *		onhide: function(args){ // remove a class}
 *	});
 *	obj.hide();
 *
 */
Toggle.prototype.hide = function(){

	if (this.defaults){

		this.defaults.state = false;
		Arbiter.publish('/toggle/hide', {
			toggle: this.defaults.toggle
		});
		this.defaults.onHide.call(this.defaults.toggle);

		if (this.defaults.globalClose){
			$(document).off('click.toggle.globalclose', this.hide);
		}

	}

	return this;

};

/**
 *
 *	@method destroy
 *	@for Toggle
 *
 *	@description
 *	destroys the toggle instance
 *
 *	@example
 *
 *		var obj = new Toggle({
 *		toggle: $('.toggle'),
 *		trigger: $('.trigger'),
 *		onshow: function(args){ // add a class; },
 *		onhide: function(args){ // remove a class}
 *	});
 *	obj.destroy();
 *
 */
Toggle.prototype.destroy = function() {
	// destroy it
	var _this = this;
	if (this.defaults){
		Arbiter.publish('/toggle/destroy', this.defaults);
		$(_this.defaults.trigger).off('click.toggle mouseover.toggle mouseout.toggle');
		$(document).off('click.toggle', this.hide);
		// remove the defaults
		this.defaults = null;
	}

	return this;
};

'use strict';
/**
 *
 *	Validating forms like a boss! On submit it automatically 
 *	validates the form with 
 * 
 *
 *	@class Validate
 *	@constructor
 *
 *
 *	@property {Bonzo} form The dom element form
 *
 *	@example
 *
 *		new Validate({
 *	frm: $('.form-to-validate'),
 *	});
 *
 *
 */
function Validate(args){

	if (args){
		var _this = this;
		_this.defaults = {
				frm: (args.frm ? args.frm : false),
				fields: []
			};

		if (_this.defaults.frm){

			_this.defaults.frm.setAttribute('novalidate', '');

			// get all the input / textarea stuff and check if it's required
			$('input[required], textarea[required], select[required]', _this.defaults.frm).each(function(){
				_this.defaults.fields.push({
					hasError: false,
					htmlObj: this
				});
			});

			// hijack the form submit
			bean.on(_this.defaults.frm, 'submit', function(e){
				if (_this.checkValidation()){
					e.preventDefault();
				}else{
					$('[type="submit"]', this).attr('disabled', 'disabled');
				}
			});
			bean.on(_this.defaults.frm, 'reset', function(){
				_this.removeAllErrors();
			});
		}
	}

	return this;

}

/**
 *
 *	@method checkValidation
 *	@for Validate
 *
 *	@description
 *	check the form validation
 *
 *	@example
 *
 *		var theForm = new Validate({
 *	frm: $('.form-to-validate'),
 *	});
 *	theForm.checkValidation();
 *
 *
 */
Validate.prototype.checkValidation = function(){

	var error = false;
	if (this.defaults){
		for(var k in this.defaults.fields){
			//IE looping over every arg protection
			if(!this.defaults.fields[k] || !this.defaults.fields[k].htmlObj) {
				continue;
			}
			this.removeError(k);
			// check if there is a value
			if (this.checkValue(this.defaults.fields[k].htmlObj)){
				// check the type
				switch (this.defaults.fields[k].htmlObj.nodeName.toLowerCase()){
				case 'textarea':
					break;
				case 'select':
					break;
				default:
					switch(this.defaults.fields[k].htmlObj.getAttribute('type')){
					case 'checkbox':
						if (!this.defaults.fields[k].htmlObj.checked){
							this.triggerError(k, 'unchecked');
							error = true;
						}else{
							bean.off(this);
						}
						break;
					case 'radio':
						var radiogroup = $('input[name="' + this.defaults.fields[k].htmlObj.name + '"]:checked');
						if (radiogroup.length < 1 || !radiogroup[0].value){
							this.triggerError(k, 'unchecked');
							error = true;
						}
						break;
					case 'tel':
						// must be regex
						break;
					case 'email':
						// new regex by Sven
						if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.defaults.fields[k].htmlObj.value)){
							this.triggerError(k, 'invalidEmail');
							error = true;
						}
						break;
					default:
					}
				}
			}else{
				this.triggerError(k, 'empty');
				error = true;
			}
		}

		Arbiter.publish('/validate/complete', {
			error: error,
			validate: this,
			frm: this.defaults.frm
		});
	}
	return error;

};

/**
 *
 *	@method checkValidation
 *	@for Validate
 *
 *	@description
 *	check if an input / textarea value is valid
 *	
 *	@return {boolean} validation
 *
 *	@example
 *
 *		var theForm = new Validate({
 *	frm: $('.form-to-validate'),
 *	}),
 *	inp = document.getElementById('inputName');
 *	theForm.checkValue(inp);
 *
 *
 */
Validate.prototype.checkValue = function(htmlObj){

	var r = false;
	if (htmlObj){
		if (htmlObj.value && htmlObj.value !== htmlObj.getAttribute('placeholder')){
			if (htmlObj.getAttribute('minlength')){
				if (htmlObj.value.length >= parseInt(htmlObj.getAttribute('minlength'), 10)){
					r = true;
				}
			}else{
				r = true;
			}
		}
	}

	return r;

};

// this is not a public function
Validate.prototype.triggerError = function(field, msg){

	if ((field || field === 0) && msg){
		var _this = this;

		if('number' !== typeof field && !this.defaults.fields[field]) {
			if('string' === typeof field) {
				field = $(field, _this.defaults.frm);
			}
			for(var i = 0; i < this.defaults.fields.length; i++) {
				if(field[0] === this.defaults.fields[i].htmlObj) {
					field = i;
					break;
				}
			}
		}

		this.defaults.fields[field].hasError = true;
		// only attch the event once!
		bean.off(_this.defaults.fields[field].htmlObj, 'keyup.validate');
		bean.on(_this.defaults.fields[field].htmlObj, 'keyup.validate', function(){
			_this.checkValidation();
		});

		Arbiter.publish('/validate/error/show', {
			field: this.defaults.fields[field].htmlObj,
			message: App.config.formErrors[msg]
		});
	}

	return this;


};

// neither is this
Validate.prototype.removeError = function(field){

	if (field){
		if('number' !== typeof field && !this.defaults.fields[field]) {
			if('string' === typeof field) {
				field = $(field, this.defaults.frm);
			}
			for(var i = 0; i < this.defaults.fields.length; i++) {
				if(field[0] === this.defaults.fields[i].htmlObj) {
					field = i;
					break;
				}
			}
		}

		Arbiter.publish('/validate/error/remove', {
			field: this.defaults.fields[field].htmlObj
		});
	}

	return this;

};

/**
 *
 *	@method removeAllErrors
 *	@for Validate
 *
 *	@description
 *	Remove all errors
 *
 *	@example
 *
 *		var theForm = new Validate({
 *	frm: $('.form-to-validate'),
 *	});
 *	theForm.removeAllErrors();
 *
 *
 */
Validate.prototype.removeAllErrors = function() {
	for(var k in this.defaults.fields) {
		if(!this.defaults.fields[k] || !this.defaults.fields[k].htmlObj) {
			continue;
		}
		bean.off(this.defaults.fields[k].htmlObj, 'keyup.validate');
		this.removeError(k);
	}
};
