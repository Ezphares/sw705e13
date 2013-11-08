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

Food.protype.draw = function(board, gl)
{
	var draw_pos = board.get_pixel_position(this.position);

	// TODO: Draw! :D
};

(function()
{
	Food.sprite = null; //TODO
});
