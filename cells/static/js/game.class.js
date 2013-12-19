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
var drag_sprite = 'empty';

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
						 {filename: 'cell_green.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'cell_red.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'food.png', frame_width: 16, frame_height: 16, origin: [0,0]}];

	Menu.load_sprites(this.gl, function()
	{});
	
	Board.load_sprites(this.gl, function(){});
	
	Editor.load_sprites(this.gl, function()
	{
		game.gl.load_sprites(sprite_loader, function(sprites)
		{
			game.tile = sprites[0];
			game.spr_c1 = sprites[1];
			game.spr_c2 = sprites[2];
			Food.sprite = sprites[3];
			
			game.menu = new Menu(game.gl);
			game.update();
			
			(function render()
			{
				game.update();
				game.draw();
				requestAnimFrame(render);
			})();
		});
	});
};

Game.prototype.doMouseMove = function(event)
{
	mouseX = event.pageX - offset_x;
 	mouseY = event.pageY - offset_y;
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
	//this.menu.update(canvas_x, canvas_y, this.gl);
	this.menu.update(canvas_x, canvas_y);

	if (this.editor)
		this.editor.click([canvas_x, canvas_y]);
};

Game.prototype.doMouseUp = function()
{
	if(drag_sprite != 'empty'){
		this.editor.drop([mouseX, mouseY], drag_sprite);
	}
	drag_sprite = 'empty';
	canvas_x = -1;
	canvas_y = -1;
};

Game.prototype.draw = function()
{
	this.menu.draw(this.gl);
	if(this.board != null && this.board.isDone() && this.state != 'Done'){
		this.state = 'Done';
		this.board.draw(this.gl);
	}
	else if(this.state == 'InGame'){
		this.board.draw(this.gl);
	}
	else if(this.state == 'InEditor'){
		this.editor.draw(this.gl);
		this.drag.draw(this.gl);
	}
};

Game.prototype.update = function()
{
	if(this.state == 'InMenu' || this.menu.state == 'InEditor'){
		if(this.menu.state == 'InEditor'){
			this.state = 'InEditor';
			if(this.editor == null){
				this.editor = new Editor(5);
			}
			
			this.drag = new Drag();
		}
	}
	else if(this.state == 'InEditor'){
		if(this.menu.state == 'Start'){
			this.state = 'InMenu';
		}
		else if(this.menu.state == 'InGame'){
			this.state = 'InGame';
			
			//this.board = new Board(10, this.tile);
			this.board = new Board(10);
			
			cell1 = new Cell([0, 0], 175,  this.spr_c1, this.editor.program, 1);
			cell2 = new Cell([18,18], 100, this.spr_c2, new Program(3), 2);
			this.board.init(cell1, cell2);
			
			/* Friendly side food*/
			this.board.add_entity(new Food(100, [2, 0]));
			this.board.add_entity(new Food(100, [0, 2]));
			this.board.add_entity(new Food(100, [2, 2]));
			this.board.add_entity(new Food(100, [5, 0]));
			this.board.add_entity(new Food(100, [0, 5]));
			this.board.add_entity(new Food(100, [5, 5]));
			this.board.add_entity(new Food(100, [9, 0]));
			this.board.add_entity(new Food(100, [0, 9]));
			
			/* Center food placement */
			this.board.add_entity(new Food(150, [8, 10]));
			this.board.add_entity(new Food(200, [9,  9]));
			this.board.add_entity(new Food(150, [10, 8]));
			
			/* Enemy side food */
			this.board.add_entity(new Food(100, [16, 18]));
			this.board.add_entity(new Food(100, [18, 16]));
			this.board.add_entity(new Food(100, [16, 16]));
			this.board.add_entity(new Food(100, [13, 18]));
			this.board.add_entity(new Food(100, [18, 13]));
			this.board.add_entity(new Food(100, [13, 13]));
			this.board.add_entity(new Food(100, [ 9, 18]));
			this.board.add_entity(new Food(100, [18,  9]));
		}
		else if(this.menu.state == 'Clean'){
			this.editor.new_program();
			this.menu.state = 'InEditor';
		}
	}
	else if(this.state == 'InGame'){
		if(this.tick_cnt == 0){
			this.tick_cnt++;
			this.board.update();
		}
		else if(this.tick_cnt < this.tick_rate){
			this.tick_cnt++;
		}
		else if(this.tich_cnt == this.tich_rate){
			this.tick_cnt = 0;
		}
	}
	else if(this.state == 'Done'){
		if(this.board.playerWins())
			alert("YOU WIN!");
		else
			alert("YOU WERE DEFEATED!");
		
		this.menu.state = 'Start';
		this.state = 'InMenu';
		this.board = null;
	}
};