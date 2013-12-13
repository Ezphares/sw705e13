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
Cell = function(position, energy, sprite, program, playertype)
{
	this.position = position;
	this.energy = energy;
	this.sprite = sprite;
	this.frame = 0;
	this.playertype = playertype; // 1 if green 2 if red
	
	this.program = program;
	this.ip = [0,0]; // Instruction pointer
	this.type = 'cell';
	this.exhausted = true; // Prevent execution when entity is new
	this.variables = {DIR1: 'R', DIR2: 'R', DIR3: 'R', ENT1: 'FRIEND', ENT2:'FRIEND', ENT3:'FRIEND', NUM1:'0', NUM2: '0', NUM3:'0'};
	
	this loops = [];
};

Cell.prototype.get_value = function(json)
{
	var source = json.source;
	
	if (source === 'undefined')
	{
		return json;
	}
	
	if (source === 'explicit')
	{
		return json.value;
	}
	else if (source === 'variable')
	{
		return this.variables[json.value];
	}
	else
	{
		if (json.value === 'DV_OWNHEALTH')
		{
			return String(this.energy);s
		}
	}
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
	// Skip first action
	if (this.exhausted)
		this.exhausted = false;
	else
	{
		// Execute the program to find out what to do.
		var action = this.execute(board);

		if (action.act === 'NOP')
		{}
		else if (action.act === 'M')
		{
			this.position = Hex.move(this.position, action.dir);
		}
		else if (action.act === 'S')
		{
			var target = Hex.move(this.position, action.dir);
			
			if (board.grid.is_inside(target))
			{
				var child = new Cell(target, Math.floor(this.energy / 2), this.sprite, this.program, this.playertype);
				board.add_entity(child);
				child.battle(board);
			}
				
			this.energy = Math.ceil(this.energy / 2);
		}
	}
	
	// Check for collisions
	this.battle(board);
	
	// Decrease energy, and death checks
	this.energy--;
	if (this.energy <= 0 || !board.grid.is_inside(this.position))
	{
		board.remove_entity(this);
	}
};

/**
 * Executes battle and eating between the cell and anything it collides with
 *
 * @param {Board} board The Board instance on which the cell should execute.
 *
 * @see {Board}
 */
Cell.prototype.battle = function(board)
{
	for (var i = 0; i < board.entities.length; i++)
	{
		var other = board.entities[i];
		
		// Ignore collisions with self
		if (this === other)
			continue;
		
		if (this.position[0] === other.position[0] && this.position[1] === other.position[1])
		{
			// Eat the defender if we have equal or more energy. Or the defender is food.
			if (this.energy >= other.energy || other.type === 'food')
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
	var draw_pos = board.grid.get_pixel_coordinate(this.position);
	
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
	var imax = 50;
	
	// Ifetch loop
	while (imax > 0)
	{
		var i = this.program.get_instruction(this.ip);
		
		var inext = 'continue'; // Set to 'divert' in IF/FOR when branching
		
		if (i === null || i.type === 'empty') // This will only happen in an invalid program
		{
			this.ip = [0,0];
			continue;
		}
		
		if (i.type === 'if')
		{
			var first = this.get_value(i.first);
			var second = this.get_value(i.second);
			
			if(i.expr_type === 'ENT' || i.expr_type === 'DIR')
			{
				if(i.operator === '=')
				{
					if (first !== second)
						inext = 'divert';
				}
				else
				{
					if(first === second)
					{
						inext = 'divert';
					}
				}
			}
			else
			{
				first = parseInt(first);
				second = parseInt(second);
				
				if (i.operator === '=')
				{
					if (first != second)
						inext = 'divert';
				}
				else if (i.operator === '<')
				{
					if(first >= second)
						inext = 'divert';
				}				
				else if (i.operator === '<=')
				{
					if(first > second)
						inext = 'divert';
				}
				else if (i.operator === '>')
				{
					if(first <= second)
						inext = 'divert';
				}
				else if (i.operator === '>=')
				{
					if(first < second)
						inext = 'divert';
				}
				else
				{
					if (first === second)
						inext = 'divert';
				}
			}
		}
		else if (i.type === 'loop')
		{
			var cache = JSON.stringify(this.ip);
			if (this.loops.indexOf(cache) === -1)
			{
				this.loops.push(cache);
				this.variables[i.variable] = this.get_value(i.start);
			}
			else
			{
				if(this.variables[i.variable] === this.get_value(i.end))
				{
					inext = 'divert';
					var index = this.loops.indexOf(cache);
					if (index !== -1)
					{
						this.loops.splice(index,1);
					}
				}
				else
				{
					if (i.increment === '+1')
						this.variables[i.variable] = String(parseInt(this.variables[i.variable])+1);
					
					else if (i.increment == '-1')
						this.variables[i.variable] = String(parseInt(this.variables[i.variable])-1);
					
					else if (i.increment === 'DV_NEXTENTITY')
						this.variables[i.variable] = FormManager.entities[FormManager.entities.indexOf(this.variables[i.variable])+1];
					
					else if (i.increment === 'DV_COUNTERCLOCKWISE')
						this.variables[i.variable] = Hex.rotate(this.variables[i.variable], 'CC');
					
					else if (i.increment === 'DV_CLOCKWISE')
						this.variables[i.variable] = Hex.rotate(this.variables[i.variable], 'C');
				}
			}
		}
		else if (i.type === 'look')
		{
			var target = Hex.move(this.position, this.get_value(i.target));
			if(!board.grid.is_inside(target))
			{
				this.variables[i.save_entity] = 'BOUND';
				this.variables[i.save_energy] = '0';
			}
			else
			{
				this.variables[i.save_entity] = 'EMPTY';
				this.variables[i.save_energy] = '0';
				
				for (var j = 0; j < board.entities.length; j++)
				{
					var other = board.entities[j];
					
					if (target[0] === other.position[0] && target[1] === other.position[1])
					{
						this.variables[i.save_energy] = String(other.energy);
						
						if(other.type === 'food')
						{
							this.variables[i.save_entity] = 'FOOD';
						}
						else if (this.playertype == other.playertype)
						{
							this.variables[i.save_entity] = 'FRIEND';
						}
						else
						{
							this.variables[i.save_entity] = 'ENEMY';
						}
					}
				}	
			}
		}
		
		this.ip = Hex.move(this.ip, i[inext]);
		imax--;
		
		if (i.type === 'move')
		{
			return {act: 'M', dir: this.get_value(i.target)};
		}
		else if (i.type === 'split')
		{
			return {act: 'S', dir: this.get_value(i.target)};
		}
	}

	return {act: 'NOP'};
};