module.exports = {
	all: {
        files : {
          '_test/tmp/result.tap': ['_SpecRunner.html']
        }
	},
	options : {
        output: {
          coverage: '_test/tmp/coverage/from_browsers/'
        },
        routes: {
          "/instrumented": "_test/instrumented"
        },
		launch_in_ci : [
			// 'safari',
			'chrome'
			// 'firefox'
			// 'phantomjs'
		]
	}
};