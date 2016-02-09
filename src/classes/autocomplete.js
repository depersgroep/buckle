'use strict';
/**
 *
 *	Our autocomplete
 *
 *
 *	@class Autocomplete
 *	@constructor
 *
 *	@property {Element} input The input trigger
 *  @property {Element} appendTo The list to append the results to
 *  @property {String} url The url to send requests to
 *  @property {Function} onSelectCallback Callback function when selecting an item
 *  @property {Element|Optional} itemElement The element used for the result list, default: li
 *  @property {String|Optional} activeClass Class to indicate active, default: js-is-active
 *  @property {Number|Optional} minLength The min length before we start to do requests, default: 3
 *  @property {Number|Optional} debounce The time in ms to wait before a request is fired, default: 200
 *
 *	@example
 *
 *	new Autocomplete({
 *	    'input': document.querySelector('input'),
 *	    'appendTo': document.querySelector('ol'),
 *	    'url': 'http://google.com/search/autocomplete/?query=',
 *	    'onSelectCallback': function(item){ console.log(selectedValue); },
 *	    'itemElement': document.querySelector('li'),
 *	    'activeClass': 'js-is-active',
 *	    'minLength: 5
 *	});
 *
 *
 */

function Autocomplete(args) {
	var _this = this,
		$input,
		$appendTo;

	if (args) {
		this.defaults = {
			'input': args.input ? args.input : null,
			'appendTo': args.appendTo ? args.appendTo : null,
			'url': args.url ? args.url : null,
			'onSelectCallback': args.onSelectCallback ? args.onSelectCallback : function() {},
			'itemElement': args.itemElement ? args.itemElement : document.createElement('li'),
			'activeClass': args.active ? args.activeClass : 'js-is-active',
			'minLength': args.minLength ? args.minLength : 3,
			'debounce': args.debounce ? args.debounce : 200
		};

		if (this.defaults.input && this.defaults.appendTo) {
			$input = $(this.defaults.input);
			$appendTo = $(this.defaults.appendTo);

			create();
		}
	}

	function create() {
		$input.attr('autocomplete', 'off');
		$input.on('keyup.autocomplete', debounce(keyUp, _this.defaults.debounce));
		$input.on('keydown.autocomplete', keyDown);
		$input.on('focus.autocomplete', keyUp);
		$input.on('blur.autocomplete', onBlur);
		$(window).on('click.autocomplete', globalClose);
	}

	function keyUp(e) {
		var keyCode = e.keyCode || e.which;

		if (keyCode < 37 || keyCode > 40) { // left, right, up and down shouldn't do anything
			if (keyCode !== 13 && _this.defaults.input.value.length >= _this.defaults.minLength) {
				request(_this.defaults.input.value);
			} else {
				_this.defaults.appendTo.innerHTML = '';
				$appendTo.removeClass(_this.defaults.activeClass);
			}
		}
	}

	function keyDown(e) {
		var $current,
			keyCode = e.keyCode || e.which;

		if (keyCode === 40) {
			e.preventDefault();
			nextItem();
		} else if (keyCode === 38) {
			e.preventDefault();
			prevItem();
		} else if (keyCode === 13) {
			$current = $('.' + _this.defaults.activeClass, _this.defaults.appendTo);

			if ($current.length > 0) {
				click($current[0]);
			}
		}
	}

	function onBlur() {
		// Windows Surface 3 needs 400ms before the 'click' on the element is performed...
		window.setTimeout(reset, 400);
	}

	function globalClose(e) {
		if (_this.defaults.input !== e.target) {
			reset();
		}
	}

	function request(query) {
		$.ajax({
			'url': _this.defaults.url + query,
			'method': 'get',
			'success': response
		});
	}

	function response(resp) {
		var elem,
			result = resp.items,
			i = 0,
			l = result.length;

		if (l > 0) {
			$appendTo.addClass(_this.defaults.activeClass);
		} else {
			reset();
		}

		_this.defaults.appendTo.innerHTML = '';

		for (; i < l; i++) {
			elem = _this.defaults.itemElement.cloneNode(true);
			elem.innerHTML = result[i];
			elem.setAttribute('data-autocomplete-value', result[i]);
			$(elem).on('click.autocomplete', click);
			_this.defaults.appendTo.appendChild(elem);
		}
	}

	function nextItem() {
		var $items = $('li', _this.defaults.appendTo),
			$current = $('.' + _this.defaults.activeClass, _this.defaults.appendTo),
			$next = $current.next();

		$current.removeClass(_this.defaults.activeClass);

		if ($current.length === 0 || $next.length === 0) {
			$items.first().addClass(_this.defaults.activeClass);
		} else if ($next.length > 0) {
			$next.addClass(_this.defaults.activeClass);
		}
	}

	function prevItem() {
		var $items = $('li', _this.defaults.appendTo),
			$current = $('.js-is-active', _this.defaults.appendTo),
			$prev = $current.previous();

		$current.removeClass(_this.defaults.activeClass);

		if ($current.length === 0 || $prev.length === 0) {
			$items.last().addClass(_this.defaults.activeClass);
		} else {
			$prev.addClass(_this.defaults.activeClass);
		}
	}

	function click(e) {
		var item = e.target ? e.target : e;

		reset();

		if (typeof _this.defaults.onSelectCallback === 'function') {
			_this.defaults.onSelectCallback(item.getAttribute('data-autocomplete-value'));
		}
	}

	function reset() {
		$appendTo.html('').removeClass(_this.defaults.activeClass);
	}

	// Helper function
	function debounce(func, wait, immediate) {
		var timeout,
			ret = function() {
				var _this = this,
					args = arguments,
					later = function() {
						timeout = null;

						if (!immediate) {
							func.apply(_this, args);
						}
					},
					callNow = immediate && !timeout;

				clearTimeout(timeout);
				timeout = setTimeout(later, wait);

				if (callNow) {
					func.apply(_this, args);
				}
			};

		return ret;
	}

	return this;
}

Autocomplete.prototype.destroy = function() {
	if (this.defaults) {
		$(this.defaults.input).off('keyup.autocomplete keydown.autocomplete focus.autocomplete');
		this.defaults =  null;
	}

	return this;
};
