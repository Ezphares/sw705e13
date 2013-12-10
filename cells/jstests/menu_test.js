(function() {
	/* VARIABLE DECLARATION */
	var menu;
	var game;
	
	/* MODULE DEFINITION - SETUP CALLED BEFORE EACH TEST */
	module('Menu', {
		setup: function() {
			menu = new Menu(0, 0, 0, 0);
			game = new Game();
		}
	});

	test('isButtonHit', function() {
			//Button is not hit
			/* Since width of sprite is 256, we know that the center (320) + 129 is should not be a button hit */
			equal(Menu.prototype.isButtonHit(320+129, 240, game.gl), false, 'isButtonHit: Succeed if button is not hit');
			
			//Button is hit
			equal(Menu.prototype.isButtonHit(320, 240, game.gl), true, 'isButtonHit: Succeed if button is hit');
		});
})();