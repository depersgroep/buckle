module.exports = {
	compile: {
      name: 'De Persgroep Publishing',
      description: 'Communication layer',
      version: '0.1',
      options: {
        paths: '<%= package.jssrc %>',
        outdir: './docs',
        themedir: 'grunt/yuidoc/bootstrap',
        helpers : [ 'grunt/yuidoc/bootstrap/helpers/helpers.js' ],
        exclude: '3rdparty'
      }
    }
};
