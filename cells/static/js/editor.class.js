Editor = function(size, spr_tile, spr_set)
{
	this.size = size;
	this.new_program(size);
	this.spr_tile = spr_tile;
	this.spr_set = spr_set || {};
};

Editor.prototype.new_program = function(size)
{
	this.program = new Program(size);
};

Editor.prototype.draw = function(gl)
{
	for (var i = 0; i < this.size * 2 / 1; i++)
	{
		for (var j = 0; j < this.size * 2 / 1; j++)
		{
			if (this.program.grid.is_inside([i,j]))
			{
				var draw_pos = this.program.grid.get_pixel_coordinate([i, j]);
				gl.draw_sprite(this.spr_tile, 0, draw_pos[0], draw_pos[1]);
			}
		}
	}
};


