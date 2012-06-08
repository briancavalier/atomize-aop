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
		updateValue: function(data) {
			data.value = (data.value||0) + 1;
			return data.value;
		}
	};
});