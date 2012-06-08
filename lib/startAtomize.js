define(['when'], function(when) {

	return function startAtomize(url) {
		var atomize, started;

		atomize = new Atomize(url || "http://localhost:9999/atomize");
		started = when.defer();
		atomize.onAuthenticated = started.resolve;

		atomize.connect();

		return when(started.promise, function() { return atomize; });
	}

});