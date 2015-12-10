var gulp = require('gulp'),
    del = require('del'),
    babel = require('gulp-babel'),
    webpack = require('webpack-stream');

var paths = {
  src: './src/',
  build: './build/',
  test: './test/',
  dist: './dist/'
};

gulp.task('clean-build', function() {
  return del([paths.build]);
});

gulp.task('clean-dist', function() {
  return del([paths.dist]);
});

gulp.task('js', function() {
  return gulp.src(paths.src + '**/*.js')
    .pipe(babel({ presets: ['es2015']}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('json', function() {
  return gulp.src(paths.src + '**/*.json')
    .pipe(gulp.dest(paths.build));
});

gulp.task('dist', ['build'], function() {
  return gulp.src([paths.build + '**/*', 'package.json', 'README.md'])
    .pipe(gulp.dest(paths.dist));
});

gulp.task('test', ['build'], function() {
  /*return gulp.src('test.js', { cwd: paths.test, read: false })
    .pipe(mocha());*/
  return;
});

gulp.task('watch', function() {
  gulp.watch(paths.src + '**/*.js', ['js']);
  gulp.watch(paths.src + '**/*.json', ['json']);
});

gulp.task('clean', ['clean-dist', 'clean-build']);

gulp.task('test', ['build', 'test-parser', 'test-response']);

gulp.task('build', ['json', 'js']);

gulp.task('default', ['build']);
