Food = function(energy, position)
{
	this.energy = energy;
	this.position = position;
	this.sprite = Food.sprite;
	this.frame = 0;
};

Food.prototype.update = function(board)
{
	this.energy--;
	
	if (this.energy === 0 || !board.is_inside(this.position))
	{
		board.remove_entity(this);
	}
};

Food.prototype.draw = function(board, gl)
{
	var draw_pos = board.get_pixel_coordinate(this.position);

	gl.draw_sprite(this.sprite, this.frame++, draw_pos[0], draw_pos[1]);
};

Food.sprite = null;