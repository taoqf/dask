const gulp = require('gulp');

gulp.task('clean', function () {
	const del = require('del');
	return del('./dist/');
});

gulp.task('compile-ts', (cb) => {
	const ts = require('gulp-typescript');
	const tsProject = ts.createProject('./tsconfig.json');
	// tsProject.options.module = 1;	// 'none' 0, 'CommonJS' 1, 'Amd' 2, 'System' 3, 'UMD' 4, or 'es2015'.5
	const dest = tsProject.options.outDir;
	return tsProject.src()
		.pipe(tsProject())
		.pipe(gulp.dest(dest));
});

gulp.task('copy-files', () => {
	return gulp.src('./package.json')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default', function (cb) {
	const sequence = require('gulp-sequence');
	return sequence('clean', 'compile-ts', 'pack', 'min', 'copy-files', cb);
});

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
			presets: ['latest'],
			plugins: ['transform-runtime']
		}),
		uglify(),
		rename('dask.min.js'),
		gulp.dest('./dist/')
	], cb);
});

gulp.task('watch-ts', () => {
	const ts = require('gulp-typescript');
	const path = require('path');
	return gulp.watch(['./src/**/*.ts'], (file) => {
		const tsProject = ts.createProject('./tsconfig.json');
		const relative = path.relative('./src/', path.dirname(file.path));
		const dest = tsProject.options.outDir;
		return gulp.src([file.path])
			.pipe(tsProject())
			.pipe(gulp.dest(dest));
	});
});

gulp.task('dev', ['watch-ts']);
