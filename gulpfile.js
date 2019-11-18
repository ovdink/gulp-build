'use strict';

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer');

// for img compression use Squoosh or TinyPng

gulp.task('clean', async () => {
  del.sync('dist');
});

gulp.task('scss', () => {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', () => {
  return gulp
    .src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
      'node_modules/magnific-popup/dist/magnific-popup.css'
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', () => {
  return gulp.src('app/*.html').pipe(browserSync.reload({ stream: true }));
});

gulp.task('script', () => {
  return gulp.src('app/js/*.js').pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', () => {
  return gulp
    .src([
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
});

gulp.task('build', async () => {
  gulp.src('app/**/*.html').pipe(gulp.dest('dist'));
  gulp.src('app/css/**/*.css').pipe(gulp.dest('dist/css'));
  gulp.src('app/js/*.js').pipe(gulp.dest('dist/js'));
  gulp.src('app/fonts/**/*.*').pipe(gulp.dest('dist/fonts'));
  gulp.src('app/img/**/*.*').pipe(gulp.dest('dist/img'));
});

gulp.task('watch', () => {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('html'));
  gulp.watch('app/js/*.js', gulp.parallel('script'));
});

gulp.task('make', gulp.series('clean', 'build'));

gulp.task(
  'default',
  gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch')
);
