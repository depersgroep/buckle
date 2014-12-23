/**
 *
 *   Validate
 *
 **/


'use strict';

App.modules.validate = (function() {

	$.subscribe('APP/bootstrap', _init);
	$.subscribe('/validate/error/show', _showError);
	$.subscribe('/validate/error/remove', _removeError);

	function _init() {

		$('form[data-validate]').each(function() {

			if ($(this).data('validate')) {

				var form = new Validate({
					frm: this
				});
			}

		});
	}

	function _showError(args) {

		var div = document.createElement('div');
		div.className = 'js-form__error error';

		if ($(args.field).attr('data-error')) {

			div.innerHTML = $(args.field).attr('data-error');
		} else {

			div.innerHTML = args.message;
		}

		$(div).appendTo($(args.field).parent());
	}

	function _removeError(args) {

		$('.js-form__error', $(args.field).parent()).remove();
	}

}());
