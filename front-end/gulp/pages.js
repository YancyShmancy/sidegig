var gulp = require('gulp');

module.exports = function(options) {
	
	gulp.task('pages', function() {
		return gulp.src(options.pagesDir + '/*.html')
				.pipe(gulp.dest(options.tmp + '/pages/'));
	})
	
	gulp.task('pages:build', function() {
		return gulp.src(options.pagesDir + '/*.html')
				.pipe(gulp.dest(options.dist + '/pages/'));
	})
}