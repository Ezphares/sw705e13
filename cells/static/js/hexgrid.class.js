HexGrid = function(tile_size, tile_cutoff, edge_size, grid_offset, orientation)
{
	if (orientation !== 'horizontal')
	{
		console.log('Only horizontal orientation is currently supported');
		return;
	}
	
	this.orientation = orientation;
	this.tile_size = tile_size;
	this.tile_cutoff = tile_cutoff;
	this.edge_size = edge_size;
	this.grid_offset = grid_offset;
	
	this.tile_deadzone = [this.tile_size[0] / 2, this.tile_cutoff / 2];
	this.tile_livezone = [this.tile_size[0], this.tile_size[1] - this.tile_cutoff];

	this.delta_x = [this.tile_size[0], 0];
	this.delta_y = [-this.tile_size[0], tile_deadzone[1]];
	

};

HexGrid.prototype.get_tile_position = function(point)
{
	var origin = this_get_pixel_position([0, 0]);
	var low = this_get_pixel_position([0, 0]);
	var high = this_get_pixel_position([0, 0]);
	
	// Localizing the y-range
	if (point[1] <= origin[1]) // North of zero
	{
		while (high[1] > point[1] + this.delta_y[1])
		{
			low[0] -= this.delta_y[0];
			low[1] -= this.delta_y[1];
			high[0] -= this.delta_y[0];
			high[1] -= this.delta_y[1];
		}
		high[0] -= this.delta_y[0];
		high[1] -= this.delta_y[1];
	}
	else
	{
		high[0] += this.delta_y[0];
		high[1] += this.delta_y[1];
		while (high[1] < point[1])
		{
			low[0] -= this.delta_y[0];
			low[1] -= this.delta_y[1];
			high[0] += this.delta_y[0];
			high[1] += this.delta_y[1];
		}
	}
	
	return [low[1], high[1]];
};

HexGrid.prototype.get_pixel_coordinate = function(position)
{
	var origin = [ -this.delta_y[0] * this.edge_size, this.delta_y[1] / 2 ];
	return [ origin[0] + position[0] * this.delta_x[0] + position[1] * this.delta_y[0],
			 origin[1] + position[0] * this.delta_x[1] + position[1] * this.delta_y[1] ];
};

HexGrid.prototype.is_inside = function(position)
{
	if (position[0] < 0 || position[1] < 0
	  || position[0] >= (this.edge_size * 2) - 1
	  || position[1] >= (this.edge_size * 2) - 1)
	{
		return false;
	}
	
	if (position[0] - position[1] > this.edge_size - 1 || position[1] - position[0] > this.edge_size - 1)
	{
		return false;
	}
	
	return true;
};