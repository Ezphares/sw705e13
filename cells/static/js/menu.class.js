/**
 * Creates a cell game board
 *
 * @constructor
 * @param {int} size The length of the game board's edge in tiles.
 * @param {Sprite} spr_tile The sprite to use for empty tiles.
 * @see {Sprite}
 */
Menu = function(spr_singleplayer, spr_multiplayer, spr_manual, spr_editor, spr_tile, spr_chal, spr_skir, back, spr_new, spr_inport, home)
{
	this.spr_singleplayer = spr_singleplayer;
	this.spr_multiplayer = spr_multiplayer;
	this.spr_manual = spr_manual;
	this.spr_editor = spr_editor;
	this.spr_tile = spr_tile;
	this.spr_challenges = spr_chal;
	this.spr_skirmish   = spr_skir;
	this.spr_back = back;
	this.spr_new = spr_new;
	this.spr_inport = spr_inport;
	this.spr_home = home;
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
	gl.draw_sprite(this.spr_singleplayer, 0, 640/2, 480/2-70);
	gl.draw_sprite(this.spr_multiplayer, 0, 640/2, 480/2);
	gl.draw_sprite(this.spr_manual, 0, 640/2, 480/2+70);
	gl.draw_sprite(this.spr_editor, 0, 640/2, 480/2+140);
};

Menu.prototype.draw_singleplayermenu = function(gl)
{
	gl.draw_sprite(this.spr_challenges, 0, 640/2, 480/2-70);
	gl.draw_sprite(this.spr_skirmish, 0, 640/2, 480/2);
	gl.draw_sprite(this.spr_back, 0, 0, 480-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, 480-(this.spr_home.frame_height));
};

Menu.prototype.draw_challengesmenu = function(gl)
{
	//TODO: Add challenges
};

Menu.prototype.draw_skirmishmenu = function(gl)
{
	gl.draw_sprite(this.spr_new, 0, 640/2, 480/2-70);
	gl.draw_sprite(this.spr_inport, 0, 640/2, 480/2);
	gl.draw_sprite(this.spr_back, 0, 0, 480-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, 480-(this.spr_home.frame_height));
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
	
	if(buttonPressed === 2)
	{
		this.draw_skirmishmenu(gl);
	}
	
	if(buttonPressed === 3)
	{
		this.draw_startmenu(gl);
	}
};
