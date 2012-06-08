define(['./component', './transactionAspect', 'when', 'aop'],
	function(component, createTransactionAspect, when, aop) {

	function log(message) {
		var p = document.createElement('p');
		p.innerHTML = message;
		document.body.appendChild(p);
	}

	var atomize, ready, object;

	atomize = new Atomize("http://localhost:9999/atomize");
	ready = when.defer();
	atomize.onAuthenticated = ready.resolve;

	object = Object.create(component);
	aop.add(object, 'doInTransaction', createTransactionAspect(atomize));

	when(ready, function () {
		atomize.atomically(function () {
			if(!atomize.root.thing) {
				atomize.root.thing = '0';
			}

			log('START: ' + atomize.root.thing);
		});
	});

	when(ready, function() {
		return object.doInTransaction().then(
			function() {
				log('END: ' + atomize.root.thing);
			}
		);
	});

	atomize.connect();

});