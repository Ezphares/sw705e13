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
	this.grid = new HexGrid([58, 58], 29, size, [16, 96], 'horizontal');
	
	for (var i = 0; i < (2 * size) - 1; i++)
	{
		this.instructions.push([]);
		
		for (var j = 0; j < (2 * size) - 1; j++)
		{
			if (this.grid.is_inside([j, i]))
				this.instructions[i].push({type: 'empty'});
			else
				this.instructions[i].push(null);
		}
	}
};

Program.prototype.get_instruction = function(point)
{
	if (this.grid.is_inside(point))
		return this.instructions[point[1]][point[0]];
	else
		return null;
};

Program.prototype.set_instruction = function(point, instruction)
{
	console.log("set_instruction");
	if (this.grid.is_inside(point))
		console.log("inside if");
		this.instructions[point[1]][point[0]] = instruction;
};

Program.prototype.delete_instruction = function(point)
{
	if (this.grid.is_inside(point))
		this.instructions[point[1]][point[0]] = {type: 'empty'};
};