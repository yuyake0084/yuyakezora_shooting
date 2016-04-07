
const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const webserver = require('gulp-webserver');
const uglify = require('gulp-uglify');

/*
 * 変更を監視してブラウザリロード
 *
 * livereload: ture（ライブリロード実行）
 * open: true（実行と同時に）
 */
gulp.task('webserver', function() {
	gulp.src('./')
		.pipe(webserver({
			host: 'localhost',
			port: 8080,
			livereload: true,
			directoryListing: true,
			open: true
		})
	);
});

gulp.task('html', function() {
	gulp.src('./*.html').pipe(connect.reload());
});

/*
 * Babel
 */
gulp.task('babel', function() {
	return gulp.src('./app/main.js')
		.pipe(plumber())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist'));
});

/*
 * ファイルの変更を監視
 */
gulp.task('watch', function() {
	gulp.watch('./dist/*.js', ['babel']);
});

/*
 * ミニファイ化
 */
gulp.task('uglify', function() {
	gulp.src('./');
});

/*
 * デフォルトタスク
 */
gulp.task('default', ['webserver', 'babel', 'watch']);