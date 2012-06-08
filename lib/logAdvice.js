(function(define, document) {
define(['when'], function(when) {

	/**
	 * Create promise-aware logger advice to log the data
	 * before the transaction starts and then again after
	 * it completes.
	 */
	return function(data) {
		return function(methodCall) {
			when(methodCall.proceed(), function() {
				log('Thing is now: ' + data.thing);
			});
		}
	};

	function log(message) {
		var p = document.createElement('p');
		p.innerHTML = message;
		document.body.appendChild(p);
	}

});
})(define, document);
