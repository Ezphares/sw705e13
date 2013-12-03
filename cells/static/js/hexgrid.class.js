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
	this.tile_livezone = [this.tile_size[0], this.tile_size[1] / 2 - this.tile_deadzone[1]];

	this.delta_x = [this.tile_size[0], 0];
	this.delta_y = [-this.tile_size[0] / 2, this.tile_size[1] - this.tile_deadzone[1]];
};

HexGrid.prototype.get_tile_position = function(point)
{
	var origin = this.get_pixel_coordinate([0, 0]);
	var low = this.get_pixel_coordinate([0, 0]);
	var high = this.get_pixel_coordinate([0, 0]);
	var lowp = [0, 0];
	var highp = [0, 0];
	
	// Localizing the y-range
	if (point[1] <= origin[1]) // North of [0, 0]
	{
		while (high[1] > point[1] + this.delta_y[1])
		{
			low[0] -= this.delta_y[0];
			low[1] -= this.delta_y[1];
			lowp[1]--;
			high[0] -= this.delta_y[0];
			high[1] -= this.delta_y[1];
			highp[1]--;
		}
		low[0] -= this.delta_y[0];
		low[1] -= this.delta_y[1];
		lowp[1]--;
	}
	else
	{
		high[0] += this.delta_y[0];
		high[1] += this.delta_y[1];
		highp[1]++;
		while (high[1] < point[1])
		{
			low[0] += this.delta_y[0];
			low[1] += this.delta_y[1];
			lowp[1]++;
			high[0] += this.delta_y[0];
			high[1] += this.delta_y[1];
			highp[1]++;
		}
	}
	
	var left = 'h';
	if (point[0] <= low[0]) // Point os to the left of [0, y]
	{
		while (low[0] > point[0] + this.delta_x[0])
		{
			low[0] -= this.delta_x[0];
			lowp[0]--;
			high[0] -= this.delta_x[0];
			highp[0]--;
		}
		if (low[0] > point[0] + this.delta_x[0] / 2)
		{
			low[0] -= this.delta_x[0];
			lowp[0]--;
			left = 'l';
		}
	}
	else
	{
		while (high[0] < point[0] - this.delta_x[0])
		{
			low[0] += this.delta_x[0];
			lowp[0]++;
			high[0] += this.delta_x[0];
			highp[0]++;
		}
		if (high[0] < point[0] - this.delta_x[0] / 2)
		{
			high[0] += this.delta_x[0];
			highp[0]++;
			left = 'l';
		}
	}

	// Livezone checks (spray and pray)
	if (point[1] < low[1] + this.tile_livezone[1])
	{
		return lowp;
	}
	else if (point[1] > high[1] - this.tile_livezone[1])
	{
		return highp;
	}
	else
	{
		// Livezone miss, deadzone checks (sniper time)
		if (left === 'l')
		{
			var deadzone = [low[0], low[1] + this.tile_deadzone[1]];
			
			point[0] -= deadzone[0];
			point[1] -= deadzone[1];
			
			if (point[0] < (this.tile_deadzone[0] / this.tile_deadzone[1]) * (this.tile_deadzone[1] - point[1]))
				return lowp;
			else
				return highp;
		}
		else
		{
			var deadzone = [high[0], low[1] + this.tile_deadzone[1]];
			
			point[0] -= deadzone[0];
			point[1] -= deadzone[1];
			
			if (point[1] < (this.tile_deadzone[1] / this.tile_deadzone[0]) * point[0])
				return lowp;
			else
				return highp;
		}
		
		
		return [0,0];
	}
};

HexGrid.prototype.get_pixel_coordinate = function(position)
{
	var origin = [ this.grid_offset[0] - this.delta_y[0] * this.edge_size, this.grid_offset[1] + this.delta_y[1] / 2 ];
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
