'use strict';

var App = {
	config: {
		formErrors: {
			empty: 'Dit veld mag niet leeg zijn',
			unchecked: 'U moet dit veld aanvinken',
			invalidEmail: 'Gelieve een bestaand email adres in te voeren'
		}
	},
	modules: [],
	views: {
		dialog: []
	}
};

App.main = (function() {
	function _init() {
		$.publish('APP/bootstrap');
	}

	function _load() {
		$.publish('APP/load');
	}

	return {
		init: _init,
		load: _load
	}
}());

// DOM loaded with IE fix:
if (document.attachEvent){
	document.attachEvent('onreadystatechange', function(){
		if (document.readyState==='complete'){
			App.main.init();
		}
	});
}else{
	$(document).on('DOMContentLoaded', App.main.init);
}
$(window).on('load', App.main.load);
