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
		doInTransaction: function(data) {
			data.thing = (data.thing||0) + 1;
		}
	};
});