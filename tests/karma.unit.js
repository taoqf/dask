module.exports = function (config) {
	config.set({
		frameworks: ['mocha', 'should'],
		files: [
			'./*.test.js'
		],
		plugins: [
			'karma-mocha',
			'karma-should',
			'karma-webpack',
			'karma-mocha-reporter',
			'karma-chrome-launcher'
		],
		coverageReporter: {
			type: 'html'
		},
		preprocessors: {
			'**/*.test.js': ['webpack']
		},
		reporters: ['mocha'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['Chrome'],
		// browsers: ['PhantomJS'],
		singleRun: true
	});
};
