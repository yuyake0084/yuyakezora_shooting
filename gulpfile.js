
const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const connect = require('gulp-connect');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');

const reload = browserSync.reload();

/*
 * 変更を監視してブラウザリロード
 */
gulp.task('browserSync', () => {
	browserSync.init(null, {
		server: {
			baseDir: './'
		}
	});
	gulp.watch(['./app/**'], reload);
});

/*
 * localhostサーバー
 */
gulp.task('connect', () => {
	connect.server({
		root: 'app',
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
gulp.task('watch', () => {
	gulp.watch('./**/*.js', ['babel']);
});

/*
 * ミニファイ化
 */
gulp.task('uglify', () => {
	gulp.src('./');
});


gulp.task('default', ['browserSync', 'connect', 'babel', 'watch']);