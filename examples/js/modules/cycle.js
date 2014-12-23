/**
 *
 *   Cycle
 *
 **/

'use strict';

App.modules.cycle = (function() {

	$.subscribe('APP/bootstrap', _init);

	function _init() {

		$('.fjs-cycle').each(function() {

			_setup(this);
		});
	}

	function _setup(obj) {

		var items = $('.fjs-cycle_slide', obj),
			itemcount = items.length,
			itemwidth = items[1].offsetWidth, // don't take the first one (index 0) coz it has no left padding
			container = $('.cycle_container', obj),
			nav = $('.fjs-cycle_nav', obj),
			slideStep = _calculateStep(obj);

		container.css({
			width: (itemcount + 1) * itemwidth + 'px'
		});

		if (!obj.getAttribute('data-loop')) {

			$('.fjs-previous, .fjs-next', nav).addClass('is-hidden');
		}

		var slideshow = $(obj).data('cycle',
			new Cycle({
				cycle: $(obj),
				container: container,
				slides: items,
				slideWidth: itemwidth,
				autoplay: $(obj).data('autoplay'),
				timer: $(obj).data('timer'),
				navigation: (nav.length ? nav : false),
				step: slideStep,
				loop: $(obj).data('loop'),
				onSlideChange: _showSlide
			}));
	}

	function _calculateStep(obj) {

		var objWidth = $('.fjs-cycle_clipper', obj)[0].offsetWidth,
			slideWidth = $('.fjs-cycle_slide', obj)[0].offsetWidth;

		return Math.floor(objWidth / slideWidth);
	}

	function _showSlide(args) {

		if (args) {

			slideAnimation(args);
		}

		_updateNavigation(args);
	}

	function slideAnimation(args) {

		args.container.css({
			left: 0 - (args.slideWidth * args.slideNumber) + 'px'
		});
	}

	function _updateNavigation(args) {

		if (args && args.navigation && !args.infinite) {

			$('.fjs-previous', args.navigation).removeClass('is-hidden');
			$('.fjs-next', args.navigation).removeClass('is-hidden');

			if (args.slideNumber <= 0) {

				// disable the previous
				$('.fjs-previous', args.navigation).addClass('is-hidden');
			}

			if (args.slideNumber + args.slideStep >= args.slideMax) {

				$('.fjs-next', args.navigation).addClass('is-hidden');
			}
		}
	}

}());
