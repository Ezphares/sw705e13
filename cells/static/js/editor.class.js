Editor = function(size)
{
	this.size = size;
	this.new_program(size);
	this.spr_tile = Editor.tile;
	this.spr_select = Editor.select;
	this.spr_set = Editor.set;
	this.form_manager = new FormManager();
	this.select = null;
	
	this.gl;
	
	this.direction_frames = 
	{
		'UL': 0,
		'UR': 1,
		'R': 2,
		'DR': 4,
		'DL': 5,
		'L': 6
	};
	
	this.forms = 
	{
		'nop': 'form_nop',
		'move': 'form_move',
		'split': 'form_split',
		'if': 'form_if',
		'loop': 'form_loop',
		'look': 'form_look',
		'var': 'form_var'
	};
};

Editor.prototype.new_program = function(size)
{
	this.program = new Program(size);
};

Editor.prototype.draw = function(gl)
{
	// Grid
	for (var i = 0; i < this.size * 2 / 1; i++){
		for (var j = 0; j < this.size * 2 / 1; j++){
			if (this.program.grid.is_inside([i,j])){
				var draw_pos = this.program.grid.get_pixel_coordinate([i, j]);
				gl.draw_sprite(this.spr_tile, 0, draw_pos[0], draw_pos[1]);
			}
		}
	}
	
	// Instruction
	for (var i = 0; i < this.size * 2 / 1; i++){
		for (var j = 0; j < this.size * 2 / 1; j++){
			if (this.program.grid.is_inside([i,j])){	
				var instruction = this.program.get_instruction([i, j]);
				
				if (instruction.type !== 'empty'){
					var draw_pos = this.program.grid.get_pixel_coordinate([i, j]);
					gl.draw_sprite(this.spr_set[instruction.type], 0, draw_pos[0], draw_pos[1]);
					
					if (instruction['continue'] !== undefined){
						gl.draw_sprite(this.spr_set['continue'], this.direction_frames[instruction['continue']], draw_pos[0], draw_pos[1]);
					}
						
					if (instruction['divert'] !== undefined){
						gl.draw_sprite(this.spr_set['divert'], this.direction_frames[instruction['divert']], draw_pos[0], draw_pos[1]);
					}
				}
			}
		}
	}
	
	if (this.select !== null){
		var draw_pos = this.program.grid.get_pixel_coordinate(this.select);
		gl.draw_sprite(this.spr_select, 0, draw_pos[0], draw_pos[1]);
	}
};

Editor.prototype.drop = function(point, instruction)
{
};

Editor.prototype.click = function(point)
{
	var tile = this.program.grid.get_tile_position(point);
	var instruction = this.program.get_instruction(tile);
	
	this.form_manager.clear();
	this.select = null;
	
	if (instruction !== null)
	{	
		var form = this.forms[instruction.type];
		if (form !== undefined)
		{
			this.form_manager[form](instruction);
			this.select = [tile[0], tile[1]];
		}
	}
};

Editor.load_sprites = function(gl, callback)
{
	var loader = [{filename: 'editor_tile_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_select_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_empty_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_move_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_split_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_look_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_var_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_if_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_for_large.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_continue.png', frame_width: 64, frame_height: 64, origin: [32,32]},
				  {filename: 'editor_divert.png', frame_width: 64, frame_height: 64, origin: [32,32]}];
	
	gl.load_sprites(loader, function(sprites)
	{
		Editor.tile = sprites[0];
		Editor.select = sprites[1];
		Editor.set = {
			'nop': sprites[2],
			'move': sprites[3],
			'split': sprites[4],
			'look': sprites[5],
			'var': sprites[6],
			'if': sprites[7],
			'loop': sprites[8],
			'continue': sprites[9],
			'divert': sprites[10]
		};
		
		if (callback)
			callback();
	});
}

Editor.prototype.test = function()
{
	gl = new IfyGL({
		canvas: 'game',
		texturepath: 'static/img/',
		shaderpath: 'static/shaders/',
		width: 800,
		height: 600,
		debug: true
	});
	gl.init();

	Editor.load_sprites(gl, function()
	{
		var e = new Editor(5);
		
		$('#game').click(function(event)
		{
			var offset = $(this).offset();
			var pos = [Math.floor(event.pageX - offset.left), Math.floor(event.pageY - offset.top)];
			e.click(pos);
		});
		
		e.program.set_instruction([0,0], {type: 'nop', 'continue': 'R'});
		e.program.set_instruction([1,0], {type: 'loop', 'continue': 'R'});
		e.program.set_instruction([2,0], Instruction.if());
		e.program.set_instruction([2,1], {type: 'nop', 'continue': 'UR'});
		
		var then = new Date().getTime();
		
		/* Frame rate display */
		(function render()
		{
			var now = new Date().getTime();
			var delta = now - then;
			
			var fps = Math.floor(1000 / delta);
			$('#fps').text('FPS: ' + fps);
			
			then = now;
		
			requestAnimFrame(render);
			e.draw(gl);
		})();
	});
};


