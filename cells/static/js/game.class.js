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
	this.state = "InMenu";
	this.tile; //Tile sprite
	this.spr_c1;
	this.spr_c2;
	this.tick_cnt = 0;
	this.tick_rate = 30; // tick_rate / frame_rate
};

var mouseX;
var mouseY;
var offset_x;
var offset_y;

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
						 {filename: 'health_bar_red_end.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'start_button.png', frame_width: 32, frame_height: 32, origin: [0,0]}];

	Editor.load_sprites(this.gl, function()
	{
		game.gl.load_sprites(sprite_loader, function(sprites)
		{
			game.tile = sprites[0];
			game.spr_c1 = sprites[2];
			game.spr_c2 = sprites[3];
			var food = sprites[1];
			var back = sprites[6];
			var home = sprites[7];
			var start = sprites[12];
			var activeb = sprites[4];
			var inactiveb = sprites[5];

			healthbar_green_start = sprites[8];
			healthbar_green_mid   = sprites[9];
			healthbar_red_mid     = sprites[10];
			healthbar_red_end     = sprites[11];
			
			Food.sprite = food;
			
			game.menu = new Menu(activeb, inactiveb, game.tile, back, home, start);

			game.update();
			
			setInterval(function()
			{
				game.update();
				game.draw();
				
			}, 17);
		});
	});
};

Game.prototype.doMouseMove = function(event)
{
	mouseX = event.pageX - offset_x;
 	mouseY = event.pageY - offset_y;

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
	this.menu.update(canvas_x, canvas_y, this.gl)
};

Game.prototype.doMouseUp = function()
{
	//console.log("mouseUp")
	canvas_x = -1;
	canvas_y = -1;
};

Game.prototype.display_info = function()
{
	console.clear();
	console.log("Game state: " + this.state);
	console.log("Board:");
	console.log(this.board);
	console.log("Editor:");
	console.log(this.editor);
	console.log("Menu:");
	console.log(this.menu);
};

Game.prototype.draw = function()
{
	this.menu.draw(this.gl);
	if(this.board != null && this.board.isDone() && this.state != 'Done'){
		this.state = 'Done';
		this.board.draw(this.gl);
	}
	else if(this.state == 'InGame'){
		if(this.tick_cnt == 0){
			this.tick_cnt++;
			this.board.draw(this.gl);
			this.board.update();
		}
		else if(this.tick_cnt < this.tick_rate){
			this.tick_cnt++;
		}
		else if(this.tich_cnt == this.tich_rate){
			this.tick_cnt = 0;
		}
	}
	else if(this.state == 'InEditor'){
		this.editor.draw(this.gl);
		this.drag.draw(this.gl);
	}
};

Game.prototype.update = function()
{
	if(this.state == 'InMenu'){
		if(this.menu.state == 'InEditor'){
			this.state = 'InEditor';
		}
	}
	else if(this.state == 'InEditor'){
		this.editor = new Editor(5);
		this.drag = new Drag();
		
		if(this.menu.state == 'Start'){
			this.state = 'InMenu';
		}
		else if(this.menu.state == 'InGame'){
			this.state = 'InGame';
			this.board = new Board(10, this.tile);
			f =  new Food(100, [2, 0]);
			cell1 = new Cell([0, 0], 175,  this.spr_c1, this.editor.program, 1);
			cell2 = new Cell([16,16], 100, this.spr_c2, this.editor.program, 2);
			this.board.init(f, cell1, cell2);
		}
	}
	else if(this.state == 'Done'){
		if(this.board.playerWins())
			alert("YOU WIN!");
		else
			alert("YOU WERE DEFEATED!");
		
		this.menu.state = 'Start';
		this.state = 'InMenu';
		this.editor = null;
		this.board = null;
	}
};