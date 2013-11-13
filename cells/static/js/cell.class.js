Cell = function(position, energy, sprite, program)
{
	this.position = position;
	this.energy = energy;
	this.sprite = sprite;
	this.frame = 0;
	
	this.program = program;
};

Cell.prototype.update = function(board)
{
	var action = this.execute(board);

	if (action === 'NOP')
	{}
	else if (action === 'M-LEFT')
	{
		this.position[0]--;
	}
	else if (action === 'M-RIGHT')
	{
		this.position[0]++;
	}
	else if (action === 'M-UPLEFT')
	{
		this.position[0]--;
		this.position[1]--;
	}
	else if (action === 'M-UPRIGHT')
	{
		this.position[1]--;
	}
	else if (action === 'M-DOWNLEFT')
	{
		this.position[1]++;
	}
	else if (action === 'M-DOWNRIGHT')
	{
		this.position[0]++;
		this.position[1]++;
	}
	
	for (var i = 0; i < board.entities.length; i++)
	{
		var other = board.entities[i];
		
		if (this === other)
			continue;
		
		if (this.position[0] === other.position[0] && this.position[1] === other.position[1])
		{
			if (this.energy >= other.energy)
			{
				this.energy += other.energy;
				board.remove_entity(other);
			}
			else
			{
				other.energy += this.energy;
				board.remove_entity(this);
			}
		}
	};
	
	this.energy--;
	if (this.energy === 0 || !board.is_inside(this.position))
	{
		board.remove_entity(this);
	}
};

Cell.prototype.draw = function(board, gl)
{
	var draw_pos = board.get_pixel_coordinate(this.position);
	
	gl.draw_sprite(this.sprite, this.frame++, draw_pos[0], draw_pos[1]);
};

Cell.prototype.execute = function(board)
{
	return 'M-RIGHT'; // TODO
};