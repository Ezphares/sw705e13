
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

Game.prototype.init = function()
{
	var game = this;
	var gl = this.gl; //Used because of call back
	var canvas = document.getElementById('game');
	this.gl.init();
	
	canvas.addEventListener('mousedown', function(event)
	{
		game.doMouseDown(event);
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
		
		game.menu.draw(gl);
		
		setInterval(function()
		{
			console.log(game.state);
			//game.update();
		}, 1000);
	});
};

Game.prototype.doMouseDown = function(event)
{
	B = document.body;
	H = document.documentElement;
	width = Math.max( B.scrollWidth, B.offsetWidth, H.clientWidth, H.scrollWidth, H.offsetWidth);
	offset_x = Math.ceil((width-640)/2);
	offset_y = 50;
	
	canvas_x = event.pageX-offset_x;
	canvas_y = event.pageY-offset_y;
	
	this.checkButton(this.state, canvas_x, canvas_y);
	this.update();
};

Game.prototype.checkButton = function(screen, x, y)
{
	var isChanged = false;
	if(x <= this.gl.width/2+128 && x >= this.gl.width/2-128)
	{
		//First button is pressed
		if(y >= 480/2-70-32 && y <= 480/2-70+32)
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
		else if(y >= 480/2-32 && y <= 480/2+32)
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
		else if(y >= 480/2+70-32 && y <= 480/2+70+32)
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
		else if(y >= 480/2+140-32 && y <= 480/2+140+32)
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
	
	if(isChanged){
		this.update();
	}
};

Game.prototype.update = function()
{
	this.menu.draw_background(this.gl);
	
	if(this.state === 'Start'){
		this.menu.draw_startmenu(this.gl);
	}
	else if(this.state === 'Singleplayer') {
		this.menu.draw_singleplayermenu(this.gl);
	}
	else if(this.state === 'Multiplayer'){
		
	}
	else if(this.state === 'Challenges') {
		this.menu.draw_challengesmenu(this.gl);
	}
	else if(this.state === 'Skirmish'){
		this.menu.draw_skirmishmenu(this.gl);
	}
	else if(this.state === 'InEditor'){
		alert("Go to editor");
	}
	else if(this.state === '1' || this.state === '2' || this.state === '3' || this.state === '4'){
		alert("Go to challenge " + this.state);
	}
	
	this.board.update();
};
