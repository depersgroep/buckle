module.exports = {
	js: {
		files: [
			'<%= package.jssrc %>/**'
		],
		tasks: [
			'jshint',
			'yuidoc',
			'uglify',
			'notify:changes'
		]
	}
};
