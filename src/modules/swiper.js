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
