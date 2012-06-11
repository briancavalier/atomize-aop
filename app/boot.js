(function() {

	// curl AMD loader config
	var config = {
		paths: {
			curl: '../lib/curl/src/curl',
			// Using a modified version of aop.js
			aop: 'lib/aop'
		},
		pluginPath: 'curl/plugin',
		packages: [
			{ name: 'wire', location: 'lib/wire', main: 'wire' },
			{ name: 'when', location: 'lib/when', main: 'when' }
		]
	};

	// Bootstrap the app by loading the main module
	curl(config, ['wire!app/main']);

})();