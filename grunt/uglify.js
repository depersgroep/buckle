module.exports = {
	options: {
		mangle: false,
		compress: true,
		beautify: false
	},
	prod: {
		files: [{
          expand: true,
          cwd: '<%= package.jssrc %>',
          src: ['**/*.js'],
          dest: '<%= package.js %>'
      }]
	}
};
