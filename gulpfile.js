'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  minifyCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  changed = require('gulp-changed');

var SASS_SRC = './src/sass/**/*.scss',
  SASS_DES_PATH = './src';

gulp.task('sass', function () {
  gulp.src(SASS_SRC)
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(changed(SASS_DES_PATH))
    .pipe(concat('index.css'))
    .pipe(gulp.dest(SASS_DES_PATH));
});

gulp.task('watch', function () {
  gulp.watch(SASS_SRC, ['sass']);
});

gulp.task('default', ['watch']);