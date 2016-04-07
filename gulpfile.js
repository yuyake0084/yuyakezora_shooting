var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var uglify = require('gulp-uglify');

/*
 * 変更を監視してブラウザリロード
 */
gulp.task('serve', () => {
	browserSync({
		server: {
			baseDir: './shooting/*'
		}
	});
	gulp.watch(['./**/'], reload);
});

/*
 * localhostサーバー
 */
gulp.task('connect', () => {
	connect.server({
		root: './',
		livereload: true
	});
});

gulp.task('html', () => {
	gulp.src('./*.html').pipe(connect.reload());
});

/*
 * Babel
 */
gulp.task('babel', () => {
	return gulp.src('./shooting/main.js')
	.pipe(plumber())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest('./dist'));
});

/*
 * ファイルの変更を監視
 */
gulp.task('watch', () => {
	gulp.watch('./**/*.js', ['babel']);
});

/*
 * ミニファイ化
 */
gulp.task('uglify', () => {
	gulp.src('./');
});


gulp.task('default', ['serve', 'connect', 'babel', 'watch']);