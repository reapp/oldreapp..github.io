var gulp = require('gulp');
var rimraf = require('rimraf');
var markdown = require('gulp-markdown');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');

var buildDir = './gen';
var outDir = './docs';

gulp.task('clean', function(cb) {
  return rimraf(buildDir, cb);
});

gulp.task('copy', ['clean'], function() {
  return gulp
    .src('../*/README.md')
    .pipe(rename(function (path) {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.md';
    }))
    .pipe(markdown())
    .pipe(
      gulp.dest(buildDir)
    );
});

gulp.task('make-pages', ['copy'], function() {
  return gulp.src([buildDir + '/*.html'])
    .pipe(concat('components.html'))
    .pipe(wrap({src: './layout.html'}))
    .pipe(gulp.dest(outDir));
});

gulp.task('default', ['make-pages']);