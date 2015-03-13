'use strict';

// gulpfile.js for web-javascript-libraries
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	del = require('del'),
	jshint = require('gulp-jshint'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify'),
	uglify = require('gulp-uglify'),
	yuidoc = require('gulp-yuidoc'),
	jscs = require('gulp-jscs'),
	shell = require('gulp-shell'),
	testem = require('gulp-testem');

// Clean
gulp.task('clean', function() {
	return del('./_test/tmp');
});

gulp.task('instrument', shell.task('istanbul instrument --output _test/instrumented src/classes'));

gulp.task('testem', function() {
	return gulp.src('')
	.pipe(testem({
		configFile: 'testem.json'
	}));
});

gulp.task('report', function() {
	return shell.task('istanbul report --root _test/tmp/coverage/from_browsers --dir coverage lcov');
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
		themedir: 'grunt/yuidoc/bootstrap',
		helpers: ['grunt/yuidoc/bootstrap/helpers/helpers.js']
	}))
	.pipe(gulp.dest('./docs'))
	.on('error', function() {
		gutil.beep();
		this.emit('end');
	});
});

// JS jscs
gulp.task('jscs', function() {
	gulp.src([
		'./src/**/*.js',
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
	gulp.watch('./src/**/*.js', ['js']);
});

// Default tasks..
gulp.task('default', ['js', 'watch']);
gulp.task('test', ['jshint', 'clean', 'instrument', 'testem', 'report']);
