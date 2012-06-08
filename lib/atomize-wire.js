define(['js!atomize.js!exports=Atomize', 'when', 'aop'],
function(Atomize, when, aop) {

	// For now, we'll treat atomize as a singleton
	var atomize;

	return {
		/**
		 * wire plugin that starts atomize if not already started
		 * and provides an atomize! resolver and a transactional
		 * facet that can be applied to make methods transactional.
		 * @param ready
		 * @param destroyed
		 * @param options
		 * @return {Object}
		 */
		wire$plugin: function(ready, destroyed, options) {
			// Start atomize if it hasn't been started yet
			if(!atomize) {
				atomize = startAtomize(options.url);

				// Turn on logging if it was specified in the options
				if(options.logging) {
					when(atomize, function(atomize) {
						atomize.logging(true);
					});
				}
			}

			return {
				resolvers: {
					atomize: atomizeResolver
				},
				facets: {
					transactional: {
						create: addTransactionalAspect
					}
				}
			};
		}
	};

	/**
	 * Provide a wire $ref resolver that allows you to reference either
	 * the atomize singleton (maybe not a good idea in the long run), or
	 * some sub-portion of atomize.root
	 * Examples:
	 * $ref: 'atomize!foo' // resolves
	 * @param resolver
	 * @param name
	 * @param refObj
	 * @param wire
	 */
	function atomizeResolver(resolver, name, refObj, wire) {
		when(atomize, function(atomize) {
			if(!name) return resolver.resolve(atomize);

			atomize.atomically(function() {
				return name == ':root' ? atomize.root : atomize.root[name];
			}, resolver.resolve);
		});
	}

	/**
	 * Apply an aspect that will make methods transactional
	 * @param resolver
	 * @param facet
	 * @param wire
	 */
	function addTransactionalAspect(resolver, facet, wire) {
		when(atomize, function(atomize) {
			return when(wire(facet.options), function(pointcut) {
				aop.add(facet.target, pointcut, createTransactionalAspect(atomize));
			});
		}).then(resolver.resolve, resolver.reject);
	}

	/**
	 * Returns an aspect that wraps methods in a transaction
	 * @param atomize
	 * @return {Object}
	 */
	function createTransactionalAspect(atomize) {
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
		}
	}

	/**
	 * Start atomize and return a promise that will resolve when it's
	 * ready to go
	 * @param url
	 * @return {*}
	 */
	function startAtomize(url) {
		var atomize, started;

		atomize = new Atomize(url);

		started = when.defer();
		atomize.onAuthenticated = started.resolve;

		atomize.connect();

		return when(started.promise, function() { return atomize; });
	}

});