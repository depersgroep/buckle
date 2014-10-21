module.exports = {
	js: {
		files: [
			'<%= package.jssrc %>/**'
		],
		tasks: [
			'jshint',
			'notify:changes'
		]
	}
};
