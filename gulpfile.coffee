gulp = require('gulp')
mocha = require('gulp-mocha')
eslint = require('gulp-eslint')

paths = {
  scripts: ['./*.js']
};

gulp.task('lint', () ->
  gulp.src(path.scripts)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
)

gulp.task('test', () ->
  gulp.src('./test/*.js').pipe(mocha({reporter: 'spec'}))
)

gulp.task('watch', () ->
  gulp.watch(paths.scripts, ['lint', 'test'])
)

gulp.task('default', ['lint', 'test', 'watch'])