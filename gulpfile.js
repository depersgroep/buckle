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
	testem = require('testem');

gulp.task('testem', ['jshint'], function() {
	var testemOptions = {
			file: 'testem.json'
		},
		t = new testem();

	t.startCI(testemOptions);
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
gulp.task('test', ['testem']);
