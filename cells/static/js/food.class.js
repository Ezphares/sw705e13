/**
 * Creates food to be added to a board
 * @constructor
 *
 * @param {array} position A 2-length array containing the x and y tile coordinate for the food to occupy.
 * @param {int} energy The amount of starting energy for the food
 */
Food = function(energy, position)
{
	this.energy = energy;
	this.position = position;
	this.sprite = Food.sprite;
	this.frame = 0;
	
	this.type = 'food';
};

/**
 * Updates the food. Should be called once per frame
 *
 * @param {Board} board The Board instance on which the food should execute.
 *
 * @see {Board}
 */
Food.prototype.update = function(board)
{
	this.energy--;
	
	if (this.energy === 0 || !board.is_inside(this.position))
	{
		board.remove_entity(this);
	}
};

/**
 * Draw the food. Should be called by the board.
 *
 * @param {Board} board The Board instance on which the food should be drawn.
 * @param {IfyGL} gl The IfyGL instance used to draw the food
 *
 * @see {Board}
 * @see {IfyGL}
 */
Food.prototype.draw = function(board, gl)
{
	var draw_pos = board.get_pixel_coordinate(this.position);

	gl.draw_sprite(this.sprite, this.frame++, draw_pos[0], draw_pos[1]);
};

Food.sprite = null;