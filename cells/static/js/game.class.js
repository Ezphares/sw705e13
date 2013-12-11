Game = function()
{
	this.gl = new IfyGL({
		canvas: 'game',
		texturepath: 'static/img/',
		shaderpath: 'static/shaders/',
	});
	this.menu = null;
	this.board = null;
	this.editor = null;
};

var mouseX;
var mouseY;
var draggable = false;

Game.prototype.init = function()
{
	var game = this;
	var canvas = document.getElementById(this.gl.canvas);
	this.gl.init();
	
	canvas.addEventListener('mousedown', function(event)
	{
		game.doMouseDown(event);
	}, false);

	canvas.addEventListener('mouseup', function()
	{
		game.doMouseUp(event);
	}, false);

	canvas.addEventListener('mousemove', function(event)
	{
		game.doMouseMove(event);
	}, false);

	var sprite_loader = [{filename: 'tile.png', frame_width: 32, frame_height: 32, origin: [8,8]},
						 {filename: 'food.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'cell_green.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'cell_red.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'active_button2.png', frame_width: 256, frame_height: 64, origin: [128,32]},
						 {filename: 'inactive_button2.png', frame_width: 256, frame_height: 64, origin: [128,32]},
						 {filename: 'back_arrow.png', frame_width: 32, frame_height: 32, origin: [0,0]},
						 {filename: 'home_button.png', frame_width: 32, frame_height: 32, origin: [0,0]},
						 {filename: 'health_bar_green_start.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'health_bar_green_mid.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'health_bar_red_mid.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'health_bar_red_end.png', fame_width: 16, frame_height: 16, origin: [0,0]}];

	this.gl.load_sprites(sprite_loader, function(sprites)
	{
		var tile = sprites[0];
		var food = sprites[1];
		var back = sprites[6];
		var home = sprites[7];
		var activeb = sprites[4];
		var inactiveb = sprites[5];

		healthbar_green_start = sprites[8];
		healthbar_green_mid   = sprites[9];
		healthbar_red_mid     = sprites[10];
		healthbar_red_end     = sprites[11];
		
		Food.sprite = food;
		
		game.board = new Board(10, tile);
		game.menu = new Menu(activeb, inactiveb, tile, back, home);
		game.editor = new Editor(6);
		
		f =  new Food(100, [2, 0]);
		c = new Cell([0, 0], 175, sprites[2], new Program(3), 1);
		r = new Cell([16,16], 100, sprites[3], new Program(3), 2);
		
		game.board.init(f, c, r);

		game.update();
		
		setInterval(function()
		{
			// Is the game done?
			if(game.menu.state == 'Done'){
				game.menu.state = 'Start';
				game.board = new Board(10, tile);
				f =  new Food(100, [2, 0]);
				c = new Cell([0, 0], 175, sprites[2], new Program(3), 1);
				r = new Cell([16,16], 100, sprites[3], new Program(3), 2);
				game.board.init(f, c, r);
				game.update();
			}
			else if(game.board.isDone() && game.menu.state != 'Done'){
				game.menu.state = 'Done';
				game.board.draw(game.gl);
			}	
			// Is the game in the editor?
			/*else if(game.menu.state == 'InEditor'){
				game.editor.test();
			}*/
			// Is the game running?
			else if(game.menu.state == 'InEditor'){
				game.board.draw(game.gl);
				game.board.update();
			}
			
		}, 1000);
	});
};

Game.prototype.doMouseMove = function(event)
{
	if (draggable){
		mouseX = event.pageX - offset_x;
 		mouseY = event.pageY - offset_y;
 	}
 	//console.log("x:", mouseX, "y:", mouseY, "draggable:", draggable)
};

Game.prototype.doMouseDown = function(event)
{
	B = document.body;
	H = document.documentElement;
	width = Math.max( B.scrollWidth, B.offsetWidth, H.clientWidth, H.scrollWidth, H.offsetWidth);
	offset_x = Math.ceil((width-this.gl.width)/2);
	offset_y = 50;
	
	canvas_x = event.pageX - offset_x;
	canvas_y = event.pageY - offset_y;
	draggable = true;
	if(this.menu.isButtonHit(canvas_x, canvas_y, this.gl)){
		this.update();
	}
};

Game.prototype.doMouseUp = function()
{
	//console.log("mouseUp")
	draggable = false;
};

Game.prototype.update = function()
{
	// Menu relevant code
	if(this.menu.state === 'Start'){
		this.menu.draw_startmenu(this.gl);
	}
	else if(this.menu.state === 'Singleplayer') {
		this.menu.draw_singleplayermenu(this.gl);
	}
	else if(this.menu.state === 'Multiplayer'){
		alert("Multiplayer not yet implemented");
	}
	else if(this.menu.state === 'Challenges') {
		this.menu.draw_challengesmenu(this.gl);
	}
	else if(this.menu.state === 'Skirmish'){
		this.menu.draw_skirmishmenu(this.gl);
	}
	
	// TODO: *** TEMPORARY CODE TO TEST THE BOARD - WHEN EDITOR IS IMPLEMENTED THIS HAS TO BE CHANGED TO DRAW THAT INSTEAD OF THE BOARD ***
	/*else if(this.menu.state === 'InEditor'){
		alert("Go to editor: This is use temp code to this board");
		this.editor.test();
		//this.board.draw(this.gl);
	}*/
	else if(this.menu.state === 'InEditor'){
		//this.board.draw();
	}
};