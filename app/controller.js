define(function() {
	/**
	 * Some simple application component that has methods that
	 * need to run within a transaction
	 */
	return {
		/**
		 * This method needs to run within a transaction
		 * @param data {Object} transactional data we care about
		 */
		incrementValue: function(value) {
			return (value||0) + 1;
		},

		/**
		 * When the value changes, this method renders it
		 * @param value
		 */
		renderValue: function(value) {
			this.node.innerHTML = value||0;
		}
	};
});