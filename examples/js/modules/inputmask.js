/**
 *
 *   Inputmask
 *
 **/

'use strict';

App.modules.inputmask = (function() {

	$.subscribe('APP/bootstrap', _init);

	function _init() {

		$('input.inputmask').each(function() {
			_setup(this);
		});
	}

	function _setup(obj) {
		new Inputmask({
			'inputmask': obj,
			'pattern': '__/__/____',
			'maskCharacter': '_',
			'separatorCharacter': '/'
		});
	}

}());
