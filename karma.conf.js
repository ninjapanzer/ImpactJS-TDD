module.exports = function(config) {
	return config.set({
		basePath: 'builds/web',
		frameworks: ["jasmine"],
		files: [
			'../../test/test-spec.js',
			//'lib/impact/impact.js',  //From Impact JS
			//'lib/game/main.js',	//From Your game
			{
				pattern: 'lib/**/*', //Make sure that everything in the lib directory is served
				included: false,
				server: true
			},
			'../../test/unit/**/*.js'], 
		reporters: ['progress', 'junit'],
		proxies: {
			'/lib': 'http://localhost:8080/base/lib'  //Karma likes to put base inforont of things this keeps the names normalized
		},
		junitReporter: {
			outputFile: '../../test/reports/unit-test-results.xml',  //junit reporter
			suite: ''
		},
		exclude: [],
		port: 8080,
		logLevel: config.LOG_INFO,
		browsers: ["PhantomJS"],
		singleRun: true
	});
};