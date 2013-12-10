/**
 * Creates a cell game board
 *
 * @constructor
 * @param {int} size The length of the game board's edge in tiles.
 * @param {Sprite} spr_tile The sprite to use for empty tiles.
 * @see {Sprite}
 */
Menu = function(active, inactive, tile, back, home)
{
	this.spr_tile = tile;
	this.spr_back = back;
	this.spr_home = home;
	this.spr_active_button = active;
	this.spr_inactive_button = inactive;
	this.state = 'Start';
};

Menu.prototype.draw_button = function(active, text, x, y, gl)
{
	if(active){
		gl.draw_sprite(this.spr_active_button, 0, gl.width/2, y);
	}
	else{
		gl.draw_sprite(this.spr_inactive_button, 0, gl.width/2, y);
	}
	
	gl.draw_text(text, 'black', 25, 'center', 0, -15);
};

Menu.prototype.draw_background = function(gl){
	var state = true;
	for(var i=-16; i <=480; i+= 13)
	{
		for(var j=-16; j<=640; j+=16)
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
	this.draw_button(true, 'Singleplayer', 0, 480/2-70, gl);
	this.draw_button(false, 'Multiplayer', 0, 480/2, gl);
	this.draw_button(true, 'Manual', 0, 480/2+70, gl);
	this.draw_button(false, 'Editor', 0, 480/2+140, gl);
};

Menu.prototype.draw_singleplayermenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(true, 'Challenges', 0, 480/2-70, gl);
	this.draw_button(true, 'Skirmish', 0, 480/2, gl);
	gl.draw_sprite(this.spr_back, 0, 0, 480-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, 480-(this.spr_home.frame_height));
};

Menu.prototype.draw_challengesmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(true, '1', 0, 480/2-70, gl);
	this.draw_button(true, '2', 0, 480/2, gl);
	this.draw_button(true, '3', 0, 480/2+70, gl);
	this.draw_button(true, '4', 0, 480/2+140, gl);
	gl.draw_sprite(this.spr_back, 0, 0, 480-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, 480-(this.spr_home.frame_height));
};

Menu.prototype.draw_skirmishmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(true, 'New', 0, 480/2-70, gl);
	this.draw_button(true, 'Import', 0, 480/2, gl);
	gl.draw_sprite(this.spr_back, 0, 0, 480-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, 480-(this.spr_home.frame_height));
};

Menu.prototype.isButtonHit = function(x, y, gl)
{
	var aButtonWasHit = false;
	
	if(x <= gl.width/2+128 && x >= gl.width/2-128)
	{
		//First button is pressed
		if(y >= gl.height/2-70-32 && y <= gl.height/2-70+32)
		{
			aButtonWasHit = true;
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
		else if(y >= gl.height/2-32 && y <= gl.height/2+32)
		{
			aButtonWasHit = true;
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
		else if(y >= gl.height/2+70-32 && y <= gl.height/2+70+32)
		{
			aButtonWasHit = true;
			if(this.state == 'Start'){
				alert("Go to manual");
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 3");
			}
		}
		//Fourth button is pressed
		else if(y >= gl.height/2+140-32 && y <= gl.height/2+140+32)
		{
			aButtonWasHit = true;
			if(this.state == 'Start'){
				this.state = 'InEditor';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 4");
			}
		}
	}
	else if(x >= 0 && x <= 32 && y <= gl.height && y >= gl.height-32)
	{
		if(this.state == 'Singleplayer' || this.state == 'Multiplayer'){
			aButtonWasHit = true;
			this.state = 'Start';
		}
		else if(this.state === 'Challenges' || this.state === 'Skirmish'){
			aButtonWasHit = true;
			this.state = 'Singleplayer';
		}
	}
	else if(x > 40 && x <= 70 && y <= gl.height && y >= gl.height-32)
	{
		if(this.state != 'Start' && this.state != 'InEditor' && this.state != 'InGame'){
			aButtonWasHit = true;
			this.state = 'Start';
		}
	}
	
	return aButtonWasHit;
};
