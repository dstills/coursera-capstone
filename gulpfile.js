var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var usemin = require('gulp-usemin');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var changed = require('gulp-changed');
var sourceMaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');
var browserSync = require('browser-sync').create();
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('jshint', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('usemin:dev', ['jshint', 'uglify'], function() {
  return gulp.src('./app/**/*.html')
    .pipe(usemin({
      css:[minifycss(),rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('usemin:prod', ['jshint'], function() {
  return gulp.src('./app/**/*.html')
    .pipe(usemin({
      css:[minifycss(),rev()],
      js: [ngAnnotate(),uglify(),rev()]
      // ,html: [htmlmin({collapseWhitespace:true})]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function() {
  return del(['dist/images']), gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('uglify', function() {
  return gulp.src(['app/js/*.js'])
    .pipe(sourceMaps.init())
    .pipe(uglify())
    .pipe(sourceMaps.write('../maps'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copyfonts', ['clean'], function() {
  gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
  gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.scss')
    .pipe(sass({outputStyle:'compressed', includePaths:['http://js.arcgis.com/esri/css/']}).on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(['app/js/**/*.js', 'app/css/**/*.css', 'app/**/*.html'], ['usemin']);
  gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function() {
  var files = [
    'app/**/*.html',
    'app/css/**/*.css',
    'app/images/**/*.png',
    'app/js/**/*.js',
    'dist/**/*'
  ];

  browserSync.init(files, {
    server: {
      baseDir: 'dist',
      index: 'index.html'
    }
  });

  gulp.watch(['dist/**']).on('change', browserSync.reload);
});

gulp.task('browser-sync:dev', ['sass', 'compile'], function() {
  var files = [
    'app/**/*.html',
    'app/css/**/*.css',
    'app/images/**/*.png',
    'app/js/**/*.js',
    'dist/**/*'
  ];

  browserSync.init(files, {
    server: {
      baseDir: 'dist',
      index: 'index.html'
    }
  });

  gulp.watch(['app/sass/**'], ['sass']);
  gulp.watch(['dist/**']).on('change', browserSync.reload);
});

gulp.task('dev', ['browser-sync:dev'], function() {
  gulp.watch(['app/js/**/*.js', 'app/css/**/*.css', 'app/**/*.html'], ['usemin:dev']);
  gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('compile', ['clean'], function() {
  gulp.start('usemin:dev', 'imagemin', 'copyfonts');
});

gulp.task('default', ['clean'], function() {
  gulp.start('usemin:prod', 'imagemin', 'copyfonts');
});