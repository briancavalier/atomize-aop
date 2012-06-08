define(function() {

	/**
	 * Simple handler to show a result in the DOM
	 */
	return function(node) {
		return function(data) {
			node.innerHTML = data;
		}
	};

});
