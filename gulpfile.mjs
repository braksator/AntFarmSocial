import gulp from 'gulp';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import fs from 'fs';

gulp.task('default', function () {
  return gulp.src('./css/*.css')
  .pipe(cleanCSS())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./'))
  &&
  gulp.src('./js/*.js')
    .pipe(replace('[%AFSV%]', JSON.parse(fs.readFileSync('./package.json')).version)) // Replace [%AFSV%] in code with app version.
    .pipe(concat('afs.min.js'))
    .pipe(terser({ecma: 7, mangle: {toplevel: true}}))
    .pipe(gulp.dest('./'))
});

gulp.watch(['./css/*.css', './js/*.js'], gulp.series('default'));

