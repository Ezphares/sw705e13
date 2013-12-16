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
})();