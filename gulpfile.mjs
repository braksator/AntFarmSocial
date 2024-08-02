import gulp from 'gulp';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import fs from 'fs';

var analyzeStrings = true;
var isDev = process.argv[process.argv.length - 1] == '--dev';

function findRepeatedSubstrings(text, maxResults = 100, minLength = 4, maxLength = 30, minOccurences = 2) {
  const cleanedText = text.replace(/[^\w]/g, ' '); // Replace non-word characters with spaces
  const words = cleanedText.split(/\s+/); // Split text into words
  let substrings = {};
  // Iterate over the words to find substrings
  for (let word of words) {
    for (let length = minLength; length <= maxLength; length++) {
      for (let i = 0; i <= word.length - length; i++) {
        let substring = word.substring(i, i + length);
        if (!substrings[substring]) {
          substrings[substring] = 0;
        }
        substrings[substring]++;
      }
    }
  }
  // Filter and map substrings to the format { substring, count, score }
  let results = Object.keys(substrings)
    .filter(substring => substrings[substring] >= minOccurences)
    .map(substring => ({
      substring: substring,
      count: substrings[substring],
      score: substring.length * Math.max(3, substrings[substring])  // Repeated strings are weighted slightly, but that's capped.
    }));
  // Sort results by score in descending order
  results.sort((a, b) => b.score - a.score);
  // Remove substrings of already included results
  let filteredResults = [];
  let seen = new Set();
  for (let result of results) {
    if (![...seen].some(s => s.includes(result.substring))) {
      filteredResults.push(result);
      seen.add(result.substring);
    }
  }
  // Return the top maxResults
  return filteredResults.slice(0, maxResults);
}

function analyzeString() {
  // Do it.
  var files = ['./index.html', './afs.min.css', './afs.min.js'];
  for (var f = 0; f < files.length; f++) {
    var text = fs.readFileSync(files[f], { encoding: 'utf8', flag: 'r' });
    let res = [];
    let minWordSize = 4, times = 6;
    for (var len = minWordSize * times; len >= minWordSize; len -= minWordSize) {
      var result = findRepeatedSubstrings(text, 20, len);
      res = res.concat(result);
    }
    let output = [];
    for (var i = 0; i < res.length; i++) {
      // If this is the first or last result or isn't a subset of an adjacent result, then include it in the output.
      if (i == 0 ||  i == res.length - 1 || !res[i - 1].substring.includes(res[i].substring) && !res[i + 1].substring.includes(res[i].substring)) {
        output.push(res[i].substring + " (" + res[i].count + "x)");
      }
    }
    output = Array.from(new Set(output));
    var out = '\r\nAnalysis of repeated strings in "' + files[f] + '": ' + output.join(', ');
    console.log(out);
  }
  if (!isDev) {
    console.log("\r\nNOTE: Run 'gulp --dev' to use raw (un-minified) html/js/css for debugging ease.");
  }
  console.log(' ');
}

gulp.task('analyze', function (done) {
  if (analyzeStrings) {
    analyzeString();
    analyzeStrings = 0;
  }
  setTimeout(() => {analyzeStrings = 1}, 1000 * 60 * 60); // Only run once an hour.
  done(); // Signal completion
});

gulp.task('minify-css', function () {
  return gulp.src('./src/*.css')
    .pipe(replace('url(../img/', 'url(./img/'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./'));
});

gulp.task('minify-js', function () {
  return gulp.src('./src/*.js')
    .pipe(replace('THIS IS A DEV VERSION OF AFS AND SHOULD NOT BE PUBLISHED!', 'v' + JSON.parse(fs.readFileSync('./package.json')).version)) // Replace dev notice in code with app version.
    .pipe(concat('afs.min.js'))
    .pipe(terser({ ecma: 7, mangle: { toplevel: true, reserved: ['restart', 'xPop', 'xRen', 'dump'] } }))
    .pipe(gulp.dest('./'));
});

gulp.task('minify-html', function () {
  var stream;
  if (isDev) {
    stream = gulp.src('./src/*.html')
      .pipe(gulp.dest('./'));
  } else {    
    stream = gulp.src('./src/*.html')
      .pipe(replace('./src/afs.css', 'afs.min.css'))
      .pipe(replace('<script src="./src/afsItems.js"></script><script src="./src/afsData.js"></script><script src="./src/afs.js"></script>', '<script src="afs.min.js"></script>'))
      
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('./'));
  }
  return stream;
});

gulp.task('default', gulp.series(
  gulp.parallel('minify-css', 'minify-js', 'minify-html'),
  'analyze'
));


gulp.watch(['./src/*'], gulp.series('default'));

