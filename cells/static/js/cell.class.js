/**
 * Creates a cell to be added to a board
 * @constructor
 *
 * @param {array} position A 2-length array containing the x and y tile coordinate for the cell to occupy.
 * @param {int} energy The amount of starting energy for the cell
 * @param {Sprite} sprite The sprite to use for this cell
 * @param {Program} program The cell program describing the behaviour of the cell.
 *
 * @see {Sprite}
 * @see {Program}
 */
Cell = function(position, energy, sprite, program)
{
	this.position = position;
	this.energy = energy;
	this.sprite = sprite;
	this.frame = 0;
	
	this.program = program;
};

/**
 * Updates the cell. Should be called once per frame
 *
 * @param {Board} board The Board instance on which the cell should execute.
 *
 * @see {Board}
 */
Cell.prototype.update = function(board)
{
	// Execute the program to find out what to do.
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
	// TODO: Split actions
	
	// Check for collisions
	for (var i = 0; i < board.entities.length; i++)
	{
		var other = board.entities[i];
		
		// Ignore collisions with self
		if (this === other)
			continue;
		
		if (this.position[0] === other.position[0] && this.position[1] === other.position[1])
		{
			// Eat the defender if we have equal or more energy.
			if (this.energy >= other.energy)
			{
				this.energy += other.energy;
				board.remove_entity(other);
			}
			// Otherwise, jump in its mouth.
			else
			{
				other.energy += this.energy;
				board.remove_entity(this);
			}
		}
	};
	
	// Decrease energy, and death checks
	this.energy--;
	if (this.energy === 0 || !board.is_inside(this.position))
	{
		board.remove_entity(this);
	}
};

/**
 * Draw the cell. Should be called by the board.
 *
 * @param {Board} board The Board instance on which the cell should be drawn.
 * @param {IfyGL} gl The IfyGL instance used to draw the cell
 *
 * @see {Board}
 * @see {IfyGL}
 */
Cell.prototype.draw = function(board, gl)
{
	var draw_pos = board.get_pixel_coordinate(this.position);
	
	gl.draw_sprite(this.sprite, this.frame++, draw_pos[0], draw_pos[1]);
};
/**
 * Executes the cells program to determine an action for the cell to take
 *
 * @param {Board} board The Board instance on which the cell should execute.
 *
 * @return {string} Action to take
 *
 * @see {Board}
 */
Cell.prototype.execute = function(board)
{
	return 'M-RIGHT'; // TODO
};