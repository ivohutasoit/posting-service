'use stict'

const eslint = require('gulp-eslint')
const gulp = require('gulp')
//const gulpif = require('gulp-if')
const nodemon = require('gulp-nodemon')

/* function isFixed(file) {
  return file.eslint != null && file.eslint.fixed;
} */

// Tasks 
gulp.task('start', () => {
  nodemon({
    script: './src/index',
    ext: 'js html',
    tasks: ['lint']
  })
})

gulp.task('lint', () => {
  gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    //.pipe(gulpif(isFixed, gulp.dest('./formatted/fixtures')))
    .pipe(eslint.failAfterError())
})

// Default
gulp.task('default', ['start', 'lint'])
