'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

/*
 * 変更を監視してブラウザリロード
 */
gulp.task('serve', function () {
	browserSync({
		server: {
			baseDir: './shooting/**/*.js'
		}
	});
});

/*
 * localhostサーバー
 */
gulp.task('connect', function () {
	connect.server({
		root: './',
		livereload: true
	});
});

gulp.task('html', function () {
	gulp.src('./*.html').pipe(connect.reload());
});

/*
 * Babel
 */
gulp.task('babel', function () {
	gulp.src('./*.js').pipe(babel()).pipe(gulp.dest('./'));
});

/*
 * ファイルの変更を監視
 */
gulp.task('watch', function () {
	gulp.watch('./*.js', './*.html', ['babel']);
});

gulp.task('default', ['connect', 'serve', 'babel', 'watch']);