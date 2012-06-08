define(['when'], function(when) {

	var atomize;

	return {
		wire$plugin: function(ready, destroyed, options) {
			if(!atomize) {
				atomize = startAtomize(options.url);
			}

			var plugin = {
				resolvers: {
					atomize: function(resolver, name, refObj, wire) {
						when(atomize, function(atomize) {
							if(!name) return resolver.resolve(atomize);

							resolver.resolve(name == ':root' ? atomize.root : atomize.root[name]);
						});
					}
				}
			};

			// Force wire to wait for atomize to finish intializing??
			return when(atomize, function() {
				return plugin;
			});
		}
	};

	function startAtomize(url) {
		var atomize, started;

		atomize = new Atomize(url);

		started = when.defer();
		atomize.onAuthenticated = started.resolve;

		atomize.connect();

		return when(started.promise, function() { return atomize; });
	}

});