/**
 * Creates a cell game board
 *
 * @constructor
 * @param {int} size The length of the game board's edge in tiles.
 * @param {Sprite} spr_tile The sprite to use for empty tiles.
 * @see {Sprite}
 */
Board = function(size, spr_tile)
{
	this.size = size;
	this.spr_tile = spr_tile;
	this.entities = [];
	
	this.index = 0; // For avoiding race conditions on entity removal
};

/**
 * Gets the pixel x and y for a given tile on the Board
 *
 * @param {array} point A 2-length array with the tile x and y coordinates.
 * @return {array} A 2-length array with the pixel x and y coordinates.
 */
Board.prototype.get_pixel_coordinate = function(point)
{
	var xdelta = [16, 0]; // [x,y] pixel shift for each tile x shift.
	var ydelta = [-8, 12]; // [x,y] pixel shift for each tile y shift.
	var origin = [ -ydelta[0] * this.size, ydelta[1] / 2 ];
	return [ origin[0] + point[0] * xdelta[0] + point[1] * ydelta[0],
			 origin[1] + point[0] * xdelta[1] + point[1] * ydelta[1] ];
};

/**
 * Draws the board
 *
 * @param {IfyGL} gl THe IfyGL instance used to draw. This decides canvas context.
 */
Board.prototype.draw = function(gl)
{
	// Draw each board tile
	for (var i = 0; i < this.size * 2 / 1; i++)
	{
		for (var j = 0; j < this.size * 2 / 1; j++)
		{
			if (this.is_inside([i,j]))
			{
				var draw_pos = this.get_pixel_coordinate([i, j]);
				gl.draw_sprite(this.spr_tile, 0, draw_pos[0], 120+draw_pos[1]);
			}
		}
	}
	
	// Call draw for each entity
	for (var i = 0; i < this.entities.length; i++)
	{
		this.entities[i].draw(this, gl);
	}
	
	
	// ~~~~~~~~~~~~~~Healthbar Below~~~~~~~~~~~~~~~
	// TODO: Test igen når spillet slutter når cellerne rammer 0 hp

	
	var cell_green_hp = 0;
	var cell_red_hp = 0; // testing purposes - I do not know yet which cell is red or green.
	var count = 0; // Contains number of times green has to be drawn relative to red.
	
	for(var i = 0; i < this.entities.length; i++) {
		if(this.entities[i].type == 'cell' && this.entities[i].playertype == 1) {
			cell_green_hp += this.entities[i].energy;
		}
		
		else if(this.entities[i].type == 'cell' && this.entities[i].playertype == 2) {
			cell_red_hp += this.entities[i].energy;
		}
	}
	
	count = this.health_count(cell_green_hp, cell_red_hp) * 16; // Multiplied with the pixel offset of 16 for the healthbar (tells me how many times to draw a .png
	
	
	gl.draw_sprite(healthbar_green_start, 0, 0, 0);
	for(var i = 16; i < count; i+=16)
	{
		gl.draw_sprite(healthbar_green_mid, 0, i, 0);
	}
	
	for(var i = count; i < 640; i+=16) {
		gl.draw_sprite(healthbar_red_mid, 0, i, 0);
	}
	
	gl.draw_sprite(healthbar_red_end, 0, 624, 0);
};

Board.prototype.health_count = function(green_hp, red_hp) 
{
	var count = 0; // How many times should I draw the health_bar sprite for green??
	var max_draw = 39; // Maximum number of times I can draw a health_bar sprite of 16 pixels on the canvas, boom.
	
	if(green_hp == red_hp) {
		return 19;
	}
	
	if(green_hp < 16) {
		return 1;
	}
	
	if(red_hp < 16) {
		return 38;
	}
	
	var temp = green_hp/(red_hp+green_hp); //Green's percentile cut of the HP combined
	console.log(temp);
	
	count = Math.floor((max_draw * temp));

	
	return count;
}

/**
 * Updates the board. Should be called once per frame.
 */
Board.prototype.update = function()
{
	// TODO: Spawn food?
	
	for (this.index = 0; this.index < this.entities.length; this.index++)
	{
		this.entities[this.index].update(this);
	}
};

/**
 * Checks if a tile is inside the board bounds.
 *
 * @param {array} point A 2-length array with the tile x and y coordinates.
 * @return {bool} true if the tile is inside the board, false otherwise.
 */
Board.prototype.is_inside = function(point)
{
	if (point[0] < 0 || point[1] < 0
	  || point[0] >= (this.size * 2) - 1
	  || point[1] >= (this.size * 2) - 1)
	{
		return false;
	}
	
	if (point[0] - point[1] > this.size - 1 || point[1] - point[0] > this.size - 1)
	{
		return false;
	}
	
	return true;
};

/**
 * Adds an entity to a board
 *
 * @param {object} entity Entity to add to the board. Can be either a Food or a Cell.
 * @see {Food}
 * @see {Cell}
 */
Board.prototype.add_entity = function(entity)
{
	this.entities.push(entity);
};

/**
 * Removes an entity to a board
 *
 * @param {object} entity Entity to remove from the board. Can be either a Food or a Cell.
 * @see {Food}
 * @see {Cell}
 */
Board.prototype.remove_entity = function(entity)
{
	var index = this.entities.indexOf(entity);
	if (index !== -1)
	{
		this.entities.splice(index, 1);
		if (this.index >= index)
			this.index--;
	}
};