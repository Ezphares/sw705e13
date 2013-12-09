(function() {
	var health_count_value;

	module('Board', {
		setup: function() {
			health_count_value = 21;
		}
	});

	test('health_count', function() {
			equal(Board.prototype.health_count(100, 80), health_count_value, 'I do math properly! Hooray!');
		});

})();