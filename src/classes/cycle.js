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
 *		new Cycle({
 *			cycle: $(obj),
 *			container: container,
 *			slides: items,
 *			navigation: (nav.length ? nav : false),
 *			bullets: (bullets.length ? bullets : false),
 *			loop: true,
 *			animation: animation,
 *			autoplay: autoplay,
 *			timer: timer,
 *			onSlideChange: function(args) {
 * 				// callback function
 *			}
 *		})
 *	);
 *
 */
function Cycle(args) {
	var _this = this;

	if (args) {
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
				onSlideChange: (args.onSlideChange ? args.onSlideChange : function() {})
			},
			settings: {
				/*
						do we need navigation? Pass array with next / previous /
						play / pause html objects */
				nav: (args.navigation ? args.navigation : false),
				/*
					Object representing the classnames
				*/
				navclasses: {
					navNext: (args.next ? args.next : '.next'),
					navPrevious: (args.previous ? args.previous : '.previous')
				},
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
				bulletClass: (args.bulletClass ? args.bulletClass : '.slider__bullet'),
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
	}

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
		bean.on($(_this.defaults.settings.navclasses.navNext, _this.defaults.settings.nav)[0], 'click', function(e) {
			e.preventDefault();
			_this.showNext();
		});

		bean.on($(_this.defaults.settings.navclasses.navPrevious, _this.defaults.settings.nav)[0], 'click', function(e) {
			e.preventDefault();
			_this.showPrevious();
		});
	}

	function bulletEvents() {
		$(_this.defaults.settings.bulletClass, _this.defaults.settings.bullets).each(function() {
			var ind = arguments[1]; // index
			bean.on(this, 'click', function(e) {
				e.preventDefault();
				_this.stopAutoplay();
				_this.show(ind);
			});
		});
	}

	// if we have a cycle object and there are slides
	if (_this.defaults && _this.defaults.cycle && _this.defaults.slides.max) {
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
	if (this.defaults) {
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
					navigation: this.defaults.settings.nav,
					loop: this.defaults.settings.loop
				};

				this.defaults.callback.onSlideChange.call(this, args);
			}
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
	if (this.defaults) {
		var newPosition = 0;
		this.stopAutoplay(isAutoplay);

		if (this.defaults.settings.loop || (this.defaults.slides.cur + this.defaults.slides.step * 2 <= this.defaults.slides.max)) {
			newPosition = this.defaults.slides.cur + this.defaults.slides.step;
		} else {
			newPosition = this.defaults.slides.cur + this.defaults.slides.max;
			newPosition -= (this.defaults.slides.cur + this.defaults.slides.step);
		}

		this.show(newPosition, 'left');
	}

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
	if (this.defaults) {
		var newPosition = 0;
		this.stopAutoplay(isAutoplay);

		if (this.defaults.settings.loop || (this.defaults.slides.cur - this.defaults.slides.step > -1)) {
			newPosition = this.defaults.slides.cur - this.defaults.slides.step;
		}

		this.show(newPosition, 'right');
	}

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
	if (this.defaults) {
		var _this = this;
		this.isPlaying = true;

		// set a default value if needed
		timer = timer || this.defaults.settings.timer;

		if (timer && !this.defaults.settings.autoplay) {
			// if there isn't any autoplay going on right now, start one
			this.defaults.settings.autoplay = true;
			this.defaults.settings._interval = window.setInterval(function() {
				_this.showNext(true);
			}, this.defaults.settings.timer);
		}
	}

	return this;
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
	if (this.defaults) {
		this.isPlaying = false;

		if (!isAutoplay && this.defaults.settings.autoplay && this.defaults.settings._interval) {
			var theTimer = this.defaults.settings._interval;
			window.clearInterval(theTimer);
			this.defaults.settings.autoplay = false;
		}
	}

	return this;
};

Cycle.prototype.destroy = function() {
	return this;
};
