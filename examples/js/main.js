'use strict';

var App = {

	config: {},
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

$(document).on('DOMContentLoaded', App.main.init);
$(window).on('load', App.main.load);
