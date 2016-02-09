/**
 *
 *   Autocomplete
 *
 **/

'use strict';

App.modules.autocomplete = (function() {
	$.subscribe('APP/bootstrap', _init);

	function _init() {
		$('input.autocomplete').each(_setup);
	}

	function _setup(elm) {
		new Autocomplete({
			'input': elm,
			'appendTo': document.querySelector('ol'),
			'url': 'data/items.json?query=',
			'onSelectCallback': function(selectedValue) {
				console.log(selectedValue);
			},
			'itemElement': document.querySelector('li').cloneNode(true),
			'activeClass': 'js-is-active',
			'minLength': 2
		});
	}
}());
