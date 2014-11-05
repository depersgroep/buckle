module.exports = {
	js: {
		files: [
			'<%= package.jssrc %>/**'
		],
		tasks: [
			'jshint',
			'yuidoc',
			'notify:changes'
		]
	}
};
