var gulp = require('gulp');
var rimraf = require('rimraf');
var markdown = require('gulp-markdown');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');

var buildDir = './gen';
var outDir = './';
var packages = [
  'ui',
  'pack',
  'server',
  'routes',
  'component',
  'platform',
  'request',
  'reducer',
  'object-assign',
  'raf-batching'
];

var src = {
  index: './pages/index.html',
  start: '../reapp/README.md',
  ui: '../reapp-ui/docs/*',
  modules: packages.map(function(name) { return '../reapp-'+name+'/README.md' })
};

gulp.task('clean', function(cb) {
  return rimraf(buildDir, cb);
});

gulp.task('modules', ['clean'], function() {
  return gulp
    .src(src.modules, { base: '../' })
    .pipe(rename(function (path) {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.md';
    }))
    .pipe(markdown())
    .pipe(concat('modules.html'))
    .pipe(wrap({ src: './templates/page.html' }))
    .pipe(wrap({ src: './templates/layout.html' }))
    .pipe(gulp.dest(outDir));
});

gulp.task('ui', ['clean'], function() {
  return gulp
    .src(src.ui)
    .pipe(rename(function (path) {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.md';
    }))
    .pipe(markdown())
    .pipe(concat('ui.html'))
    .pipe(wrap({ src: './templates/page.html' }))
    .pipe(wrap({ src: './templates/layout.html' }))
    .pipe(gulp.dest(outDir));
});

gulp.task('start', ['clean'], function() {
  return gulp
    .src(src.start)
    .pipe(rename(function (path) {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.md';
    }))
    .pipe(markdown())
    .pipe(concat('start.html'))
    .pipe(wrap({ src: './templates/page.html' }))
    .pipe(wrap({ src: './templates/layout.html' }))
    .pipe(gulp.dest(outDir));
});

gulp.task('index', function() {
  return gulp
    .src(src.index)
    .pipe(concat('index.html'))
    .pipe(wrap({ src: './templates/layout.html' }))
    .pipe(gulp.dest(outDir));
});

gulp.task('watch', function() {
  gulp.watch(src.index, ['index']);
  gulp.watch(src.modules, ['modules']);
  gulp.watch(src.start, ['start']);
  gulp.watch(src.ui, ['ui']);
})

gulp.task('default', ['modules', 'ui', 'start', 'index']);