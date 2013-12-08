Editor = function(size, spr_tile, spr_set)
{
	this.size = size;
	this.new_program(size);
	this.spr_tile = spr_tile;
	this.spr_set = spr_set || {};
	this.form_manager = new FormManager();
	
	this.forms = 
	{
		'nop': this.form_manager.form_nop,
		'move': this.form_manager.form_move,
		'split': this.form_manager.form_split,
		'if': this.form_manager.form_if,
		'for': this.form_manager.form_for,
		'look': this.form_manager.form_look,
		'var': this.form_manager.form_var
	};
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
				
				var instruction = this.program.get_instruction([i, j]);
				if (instruction.type !== 'empty')
				{
					gl.draw_sprite(this.spr_set[instruction.type], 0, draw_pos[0], draw_pos[1]);
					
					if (instruction['continue'] !== undefined)
						gl.draw_sprite(this.spr_set[instruction['continue']], 0, draw_pos[0], draw_pos[1]);
						
					if (instruction['divert'] !== undefined)
						gl.draw_sprite(this.spr_set[instruction['continue'] + '-D'], 0, draw_pos[0], draw_pos[1]);
				}
			}
		}
	}
};

Editor.prototype.drop = function(point, instruction)
{
};

Editor.prototype.click = function(point)
{
	var tile = this.program.grid.get_tile_position(point);
	console.log(tile);
	var instruction = this.program.get_instruction(tile);
	
	if (instruction !== null)
	{
		this.form_manager.clear();
		
		var form = this.forms[instruction.type];
		if (form !== undefined)
			form(instruction);
	}
};

Editor.test = function()
{
	gl = new IfyGL({
		canvas: 'game',
		texturepath: 'static/img/',
		shaderpath: 'static/shaders/',
		width: 800,
		height: 600
	});
	gl.init();
	
	var sprite_loader = [{filename: 'editor_tile_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
						 {filename: 'editor_empty_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
						 {filename: 'selection_direction_r.png', frame_width: 64, frame_height: 64, origin: [32,32]}];
						 
	gl.load_sprites(sprite_loader, function(spr)
	{
		var e = new Editor(6, spr[0], {
			'nop': spr[1],
			'R': spr[2]
		});
		
		$('#game').click(function(event)
		{
			var offset = $(this).offset();
			var pos = [Math.floor(event.pageX - offset.left), Math.floor(event.pageY - offset.top)];
			e.click(pos);
		});
		
		e.program.set_instruction([0,0], {type: 'nop', 'continue': 'R'});
		e.program.set_instruction([1,0], {type: 'nop', 'continue': 'R'});
		e.program.set_instruction([2,0], {type: 'nop', 'continue': 'R'});
		e.draw(gl);
	});
};


