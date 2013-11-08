Board = function(size)
{
	this.size = size;
	this.entities = [];
};

Board.prototype.get_pixel_coodinate = function(point)
{
	var xdelta = [16, 0];
	var ydelta = [-8, 12];
	var origin = [ -ydelta[0] * this.size, ydelta[1] / 2 ];
	return [ origin[0] + point[0] * xdelta[0] + point[1] * ydelta[0],
			 origin[1] + point[0] * xdelta[1] + point[1] * ydelta[1] ];
};

Board.prototype.draw = function(gl)
{
	for (var i = 0; i < this.size * 2 / 1; i++)
	{
		for (var i = j; i < this.size * 2 / 1; i++)
		{
			if (this.is_inside([i,j]))
			{
				var draw_pos = this.get_pixel_coordinate([i, j]);
				// TODO Draw a tile
			}
		}
	}
	
	for (var i = 0; i < this.entities.length; i++)
	{
		this.entities.draw(this, gl);
	}
};

Board.prototype.update = function()
{
	// TODO: Spawn food?

	for (var i = 0; i < this.entities.length; i++)
	{
		this.entities.update(this);
	}
};

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

Board.prototype.add_entity = function(entity)
{
	this.entities.push(entity);
};

Board.prototype.remove_entity = function(entity)
{
	var index = this.entities.indexOf(entity);
	if (index !== -1)
	{
		this.entities.splice(index, 1);
	}
};