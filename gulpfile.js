var gulp = require('gulp');
var babel = require('gulp-babel');


/*
 * Babel
 */
gulp.task('babel', function() {
	gulp.src('./*.js')
	.pipe(babel())
	.pipe(gulp.dest('./'));
});


/*
 * JSファイルの変更を監視
 */
gulp.task('watch', function() {
	gulp.watch('./*.js', ['babel']);
});


gulp.task('default', ['babel', 'watch']);