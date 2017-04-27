const del = require('del');
const gulp = require('gulp');

gulp.task('clean', function () {
	return del('./dist/');
});

gulp.task('compile-ts', (cb) => {
	const ts = require('gulp-typescript');
	const tsProject = ts.createProject('./tsconfig.json');
	// tsProject.options.module = 1;	// 'none' 0, 'CommonJS' 1, 'Amd' 2, 'System' 3, 'UMD' 4, or 'es2015'.5
	const dest = tsProject.options.outDir;
	console.info(tsProject.exclude);
	return tsProject.src()
		.pipe(tsProject())
		.pipe(gulp.dest(dest));
});

gulp.task('default', function (cb) {
	const sequence = require('gulp-sequence');
	sequence('clean', 'compile-ts', 'webpack', cb);
});

gulp.task('webpack', function (cb) {
	let dest = './dist/dask.min.js';
	const path = require('path');
	const ws = require('webpack-stream');
	const babel = require('gulp-babel');
	const named = require('vinyl-named');
	// const uglyfly = require('gulp-uglyfly');
	const webpack = require('webpack');
	const uglyfly = new webpack.optimize.UglifyJsPlugin({
		sourceMap: false
	});

	return gulp.src(['./dist/index.js'])
		// .pipe(named())
		// .pipe(babel({
		// 	// presets: ['es2015'],
		// 	plugins: [
		// 		'transform-es2015-template-literals',
		// 		'transform-es2015-literals',
		// 		'transform-es2015-function-name',
		// 		'transform-es2015-arrow-functions',
		// 		'transform-es2015-block-scoped-functions',
		// 		'transform-es2015-classes',
		// 		'transform-es2015-object-super',
		// 		'transform-es2015-shorthand-properties',
		// 		'transform-es2015-computed-properties',
		// 		'transform-es2015-for-of',
		// 		'transform-es2015-sticky-regex',
		// 		'transform-es2015-unicode-regex',
		// 		'check-es2015-constants',
		// 		'transform-es2015-spread',
		// 		'transform-es2015-parameters',
		// 		'transform-es2015-destructuring',
		// 		'transform-es2015-block-scoping',
		// 		'transform-es2015-typeof-symbol',
		// 		['transform-regenerator', { async: false, asyncGenerators: false }],
		// 	]
		// }))
		.pipe(ws({
			plugins: [uglyfly],
			externals: [],
			output: {
				publicPath: dest,
				// libraryTarget: 'umd',
				// umdNamedDefine: true
			},
			resolve: {
				modules: [
					path.resolve('src'),
					"node_modules"
				],
				alias: {
					// 'wx': 'jweixin',
					'weui': 'weui.js',
					'dot': 'dot/doT.js'
				}
			},
			module: {
				// Disable handling of unknown requires
				// unknownContextRegExp: /$^/,
				// unknownContextRegExp: /c00001/,
				unknownContextCritical: true,

				// Disable handling of requires with a single expression
				exprContextRegExp: /$^/,
				exprContextCritical: false,

				// Warn for every expression in require
				wrappedContextCritical: true,
				rules: [
					// { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: {/*presets:['es2015']*/}, plugins: ['transform-runtime']},	// error here: Error: The node API for `babel` has been moved to `babel-core`.
					{
						test: /\.(hson|json)$/,
						loader: 'hson-loader'
					}, {
						test: /\.(tpl|nools|md|ts)$/,
						loader: 'raw-loader'
					},
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
						query: {
							presets: ['es2015']
						}
					}
				]
			}
		}, webpack))
		// .pipe(uglyfly())
		.pipe(gulp.dest(dest));
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
