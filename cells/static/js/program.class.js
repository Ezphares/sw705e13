Program = function(size)
{
	this.size = size;
	this.instructions = [];
	
	
	for (var i = 0; i < (2 * size) - 1; i++)
	{
		this.instructions.push([]);
		
		for (var j = 0; j < (2 * size) - 1; j++)
		{
			if (this.is_inside[j, i])
				this.instructions[i].push({type: 'empty'});
			else
				this.instructions[i].push(null);
		}
	}
};

Program.prototype.is_inside = function(point)
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