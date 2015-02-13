// gulpfile.js for APM Frontend
var banner = [
	'/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * @version v<%= pkg.version %>',
	' */',
	''
].join('\n');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var del = require('del');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var pkg = require('./package.json');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var yuidoc = require('gulp-yuidoc');
var jscs = require('gulp-jscs');
var shell = require('gulp-shell');
var testem = require('gulp-testem');


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
		helpers : ['grunt/yuidoc/bootstrap/helpers/helpers.js']
	}))
	.pipe(gulp.dest('./docs'))
	.on('error', function() {
		gutil.beep();
		this.emit('end');
	})
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
gulp.task('js', ['jshint', /*'jscs',*/ 'yuidoc'], function() {
	return gulp.src('./src/**/*.js')
	.pipe(uglify({
		compress: {
			hoist_funs: false // hoist function declarations - otherwise functions are alphabetized, which can cause errors
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
