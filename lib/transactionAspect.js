define(['when'], function(when) {

	/**
	 * Aspect that wraps methods in an Atomize transaction, converting
	 * the method also to return a promise, since the transaction will
	 * run asynchronously
	 */
	return function(atomize) {
		return {
			around: function(methodCall) {
				var deferred, tries;

				deferred = when.defer();

				// Just for fun, track the number of retries
				tries = 0;

				// Start the transaction, and run the original method
				// within it.
				atomize.atomically(function () {
					tries++;

					// Proceed with the original method call, but inject the
					// Atomize root as a param.
					// This is almost certainly not the best way to give transactional
					// methods access atomize-managed objects.  We'll need to figure
					// that out.
					return methodCall.proceed(atomize.root);

				}, function(result) {
					// After the transaction completes, resolve the promise
					return when.chain(result, deferred);
				});

				// Return the promise that will resolve when the transaction
				// succeeds
				return deferred.promise;
			}
		};
	}
});