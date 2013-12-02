
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
	this.state = 'None';
};

Game.prototype.init = function()
{
	var game = this;
	
	this.gl.init();
	
	document.getElementById(this.gl.canvas).addEventListener('onMouseDown', function(event)
	{
		console.log(game.gl);
		game.doMouseDown(event);
	}, false);
	
	var sprite_loader = [{filename: 'tile.png', frame_width: 32, frame_height: 32, origin: [8,8]},
						 {filename: 'food.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'cell_green.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'cell_red.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'active_button.png', frame_width: 256, frame_height: 64, origin: [128,32]},
						 {filename: 'inactive_button.png', frame_width: 256, frame_height: 64, origin: [128,32]},
						 {filename: 'back_arrow.png', frame_width: 32, frame_height: 32, origin: [0,0]},
						 {filename: 'home_button.png', frame_width: 32, frame_height: 32, origin: [0,0]},
						 {filename: 'health_bar_green_start.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'health_bar_green_mid.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'health_bar_red_mid.png', frame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'health_bar_red_end.png', fame_width: 16, frame_height: 16, origin: [0,0]},
						 {filename: 'active_button2.png', fame_width: 256, frame_height: 64, origin: [128,32]},
						 {filename: 'inactive_button2.png', fame_width: 256, frame_height: 64, origin: [128,32]}];
	var gl = this.gl;				 
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
		
		b = new Board(10, tile);
		f =  new Food(100, [2, 0]);
		m = new Menu(activeb, inactiveb, tile, back, home);
		
		b.add_entity(f);
		c = new Cell([0, 0], 175, sprites[2], new Program(3), 1);
		r = new Cell([16,16], 100, sprites[3], new Program(3), 2);
		b.add_entity(c);
		b.add_entity(r);
		
		m.draw(gl);
		
		/*var game = this;
		setInterval(function()
		{
			this.update();
			//b.update();
			//b.draw(gl);
			//m.draw(gl);
		}, 1000);*/
	});
};

Game.prototype.doMouseDown = function(event)
{
	alert("Test");
	B = document.body;
	H = document.documentElement;
	width = Math.max( B.scrollWidth, B.offsetWidth, H.clientWidth, H.scrollWidth, H.offsetWidth);
	offset_x = Math.ceil((width-640)/2);
	offset_y = 50;
	
	canvas_x = event.pageX-offset_x;
	canvas_y = event.pageY-offset_y;
	
	this.checkButton('Start', canvas_x, canvas_y);
};

Game.prototype.checkButton = function(screen, x, y)
{
	//If x is between 256 and 384 && y is between 138 and 202, the user clicked square button 1
	if(x <= this.gl.width/2+64 && x >= this.gl.width/2-64)
	{
		if(y >= 480/2-70-32 && y <= 480/2-70+32)
			alert("X="+x+" Y="+y+"  Button 1");
		if(y >= 480/2-32 && y <= 480/2+32)
			alert("X="+x+" Y="+y+"  Button 2");
		if(y >= 480/2+70-32 && y <= 480/2+70+32)
			alert("X="+x+" Y="+y+"  Button 3");
		if(y >= 480/2+140-32 && y <= 480/2+140+32)
			alert("X="+x+" Y="+y+"  Button 4");
	}
	
	if(x <= this.gl.width/2+128 && x >= this.gl.width/2+64 || (x >= this.gl.width/2-128 && x <= this.gl.width/2-64))
	{
		alert("X="+x+" Y="+y);
	}
};

Game.prototype.update = function()
{
	if(this.state) {
		return 0;
	}
	b.update();
};
