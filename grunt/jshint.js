module.exports = {
	options: {
		curly: true,
		browser: true,
		jquery: true,
		node: true,
		camelcase: true,
		eqeqeq: true,
		eqnull: true,
		indent: 4,
		latedef: 'nofunc',
		newcap: true,
		quotmark: 'single',
		validthis: true,
		trailing: true,
		undef: true,
		unused: true,
		strict: true,
		globals: {
			'$': true,
			'bean': true,
			'bonzo': true,
			'qwery': true,
			'moment': true,
			'reqwest': true,
			'Arbiter': true,
			'App': false,
			'util': false
		},
		reporter: require('jshint-stylish')
	},
	all: ['<%= package.jssrc %>/*.js']
};
