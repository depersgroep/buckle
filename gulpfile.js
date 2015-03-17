'use strict';

// gulpfile.js for web-javascript-libraries
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify'),
	uglify = require('gulp-uglify'),
	yuidoc = require('gulp-yuidoc'),
	jscs = require('gulp-jscs'),
	testemMulti = require('testem-multi'),
	fs = require('fs');

// gulp-testem is not far as good as grunt-testem
// copied the necessary code from grunt-testem and adjusted accordingly
gulp.task('testem', ['jshint'], function() {
	testemMulti.exec(null, 'testem.json');

	testemMulti.on('data', function(data) {
		var matches = {};

		data = '' + data;

		matches.path = data.match(/^# Executing (.+)$/);
		matches.fail = data.match(/^not ok ([\s\S]+)/);

		if (matches.path) {
			gutil.log(matches.path[0]);
		}

		if (matches.fail) {
			gutil.log(matches.fail[0]);
		}
	});

	testemMulti.on('exit', function(results, memo) {
		var tests = memo.tests,
			pass = memo.pass,
			// not = memo.not,
			fail = memo.fail;

		fs.writeFileSync('_test/tmp/results.tap', results || '');

		if (tests !== pass || fail) {
			gutil.log(gutil.colors.red('' + fail + '/' + tests + ' assertions failed'));
		} else {
			gutil.log(gutil.colors.green('' + tests + ' assertions passed'));
		}

		process.exit();
	});
});

// Yui doc
gulp.task('yuidoc', function() {
	return gulp.src([
		'./src/**/*.js',
		'!./src/3rdparty/*.js'
	])
	.pipe(yuidoc({
		project: {
			name: 'De Persgroep Publishing',
			description: 'Communication layer',
			version: '0.1'
		}
	}, {
		themedir: 'gulp/yuidoc/bootstrap',
		helpers: ['gulp/yuidoc/bootstrap/helpers/helpers.js']
	}))
	.pipe(gulp.dest('./docs'))
	.on('error', function() {
		gutil.beep();
		this.emit('end');
	});
});

// JS jscs
gulp.task('jscs', function() {
	return gulp.src([
		'./src/**/*.js',
		'./gulpfile.js',
		'!./src/3rdparty/*.js'
	])
	.pipe(jscs());
});

// JS jshint
gulp.task('jshint', function() {
	return gulp.src([
		'./src/**/*.js',
		'!./src/3rdparty/*.js'
	])
	.pipe(jshint('.jshintrc'))
	.on('error', function() {
		gutil.beep();
		this.emit('end');
	})
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(jshint.reporter('fail'));
});

// JS ALL
gulp.task('js', ['jshint', 'jscs', 'yuidoc'], function() {
	return gulp.src('./src/**/*.js')
	.pipe(uglify({
		compress: {
			/* jshint camelcase: false */
			// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			hoist_funs: false // hoist function declarations - otherwise functions are alphabetized, which can cause errors
			// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
			/* jshint camelcase: true */
		}
	}))
	.pipe(gulp.dest('./dist'))
	.pipe(notify({
		message: 'JS rebuild',
		onLast: true
	}));
});

// Watch
gulp.task('watch', function() {
	gulp.watch([
		'./src/**/*.js',
		'./gulpfile.js'
	], ['js']);
});

// Default tasks..
gulp.task('default', ['js', 'watch']);
gulp.task('test', ['testem']);
