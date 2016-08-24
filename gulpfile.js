// Include gulp
var gulp = require('gulp'); 
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var karma = require('karma').Server;
var ngAnnotate = require('gulp-ng-annotate');
var minifyCss = require('gulp-clean-css');
var usemin = require('gulp-usemin');
var clean = require('gulp-clean');

var paths = {
  scripts: [ 'app/**/*.js', '!app/bower_components/**/*.js', '!app/**/*.spec.js' ],
  html: [
    './app/**/*.html',
    '!./app/index.html',
    '!./app/bower_components/**/*.html'
  ],
  index: './app/index.html',
  build: './build'
}

gulp.task('clean', function(){
  gulp.src( paths.build, { read: false } )
    .pipe(clean());
});

gulp.task('copy', [ 'clean' ], function() {
  gulp.src( paths.html )
      .pipe(gulp.dest('build/'));
});

gulp.task('test_continuous', (done) => {
  new karma({
    configFile: __dirname + '/karma.conf.js',
    captureConsole: false
  }, done ).start(); })

gulp.task('lint', () => {
  return gulp.src(paths.scripts)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

gulp.task('usemin', [ 'copy' ], function(){
  gulp.src( paths.index )
    .pipe(usemin({
      css: [ minifyCss(), 'concat' ],
      js: [babel({presets: ["es2015"] }), ngAnnotate(),  uglify().on('error', gutil.log) ]
    }))
    .pipe(gulp.dest( paths.build ))
});

gulp.task('build', ['clean', 'usemin']);

gulp.task('html', function () {
  gulp.src('./app/**/*.html')
      .pipe(connect.reload());
  gulp.src('./app/**/*.js')
      .pipe(connect.reload());
  gulp.src('./app/**/*.css')
      .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.html', './app/**/*.css', './app/**/*.js'], ['html', 'lint']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'app/',
    livereload: true
  });
});

gulp.task('default', ['connect', 'watch', 'test_continuous']);
