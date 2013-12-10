(function() {
	/* VARIABLE DECLARATION */
	var game;
	
	/* MODULE DEFINITION - SETUP CALLED BEFORE EACH TEST */
	module('Game', {
		setup: function() {
			game = new Game();
		}
	});

	test('doMouseDown', function() {
			var mousedown = new MouseEvent('mousedown');
			equal(Game.prototype.doMouseDown(mousedown), false, 'doMouseDown: Succeed');
		});
})();