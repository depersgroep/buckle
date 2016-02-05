'use strict';
/**
 *
 *	Our inputmask module is used to mask an input field which should contain a date: dd/mm/jjjj
 *
 *
 *	@class Inputmask
 *	@constructor
 *
 *	@property {Element} inputmask The dom element that needs to be inputmasked
 *	@property {String} pattern The pattern to be displayed/used
 *	@property {String} maskCharacter The character to be shown when empty
 *	@property {String} separatorCharacter The character used to separate the date
 *
 *	@example
 *
 *		new Inputmask({
 *		'inputmask': document.querySelector('input'),
 *		'pattern': '__/__/____',
 *		'maskCharacter': '_',
 *		'separatorCharacter': '/'
 *	});
 *
 *
 */

function Inputmask(args) {
	var _this = this,
		previousValue,
		previousCursorPos,
		regexNumbers = /\d+/g,
		regexNotNumbers = /[^\d+]/g,
		regexMask,
		regexSeparator,
		characterCountInPattern,
		separatorIndexes,
		separatorIndexesLength,
		patternLength;

	if (args) {
		this.defaults = {
			inputmask: (args.inputmask ? args.inputmask : null),
			pattern: (args.pattern ? args.pattern : null),
			maskCharacter: (args.maskCharacter ? args.maskCharacter : null),
			separatorCharacter: (args.separatorCharacter ? args.separatorCharacter : null)
		};

		// Must be input field + must support setSelectionRange --> no IE8 support
		if (this.defaults.inputmask && this.defaults.inputmask.tagName.toLowerCase() === 'input' && typeof this.defaults.inputmask.setSelectionRange === 'function' &&
			this.defaults.pattern && this.defaults.maskCharacter && this.defaults.separatorCharacter) {
			attachHandlers();
			initValues();
		}
	}

	function attachHandlers() {
		var $inputmask = $(_this.defaults.inputmask);

		$inputmask.on('focus.inputmask', maskElement);
		$inputmask.on('blur.inputmask', unMaskElement);

		if (onInputSupport()) {
			$inputmask.on('input.inputmask', inputHandler);
			$inputmask.on('keyup.inputmask', updateCursorPos);
		} else {
			// no input or bad input support
			$inputmask.on('keydown.inputmask', keyDownHandler, $inputmask);
		}

		// recalculate cursorPosition
		$inputmask.on('mouseup.inputmask', updateCursorPos);

		$inputmask.on('paste.inputmask', paste); // disable paste
	}

	function initValues() {
		previousValue = _this.defaults.inputmask.value || _this.defaults.pattern;

		regexMask = new RegExp(_this.defaults.maskCharacter, 'g');
		regexSeparator = new RegExp(_this.defaults.separatorCharacter, 'g');

		characterCountInPattern = (_this.defaults.pattern.match(regexMask) || []).length;

		separatorIndexes = findSeparatorCharacters((_this.defaults.inputmask.value || _this.defaults.pattern));
		separatorIndexesLength = separatorIndexes.length;

		patternLength = _this.defaults.pattern.length;
	}

	/* Handlers */
	function maskElement() {
		if (_this.defaults.inputmask.value === '') {
			_this.defaults.inputmask.value = _this.defaults.pattern;
		}

		// set cursor to first maskCharacter
		window.setTimeout(function() {
			var index = _this.defaults.inputmask.value.indexOf(_this.defaults.maskCharacter);

			if (index >= 0) {
				setCursorPosition(index);
			}

			previousCursorPos = getCursorPosition();
		}, 0);
	}

	function unMaskElement() {
		if (_this.defaults.inputmask.value === _this.defaults.pattern) {
			_this.defaults.inputmask.value = '';
		}
	}

	function keyDownHandler(e, $inputmask) {
		var keyCode = e.keyCode || e.which;

		if (keyCode >= 96 && keyCode <= 105) {
			keyCode -= 48;
		}

		/*
			48-57 = numeric ==> NOT numeric
			8 = backspace
			46 = delete
			37 = left arrow
			39 = right arrow
		*/
		if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 46 && keyCode !== 37 && keyCode !== 39) {
			// don't trigger keyup
			$inputmask.off('keyup.inputmask');

			// prevent the character from being inserted
			e.preventDefault();
		} else {
			// add keyup when typing any other character, but first remove it, otherwise multiple handlers
			$inputmask.off('keyup.inputmask').on('keyup.inputmask', keyUpHandler);
		}
	}

	function keyUpHandler(e) {
		updateCursorPos(e);
		inputHandler(e);
	}

	function inputHandler() {
		var cursorPos = getCursorPosition(),
			value = _this.defaults.inputmask.value,
			newValue,
			notNumberCount,
			additionalMaskCharacters,
			i = 0,
			x = 0,
			added = false,
			indexOfFirstMask = -1;

		if (previousValue.length > value.length) {
			// removed
			if (previousCursorPos === cursorPos) {
				// delete
				if (previousValue.substr(cursorPos, 1) === _this.defaults.separatorCharacter) {
					// a slash was deleted ==> delete the next character
					value = value.substr(0, cursorPos) + _this.defaults.separatorCharacter + value.substr(cursorPos + 1);
					cursorPos += 1;
				}
			} else {
				// backspace
				if (value.substr(cursorPos - 1, 1) === _this.defaults.separatorCharacter) {
					// move the cursor to before the separatorCharacter
					cursorPos -= 1;
				} else {
					// if you click just before the separatorCharacter and press backspace, then delete the character before the separatorCharacter
					if (previousValue.substr(cursorPos, 1) === _this.defaults.separatorCharacter) {
						// a slash was deleted ==> delete the previous character
						value = value.substr(0, cursorPos - 1) + _this.defaults.separatorCharacter + value.substr(cursorPos);
						cursorPos -= 1;
					}
				}
			}
		} else {
			// added
			// update cursor pos when writing a none-number
			notNumberCount = (value.replace(regexMask, '').replace(regexSeparator, '').match(regexNotNumbers) || []).length;

			if (notNumberCount > 0) {
				cursorPos -= notNumberCount;
			} else {
				added = true;
			}

			// check if we need to jump one after the separator
			if (previousCursorPos < cursorPos) {
				if (previousValue.substr(cursorPos - 1, 1) === _this.defaults.separatorCharacter) {
					cursorPos += 1;
				}
			}
		}

		newValue = (value.match(regexNumbers) || []).join('');
		additionalMaskCharacters = characterCountInPattern - newValue.length;

		// add additional mask characters
		for (i; i < additionalMaskCharacters; i++) {
			newValue += '_';
		}

		// replace the separator characters
		for (x; x < separatorIndexesLength; x++) {
			newValue = newValue.substr(0, separatorIndexes[x]) + _this.defaults.separatorCharacter + newValue.substr(separatorIndexes[x]);
		}

		if (newValue.length > patternLength) {
			newValue = newValue.substr(0, patternLength);
		}

		if (added) {
			// suppose someone clicked on the last _ and started typing there ==> update the cursor pos to resemble the correct spot
			indexOfFirstMask = newValue.indexOf(_this.defaults.maskCharacter);

			if (indexOfFirstMask >= 0) {
				cursorPos = indexOfFirstMask;
			}
		}

		// update input field
		_this.defaults.inputmask.value = newValue;

		// update previous values for future comparison
		previousValue = _this.defaults.inputmask.value;
		previousCursorPos = cursorPos;

		setCursorPosition(cursorPos);
	}

	function paste(e) {
		e.preventDefault();
	}

	/* Helper function */
	function updateCursorPos(e) {
		var keyCode = e.keyCode || e.which;
		/*
			37 = left arrow
			39 = right arrow
			229 = damn android "bug" which always returns the wrong keyCode!
		*/
		if (e.type !== 'keyup' || (e.type === 'keyup' && keyCode === 37 || keyCode === 39 || keyCode === 229)) {
			previousCursorPos = getCursorPosition();
		}
	}

	function onInputSupport() {
		// window.atob is to check if we're dealing with IE9, which does have oninput, but doesn't trigger on backspace, delete, ...
		return 'oninput' in _this.defaults.inputmask && typeof window.atob !== 'undefined';
	}

	function findSeparatorCharacters(value) {
		var arr = [],
			index,
			i = 0;

		while ((index = value.indexOf(_this.defaults.separatorCharacter, i)) >= 0) {
			i = index + 1;
			arr.push(index);
		}

		return arr;
	}

	function getCursorPosition() {
		var position = 0,
			selectRange,
			selectRangeLength;

		if (document.selection) {
			_this.defaults.inputmask.focus();
			selectRange = document.selection.createRange();
			selectRangeLength = selectRange.text.length;
			selectRange.moveStart('character', -_this.defaults.inputmask.value.length);
			position = selectRange.text.length - selectRangeLength;
		} else if (_this.defaults.inputmask.selectionStart || _this.defaults.inputmask.selectionStart === '0') {
			position = _this.defaults.inputmask.selectionStart;
		}

		return position;
	}

	function setCursorPosition(index) {
		var range;

		if (_this.defaults.inputmask !== null) {
			if (_this.defaults.inputmask.createTextRange) {
				range = _this.defaults.inputmask.createTextRange();

				range.move('character', index);
				range.select();
			} else {
				if (_this.defaults.inputmask.selectionStart) {
					_this.defaults.inputmask.focus();

					_this.defaults.inputmask.setSelectionRange(index, index);
				} else {
					_this.defaults.inputmask.focus();
				}
			}
		}
	}

	return this;
}

/**
 *
 *	@method destroy
 *	@for Inputmask
 *
 *	@description
 *	destroys the inputmask instance
 *
 *	@example
 *
 *		var obj = new Inputmask({
 *		'inputmask': document.querySelector('input'),
 *		'pattern': '__/__/____',
 *		'maskCharacter': '_',
 *		'separatorCharacter': '/'
 *	});
 *	obj.destroy();
 *
 */
Inputmask.prototype.destroy = function() {
	// destroy it
	if (this.defaults) {
		Arbiter.publish('/inputmask/destroy', this.defaults);

		$(this.defaults.inputmask).off('focus.inputmask blur.inputmask input.inputmask keyup.inputmask keydown.inputmask paste.inputmask');

		// remove the defaults
		this.defaults = null;
	}

	return this;
};
