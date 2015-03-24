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
					frm: this,
					onError: _showError,
					onRemoveError: _removeError,
					onValidationComplete: _validationsAllDone,
					i18n: {
						empty: 'Dit veld mag niet leeg zijn (custom i18n)',
						unchecked: 'U moet dit veld aanvinken (custom i18n)',
						invalidEmail: 'Gelieve een bestaand email adres in te voeren (custom i18n)',
						invalidTelephone: 'Geldig nummer aub (custom i18n)'
					}
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

	function _validationsAllDone(args) {
		console.log('I checked everything for you!');
	}

}());
