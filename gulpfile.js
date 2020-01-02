const { series,parallel,src,dest } = require('gulp');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

function build() {
  return watch('./src/*.js', function(){
  	src([
  	'./src/05-copyright.js',
  	'./src/10-start.js',
    './src/11-const.js',
  	'./src/20-vector.js',
  	'./src/30-matrix.js',
    './src/301-matrix2.js',
    './src/35-leq.js',
    './src/40-lpbrute.js',
    './src/41-lpinp.js',
    './src/42-lpsimplex.js',
    './src/50-problem.js',
    './src/505-mps.js',
    './src/51-lpproblem.js',
    './src/52-lpgeneral.js',
    './src/53-lpstandard.js',
    './src/80-utils.js',
  	'./src/90-finish.js'
  	])
  	.pipe(concat('wsolver.js'))
    .pipe(dest('dist/'));  	
  });
}  

if (process.env.NODE_ENV === 'production') {
	exports.watch = build;
} else {
	exports.watch = build;
}

