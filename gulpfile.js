const gulp = require('gulp');
const sequence = require('gulp-sequence');
const shell = require('gulp-shell');

gulp.task('clean', shell.task('rm -rf ./dist/'));

gulp.task('compile-ts', shell.task('tsc'));
gulp.task('compile-ts-umd', shell.task('tsc -m umd --outDir ./dist/umd/'));

gulp.task('copy-files', () => {
	return gulp.src('./package.json')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default', sequence('clean', 'compile-ts', 'pack', 'min', 'copy-files', 'compile-ts-umd'));

gulp.task('pack', function () {
	const browserify = require('browserify');
	const fs = require('fs');
	return browserify(['./dist/index.js'], {
		standalone: 'dask'
	})
		.bundle()
		.pipe(fs.createWriteStream('./dist/dask.js'));
});

gulp.task('min', function (cb) {
	const rename = require('gulp-rename');
	const babel = require('gulp-babel');
	const uglify = require('gulp-uglify');
	const pump = require('pump');
	pump([
		gulp.src('./dist/dask.js'),
		babel({
			presets: ['env'],
			plugins: ['transform-runtime']
		}),
		uglify(),
		rename('dask.min.js'),
		gulp.dest('./dist/')
	], cb);
});

gulp.task('watch-ts', shell.task('tsc -w'));

gulp.task('dev', ['watch-ts']);
