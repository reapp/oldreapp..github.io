var gulp = require('gulp');
var rimraf = require('rimraf');
var markdown = require('gulp-markdown');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

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
  posts: __dirname + '/posts',
  css: 'assets/styles/*.css',
  templates: './templates/*',
  index: './pages/index.html',
  start: '../reapp/README.md',
  ui: '../reapp-ui/docs/*',
  modules: packages.map(function(name) {
    return '../reapp-' + name + '/README.md';
  })
};

gulp.task('clean', function(cb) {
  return rimraf(buildDir, cb);
});


// HOME

gulp.task('index', function() {
  return gulp
    .src(src.index)
    .pipe(concat('index.html'))
    .pipe(wrap({ src: './templates/layout.html' }))
    .pipe(gulp.dest(outDir));
});


// BLOG

gulp.task('blog', function() {
  buildPosts();
});

function buildPosts() {
  Metalsmith(src.posts)
    .use(markdown())
    .destination('./build')
    .build();
}


// PAGES

gulp.task('modules', ['clean'], function() {
  return makePage('modules');
});

gulp.task('ui', ['clean'], function() {
  return makePage('ui');
});

gulp.task('start', ['clean'], function() {
  return makePage('start');
});

function makePage(name) {
  return gulp
    .src(src[name], { base: '../' })
    .pipe(rename(function(path) {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.md';
    }))
    .pipe(markdown())
    .pipe(concat(name + '.html'))
    .pipe(wrap({ src: './templates/page.html' }))
    .pipe(wrap({ src: './templates/layout.html' }))
    .pipe(gulp.dest(outDir));
}


// CSS

gulp.task('css', function() {
  return gulp
    .src(src.css)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./assets/styles'));
});


// WATCH

gulp.task('watch', function() {
  gulp.watch(src.index, ['index']);
  gulp.watch([src.templates, src.modules], ['modules']);
  gulp.watch([src.templates, src.start], ['start']);
  gulp.watch([src.templates, src.ui], ['ui']);
  gulp.watch(src.css, ['css']);
});

gulp.task('default', ['modules', 'ui', 'start', 'index']);