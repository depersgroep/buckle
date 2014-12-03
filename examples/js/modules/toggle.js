'use strict';

App.modules.toggle = (function() {

	$.subscribe('APP/bootstrap', _init);

	function _init() {

		$('.fjs-toggle').data('toggle', new Toggle({
			toggle: $('.fjs-toggle'),
			trigger: $('.fjs-toggle'),
			toggleClick: true,
			onToggle: function() {

				$(this).toggleClass('bold');
			}
		}));

		$('.fjs-toggle2').data('toggle', new Toggle({
			toggle: $('.fjs-toggle2'),
			trigger: $('.fjs-toggle2'),
			mouseEvent: 'hover',
			toggleClick: true,
			onToggle: function() {

				$(this).toggleClass('bold');
			}
		}));
	}

}());
