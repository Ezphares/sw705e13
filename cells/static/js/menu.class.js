/**
 * Creates a cell game board
 *
 * @constructor
 * @param {int} size The length of the game board's edge in tiles.
 * @param {Sprite} spr_tile The sprite to use for empty tiles.
 * @see {Sprite}
 */
Menu = function(active, inactive, tile, back, home, start, newButton, startHere)
{
	this.spr_tile = tile;
	this.spr_back = back;
	this.spr_home = home;
	this.spr_start = start;
	this.spr_new = newButton;
	this.spr_active_button = active;
	this.spr_inactive_button = inactive;
	this.spr_startHere = startHere;
	this.state = 'Start';
};

Menu.prototype.draw = function(gl)
{
	if(this.state === 'Start'){
		this.draw_startmenu(gl);
	}
	else if(this.state === 'Singleplayer') {
		this.draw_singleplayermenu(gl);
	}
	else if(this.state === 'Multiplayer'){
		alert("Multiplayer not yet implemented");
	}
	else if(this.state === 'Challenges') {
		this.draw_challengesmenu(gl);
	}
	else if(this.state === 'Skirmish'){
		this.draw_skirmishmenu(gl);
	}
	else if(this.state === 'InEditor'){
		this.draw_editor(gl);
	}
	else if(this.state === 'InGame'){
		this.draw_game(gl);
	}
};

Menu.prototype.draw_button = function(active, text, x, y, gl)
{
	if(active){
		gl.draw_sprite(this.spr_active_button, 0, gl.width/2, y);
	}
	else{
		gl.draw_sprite(this.spr_inactive_button, 0, gl.width/2, y);
	}
	
	gl.draw_text(text, 'black', 25, 'center', gl.width/2, y-15);
};

Menu.prototype.draw_background = function(gl){
	var state = true;
	for(var i=-16; i <=gl.height; i+= 13)
	{
		for(var j=-16; j<=gl.width; j+=16)
		{
			if(state){
				gl.draw_sprite(this.spr_tile, 0, j, i);
			}
			else{
				gl.draw_sprite(this.spr_tile, 0, j+8, i);
			}
		}
		state = !state;
	}
};

Menu.prototype.draw_startmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(true, 'Singleplayer', 0, gl.height/2-105, gl);
	this.draw_button(false, 'Multiplayer', 0, gl.height/2-35, gl);
	this.draw_button(true, 'Manual', 0, gl.height/2+35, gl);
	this.draw_button(true, 'Editor', 0, gl.height/2+105, gl);
};

Menu.prototype.draw_singleplayermenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(false, 'Challenges', 0, gl.height/2-105, gl);
	this.draw_button(true, 'Skirmish', 0, gl.height/2-35, gl);
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
};

Menu.prototype.draw_challengesmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(false, '1', 0, gl.height/2-105, gl);
	this.draw_button(false, '2', 0, gl.height/2-35, gl);
	this.draw_button(false, '3', 0, gl.height/2+35, gl);
	this.draw_button(false, '4', 0, gl.height/2+105, gl);
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
};

Menu.prototype.draw_skirmishmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(true, 'New', 0, gl.height/2-105, gl);
	this.draw_button(false, 'Import', 0, gl.height/2-35, gl);
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
};

Menu.prototype.draw_editor = function(gl)
{
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
	gl.draw_sprite(this.spr_new, 0, 80, gl.height-(this.spr_new.frame_height));
	gl.draw_sprite(this.spr_startHere, 0, 60, 100);
	
	
	gl.draw_sprite(this.spr_start, 0, gl.width-(this.spr_start.frame_width), gl.height-(this.spr_start.frame_height));
	
	gl.draw_text("Clear", 'black', 20, 0, 88, gl.height-(this.spr_new.frame_height)+3);
	gl.draw_text("Start", 'white', 15, 0, 70, 107);
	gl.draw_text("OK", 'black', 15, 0, gl.width-(this.spr_start.frame_width)+5, gl.height-(this.spr_start.frame_height)+7);
};

Menu.prototype.draw_game = function(gl)
{
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
};

Menu.prototype.update = function(x, y, gl)
{
	if(x <= gl.width/2+128 && x >= gl.width/2-128)
	{
		//First button is pressed
		if(y >= gl.height/2-105-32 && y <= gl.height/2-105+32)
		{
			if(this.state == 'Start'){
				this.state = 'Singleplayer';
			}
			else if(this.state === 'Singleplayer'){
				//this.state = 'Challenges';
				alert("Go to challenges");
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 1");
			}
			else if(this.state === 'Skirmish'){
				this.state = 'InEditor';
			}
		}
		//Second button is pressed
		else if(y >= gl.height/2-35-32 && y <= gl.height/2-35+32)
		{
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
		else if(y >= gl.height/2+35-32 && y <= gl.height/2+35+32)
		{
			if(this.state == 'Start'){
				alert("Go to manual");
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 3");
			}
		}
		//Fourth button is pressed
		else if(y >= gl.height/2+105-32 && y <= gl.height/2+105+32)
		{
			if(this.state == 'Start'){
				this.state = 'InEditor';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 4");
			}
		}
	}
	else if(x >= 0 && x <= 32 && y <= gl.height && y >= gl.height-(this.spr_back.frame_height))
	{
		if(this.state == 'Singleplayer' || this.state == 'Multiplayer' || this.state == 'InEditor'){
			console.log("Back button hit");
			this.state = 'Start';
		}
		else if(this.state === 'Challenges' || this.state === 'Skirmish'){
			console.log("Back button hit");
			this.state = 'Singleplayer';
		}
		else if(this.state === 'InGame')
		{
			this.state = 'InEditor';
		}
	}
	else if(x > 40 && x <= 70 && y <= gl.height && y >= gl.height-(this.spr_home.frame_height))
	{
		if(this.state != 'Start' && this.state != 'InGame'){
			console.log("Home button hit");
			this.state = 'Start';
		}
	}
	else if(x > gl.width-(this.spr_start.frame_width) && x <= gl.width && y <= gl.height && y >= gl.height-(this.spr_start.frame_height))
	{
		if(this.state == 'InEditor'){
			console.log("OK button hit");
			this.state = 'InGame';
		}
	}
	else if(x > 80 && x <= 80+(this.spr_new.frame_width) && y <= gl.height && y >= gl.height-(this.spr_new.frame_height))
	{
		this.state = 'Clean';
	}
};
