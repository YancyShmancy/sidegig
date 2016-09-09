var gulp = require('gulp');
var bs = require("browser-sync").create();

module.exports = function(options) {
    
  // Static Server + watching scss/html files
  gulp.task('serve', ['images', 'fonts', 'pages', 'inject', 'watch'], function() {
      
      bs.init({
          server: {
            baseDir: options.tmp + '/'
          } 
      });
  });
    
  gulp.task('watch', function() {
      
    gulp.watch(['./assets/sass/**/*.scss', 'assets/js/**/*.js', '*.html', './pages/*.html'], ['inject']);
    // and call any methods on it.
      bs.watch(['.tmp/*.html', '.tmp/pages/*.html']).on('change', bs.reload);
  });
}