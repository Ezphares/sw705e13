Game = function()
{
	// Default parameters:
	this.gl = new IfyGL({
		canvas: 'game',
		texturepath: 'static/img/',
		shaderpath: 'static/shaders/',
		width: 640,
		height: 480
	});
	this.state = 'Start';
	this.menu = null;
	this.board = null;
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
		f =  new Food(100, [2, 0]);
		game.menu = new Menu(activeb, inactiveb, tile, back, home);
		
		game.board.add_entity(f);
		c = new Cell([0, 0], 175, sprites[2], new Program(3), 1);
		r = new Cell([16,16], 100, sprites[3], new Program(3), 2);
		game.board.add_entity(c);
		game.board.add_entity(r);
		
		game.menu.draw_startmenu(game.gl);
		
		setInterval(function()
		{
			if(game.board.isDone() && game.state != 'Done'){
				game.state = 'Done';
				game.board.draw(game.gl);
			}	
			else if(game.state == 'InEditor'){
				console.log("#FriendlyCells: " + game.board.get_friendly_cells());
				game.board.draw(game.gl);
				game.board.update();
			}
		}, 1000);
	});
};

Game.prototype.doMouseMove = function(event)
{
	if (draggable)
	{
		mouseX = event.pageX - offset_x;
 		mouseY = event.pageY - offset_y;
 	}
 	console.log("x:", mouseX, "y:", mouseY, "draggable:", draggable)
}

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
	
	this.checkButton(this.state, canvas_x, canvas_y);
	this.onmousemove = this.doMouseMove(event);
};

Game.prototype.doMouseUp = function()
{
	console.log("mouseUp")
	draggable = false;
}

Game.prototype.checkButton = function(screen, x, y)
{
	var isChanged = false;
	if(x <= this.gl.width/2+128 && x >= this.gl.width/2-128)
	{
		//First button is pressed
		if(y >= this.gl.height/2-70-32 && y <= this.gl.height/2-70+32)
		{
			isChanged = true;
			if(this.state == 'Start'){
				this.state = 'Singleplayer';
			}
			else if(this.state === 'Singleplayer'){
				this.state = 'Challenges';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 1");
			}
			else if(this.state === 'Skirmish'){
				this.state = 'InEditor';
			}
		}
		//Second button is pressed
		else if(y >= this.gl.height/2-32 && y <= this.gl.height/2+32)
		{
			isChanged = true;
			if(this.state == 'Start'){
				alert("Multiplayer is not yet implemented");
			}
			else if(this.state === 'Singleplayer'){
				this.state = 'Skirmish';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 2");
			}
			else if(this.state === 'Skirmish'){
				alert("Go to import screen");
			}
		}
		//Third button is pressed
		else if(y >= this.gl.height/2+70-32 && y <= this.gl.height/2+70+32)
		{
			isChanged = true;
			if(this.state == 'Start'){
				alert("Go to manual");
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 3");
			}
		}
		//Fourth button is pressed
		else if(y >= this.gl.height/2+140-32 && y <= this.gl.height/2+140+32)
		{
			isChanged = true;
			if(this.state == 'Start'){
				this.state = 'InEditor';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 4");
			}
		}
	}
	else if(x >= 0 && x <= 32 && y <= this.gl.height && y >= this.gl.height-32){
		if(this.state == 'Singleplayer' || this.state == 'Multiplayer'){
			isChanged = true;
			this.state = 'Start';
		}
		else if(this.state === 'Challenges' || this.state === 'Skirmish'){
			isChanged = true;
			this.state = 'Singleplayer';
		}
	}
	else if(x > 40 && x <= 70 && y <= this.gl.height && y >= this.gl.height-32){
		if(this.state != 'Start' && this.state != 'InEditor' && this.state != 'InGame'){
			isChanged = true;
			this.state = 'Start';
		}
	}
	
	if(isChanged){
		this.update();
	}
};

Game.prototype.update = function()
{
	// Menu relevant code
	if(this.state === 'Start'){
		this.menu.draw_startmenu(this.gl);
	}
	else if(this.state === 'Singleplayer') {
		this.menu.draw_singleplayermenu(this.gl);
	}
	else if(this.state === 'Multiplayer'){
		alert("Multiplayer not yet implemented");
	}
	else if(this.state === 'Challenges') {
		this.menu.draw_challengesmenu(this.gl);
	}
	else if(this.state === 'Skirmish'){
		this.menu.draw_skirmishmenu(this.gl);
	}
	
	// TODO: *** TEMPORARY CODE TO TEST THE BOARD - WHEN EDITOR IS IMPLEMENTED THIS HAS TO BE CHANGED TO DRAW THAT INSTEAD OF THE BOARD ***
	else if(this.state === 'InEditor'){
		this.board.draw(this.gl);
	}
};
