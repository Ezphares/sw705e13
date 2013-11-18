/**
 * Creates a cell program to be edited or executed.
 * @constructor
 *
 * @param {int} size The size of the edge of the program, in instructions
 */
Program = function(size)
{
	this.size = size;
	this.instructions = [];
	
	
	for (var i = 0; i < (2 * size) - 1; i++)
	{
		this.instructions.push([]);
		
		for (var j = 0; j < (2 * size) - 1; j++)
		{
			if (this.is_inside([j, i]))
				this.instructions[i].push({type: 'empty'});
			else
				this.instructions[i].push(null);
		}
	}
};

Program.prototype.get_instruction = function(point)
{
	if (this.is_inside(point))
		return this.instructions[point[1]][point[0]];
	else
		return null;
};

Program.prototype.set_instruction = function(point, instruction)
{
	if (this.is_inside(point))
		this.instructions[point[1]][point[0]] = instruction;
};

Program.prototype.delete_instruction = function(point)
{
	if (this.is_inside(point))
		this.instructions[point[1]][point[0]] = {type: 'empty'};
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