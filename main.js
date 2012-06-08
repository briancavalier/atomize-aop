define(['./lib/startAtomize', './component', './transactionAspect', 'when', 'aop'],
function(startAtomize, component, createTransactionAspect, when, aop) {

	// Main module that starts up atomize, creates an application component,
	// and shows how it's methods can be wrapped in atomize transactional
	// advice.

	var started, instance;

	// Startup Atomize and bootstrap some shared data
	started = startAtomize().then(bootstrapDataIfNecessary);

	// Some component instance whose methods we want to make transactional
	instance = Object.create(component);

	// Once atomize has started, and the data has been bootstrapped,
	// call a method on the now-transaction-ified instance.
	when(started, function(atomize) {
		return instance.doInTransaction().then(
			function() {
				log('END: ' + atomize.root.thing);
			}
		);
	});

	function bootstrapDataIfNecessary(atomize) {
		// Apply transactional advice to the instance's doInTransaction method,
		// making it run within an atomize transaction
		aop.add(instance, 'doInTransaction', createTransactionAspect(atomize));

		// Return a new promise that will resolve once the data
		// has been bootstrapped.
		var bootstrapped = when.defer();
		atomize.atomically(
			function () {
				// Bootstrap the shared data if necessary
				if(!atomize.root.thing) {
					atomize.root.thing = 0;
				}

				// Log the data that this client started with
				log('START: ' + atomize.root.thing);
			},
			function() {
				bootstrapped.resolve(atomize);
			}
		);

		return bootstrapped.promise;
	}

	function log(message) {
		var p = document.createElement('p');
		p.innerHTML = message;
		document.body.appendChild(p);
	}

});