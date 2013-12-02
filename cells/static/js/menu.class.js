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

Menu.prototype.get_pixel_coordinate = function(point)
{

};

/**
 * Draws the menu
 *
 * @param {IfyGL} gl THe IfyGL instance used to draw. This decides canvas context.
 */
Menu.prototype.draw = function(gl)
{	
	this.draw_background(gl);
	this.draw_startmenu(gl);
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
	this.draw_button(true, 'Singleplayer', 0, 480/2-70, gl);
	this.draw_button(false, 'Multiplayer', 0, 480/2, gl);
	this.draw_button(true, 'Manual', 0, 480/2+70, gl);
	this.draw_button(false, 'Editor', 0, 480/2+140, gl);
};

Menu.prototype.draw_singleplayermenu = function(gl)
{
	this.draw_button(true, 'Challenges', 0, 480/2-70, gl);
	this.draw_button(true, 'Skirmish', 0, 480/2, gl);
	gl.draw_sprite(this.spr_back, 0, 0, 480-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, 480-(this.spr_home.frame_height));
};

Menu.prototype.draw_challengesmenu = function(gl)
{
	//TODO: Add challenges
	this.draw_button(true, '1', 0, 480/2-70, gl);
	this.draw_button(true, '2', 0, 480/2, gl);
	this.draw_button(true, '3', 0, 480/2+70, gl);
	this.draw_button(true, '4', 0, 480/2+140, gl);
};

Menu.prototype.draw_skirmishmenu = function(gl)
{
	this.draw_button(true, 'New', 0, 480/2-70, gl);
	this.draw_button(true, 'Import', 0, 480/2, gl);
	gl.draw_sprite(this.spr_back, 0, 0, 480-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, 480-(this.spr_home.frame_height));
};

Menu.prototype.draw_button = function(active, text, x, y, gl)
{
	if(active)
		gl.draw_sprite(this.spr_active_button, 0, gl.width/2, y);
	else
		gl.draw_sprite(this.spr_inactive_button, 0, gl.width/2, y);
	
	gl.draw_text(text, 'black', 25, 'center', gl.width/2, y-15);
};

/**
 * Updates the Menu. Should be called once per frame.
 */
Menu.prototype.update = function(buttonPressed, gl)
{
	this.draw_background(gl);
	//TODO: Change menu depending on buttonPressed
	if(buttonPressed === 1){
		this.draw_singleplayermenu(gl);
	}
	
	if(buttonPressed === 2){
		this.draw_skirmishmenu(gl);
	}
	
	if(buttonPressed === 3){
		this.draw_startmenu(gl);
	}
	
	if(buttonPressed ===4){
		this.draw_challengesmenu(gl);
	}
};
