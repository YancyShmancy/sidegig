var gulp = require('gulp');
var concat = require('gulp-concat');
var gnf = require('gulp-npm-files');

module.exports = function(options) {
    var vendorFiles = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular/angular.js'
    ];
    // Copy dependencies to build/node_modules/ 
    gulp.task('copyNpmDependenciesOnly', function() {
      gulp.src(gnf(), {base:'./'}).pipe(gulp.dest(options.dist));
    });
    
    gulp.task('vendor', function() {
        return gulp.src(vendorFiles)
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest(options.tmp + '/assets/js/vendor/'))
    });
    
    gulp.task('vendor:build', ['copyNpmDependenciesOnly'],  function() {
        return gulp.src(vendorFiles)
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest(options.dist + '/assets/js/vendor/'))
    });
}