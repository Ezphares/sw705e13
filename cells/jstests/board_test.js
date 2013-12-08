module('Board');
test('health_count', function() {
	equal(Board.prototype.health_count(100, 80), 21);
});