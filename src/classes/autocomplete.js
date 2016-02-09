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
 *  @property {Element|Optional} form The form elements, default: closest form
 *  @property {Element|Optional} itemElement The element used for the result list, default: li
 *  @property {String|Optional} activeClass Class to indicate active, default: js-is-active
 *  @property {Number|Optional} minLength The min length before we start to do requests, default: 3
 *
 *	@example
 *
 *	new Autocomplete({
 *	    'input': document.querySelector('input'),
 *	    'appendTo': document.querySelector('ol'),
 *	    'url': 'http://google.com/search/autocomplete/?query=',
 *	    'form': document.querySelector('form'),
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
			'form': args.form ? args.form : null,
			'itemElement': args.itemElement ? args.itemElement : document.createElement('li'),
			'activeClass': args.active ? args.activeClass : 'js-is-active',
			'minLength': args.minLength ? args.minLength : 3,
			'url': args.url ? args.url : null
		};

		if (this.defaults.input && this.defaults.appendTo) {
			$input = $(this.defaults.input);
			$appendTo = $(this.defaults.appendTo);

			if (!this.defaults.form) {
				this.defaults.form = $input.closest('form')[0];
			}

			create();
		}
	}

	function create() {
		$input.attr('autocomplete', 'off');
		$input.on('keyup.autocomplete', keyUp.bind(_this));
		$input.on('keydown.autocomplete', keyDown.bind(_this));
		$input.on('focus.autocomplete', keyUp.bind(_this));
		$input.on('blur.autocomplete', blur);
		$(window).on('click.autocomplete', globalClose.bind(_this));
	}

	function keyUp(e) {
		if (e.keyCode === 40) {
			nextItem();
			e.preventDefault();
		} else if (e.keyCode === 38) {
			prevItem();
			e.preventDefault();
		} else if (e.keyCode !== 13 && _this.defaults.input.value.length >= _this.defaults.minLength) {
			request(_this.defaults.input.value);
		} else {
			_this.defaults.appendTo.innerHTML = '';
			$appendTo.removeClass(_this.defaults.activeClass);
		}
	}

	function keyDown(e) {
		var $current;

		if (e.keyCode === 13) {
			$current = $('.' + _this.defaults.activeClass, _this.defaults.appendTo);

			if ($current.length) {
				click($current[0]);
			}
		}
	}

	function blur() {
		window.setTimeout(reset, 150);
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
			'success': response.bind(_this)
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
			elem.innerText = result[i];
			elem.setAttribute('data-autocomplete-id', result[i]);
			$(elem).on('click.autocomplete', click.bind(_this));
			_this.defaults.appendTo.appendChild(elem);
		}
	}

	function nextItem() {
		var $items = $('li', _this.defaults.appendTo),
			$current = $('.' + _this.defaults.activeClass, _this.defaults.appendTo),
			$next = $current.next();

		$current.removeClass(_this.defaults.activeClass);

		if (!$current.length || !$next.length) {
			$items.first().addClass(_this.defaults.activeClass);
		} else if ($next.length) {
			$next.addClass(_this.defaults.activeClass);
		}
	}

	function prevItem() {
		var $items = $('li', _this.defaults.appendTo),
			$current = $('.js-is-active', _this.defaults.appendTo),
			$prev = $current.previous();

		$current.removeClass(_this.defaults.activeClass);

		if (!$current.length || !$prev.length) {
			$items.last().addClass(_this.defaults.activeClass);
		} else {
			$prev.addClass(_this.defaults.activeClass);
		}
	}

	function click(e) {
		var item = e.target ? e.target : e;

		_this.defaults.input.value = item.getAttribute('data-autocomplete-id');

		// For iOS, otherwise the submit will be executed before the value is set.
		window.setTimeout(function() {
			_this.defaults.form.submit();
		}, 0);

		reset();
	}

	function reset() {
		$appendTo.html('').removeClass(_this.defaults.activeClass);
	}

	console.log(this);

	return this;
}

Autocomplete.prototype.destory = function() {
	if (this.defaults) {
		$(this.defaults.input).off('keyup.autocomplete keydown.autocomplete focus.autocomplete');
		this.defaults =  null;
	}

	return this;
};
