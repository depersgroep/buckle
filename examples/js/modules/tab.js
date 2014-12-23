/**
 *
 *   Tab
 *
 **/

'use strict';

(function() {

	$.subscribe('/tabs/show', _show);
	$.subscribe('/tabs/hide', _hide);

	function _init() {

		$('.fjs-tabs').each(function() {

			$(this).data('tabs', new Tabs({

				tabs: $('.fjs-tabs_nav li', $(this)),
				mouseEvent: $(this).data('event')

			}));

		});
	}

	function _show(args) {

		$(args.tab)
			.addClass('js-is-active')
			.attr('aria-selected', 'true');

		$(args.pane).addClass('js-is-active')
			.attr('aria-hidden', 'false')
			.attr('aria-expanded', 'true');
	}

	function _hide(args) {

		$(args.tab)
			.removeClass('js-is-active')
			.attr('aria-selected', 'false');

		$(args.pane)
			.removeClass('js-is-active')
			.attr('aria-hidden', 'true')
			.attr('aria-expanded', 'false');
	}

	$(window).on('load', _init);

}());
