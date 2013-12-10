(function() {
	/* VARIABLE DECLARATION */
	var game;
	var menu;

	/* MODULE DEFINITION - SETUP CALLED BEFORE EACH TEST */
	module('Game', {
		setup: function() {
			game = new Game();
			menu = new Menu(0,0,0,0);
			menu.state = 'Start';
			game.menu = menu;
			game.init();
		}
	});
})();