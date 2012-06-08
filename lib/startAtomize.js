define(['when'], function(when) {

	/**
	 * Start an Atomize client and connect to the supplied url, or
	 * to the default localhost:9999 url if url is not provided
	 * @param [url] {String} Atomize server url
	 * @return {Promise} a promise that resolves with the new
	 * Atomize client instance, which is connected and ready.
	 */
	return function startAtomize(url) {
		var atomize, started;

		atomize = new Atomize(url);
		
		started = when.defer();
		atomize.onAuthenticated = started.resolve;

		atomize.connect();

		return when(started.promise, function() { return atomize; });
	}

});