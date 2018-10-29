var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('build', function() {
    return gulp.src(['./src/wrapper/startWrapper.js', './src/*.js', './src/wrapper/endWrapper.js'])
    .pipe(concat("jaisLite.user.js"))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build'], function() {
	gulp.watch(['./src/*.js', './src/**/*.js'], ['build']);
});