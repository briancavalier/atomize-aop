define(['when'], function(when) {

	return function(atomize) {
		return {
			around: function(methodCall) {
				var deferred, tries;

				deferred = when.defer();
				tries = 0;

				atomize.atomically(function () {
					console.log('in transaction:', atomize.inTransaction(), 'retries:', tries);
					tries++;
					return methodCall.proceed(atomize.root);
				}, function(result) {
					return when.chain(result, deferred);
				});

				return deferred.promise;
			}
		};
	}
});