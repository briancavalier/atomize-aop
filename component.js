define(function() {
	return {
		doInTransaction: function(root) {
			root.thing = '' + (parseInt(root.thing) + 1);
		}
	};
});