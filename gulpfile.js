var gulp = require('gulp'),
    del = require('del'),
    babel = require('gulp-babel'),
    webpack = require('webpack-stream');

var paths = {
  src: './src/',
  build: './build/'
};

gulp.task('clean', function() {
  return del([paths.build]);
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

gulp.task('build', ['json', 'js']);

gulp.task('default', ['build']);
