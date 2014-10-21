'use strict';
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

// function to show the slide
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

// shorthand to show the next slide
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

// shorthand to show the previous slide
Cycle.prototype.showPrevious = function(isAutoplay) {

	var newPosition = 0;
	this.stopAutoplay(isAutoplay);

	if(this.defaults.settings.loop || (this.defaults.slides.cur - this.defaults.slides.step > -1)) {
		newPosition = this.defaults.slides.cur - this.defaults.slides.step;
	}

	this.show(newPosition, 'right');

	return this;

};

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

Cycle.prototype.stopAutoplay = function(isAutoplay) {
	this.isPlaying = false;
	if (!isAutoplay && this.defaults.settings.autoplay && this.defaults.settings._interval) {
		var theTimer = this.defaults.settings._interval;
		window.clearInterval(theTimer);
		this.defaults.settings.autoplay = false;
	}
};
