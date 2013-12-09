FormManager = function()
{
	this.form = $('#form');
};

$(function() 
{
	var f = new FormManager();
	f.form_if();
	
});

FormManager.prototype.form_header = function(img, text)
{
	var header = $('<table><tr></tr></table>');
	
	$('<td><img /></td>').appendTo($('tr', header)).find('img').attr('src', img);
	$('<td></td>').appendTo($('tr', header)).text(text);
	
	return header;
	
}

FormManager.prototype.clear = function()
{
	this.form.html('').hide();
};

FormManager.prototype.new_form = function()
{
	this.clear();
	this.form.html('<div id="instruction"></div><div id="direction"></div>').show();
};

FormManager.prototype.form_selector = function(id, options)
{
	var selector = $('<select id="' + id + '"></select>');
	
	for(var i=0; i < options.length; i++)
	{
		$('<option value="' + options[i].value + '"></option>').text(options[i].key).appendTo(selector);
	}
	
	return selector;
}

FormManager.prototype.form_arrows = function(jqs, img)
{
	var img = $('<img class="direction-image" src="' + img + '"></img>');
	jqs.append(img);
	img.css({left: jqs.width()/2, top: jqs.height()/2, 'pointer-events': 'none'});
	
	return img;
}

FormManager.prototype.program_direction_select = function(jqs, text)
{
	var header = $('<span></span>').text(text).appendTo(jqs);
	var graphics = $('<img src="static/img/instruction_direction.png"/>').appendTo(jqs).css({left: jqs.width()/2, top: jqs.height()/2, position: 'absolute', margin: '-32px 0 0 -32px'});
	var manager = this;
	var grid = new HexGrid([24, 24], 12, 2, [-4, 2], 'horizontal');
	
	var image = null;
	graphics.click(function(event)
	{
		var offset = $(this).offset();
		var position = [event.clientX - offset.left, event.clientY - offset.top];
		var tile_position = grid.get_tile_position(position);
		
		if(grid.is_inside(tile_position) && !(tile_position[0] === 1 && tile_position[1] === 1))
		{
			var images = {
				'[0,0]': 'static/img/selection_direction_ul.png',
				'[1,0]': 'static/img/selection_direction_ur.png',
				'[2,1]': 'static/img/selection_direction_r.png',
				'[2,2]': 'static/img/selection_direction_dr.png',
				'[1,2]': 'static/img/selection_direction_dl.png',
				'[0,1]': 'static/img/selection_direction_l.png'
			};
			
			if(image !== null)
				image.remove();
				
			image = manager.form_arrows(jqs, images[JSON.stringify(tile_position)]);
		}
	});
}

FormManager.prototype.action_direction_select = function(jqs)
{
	var graphics = $('<img src="static/img/move_direction.png"/>').appendTo(jqs).css({left: jqs.width()/2, top: jqs.height()/2, position: 'absolute', margin: '-32px 0 0 -32px'});
	var manager = this;
	var grid = new HexGrid([24, 24], 12, 2, [-4, 2], 'horizontal');
	
	var image = null;
	graphics.click(function(event)
	{
		var offset = $(this).offset();
		var position = [event.clientX - offset.left, event.clientY - offset.top];
		var tile_position = grid.get_tile_position(position);
		
		var images = {
			'[0,0]': 'static/img/move_dir_ul.png',
			'[1,0]': 'static/img/move_dir_ur.png',
			'[2,1]': 'static/img/move_dir_r.png',
			'[2,2]': 'static/img/move_dir_dr.png',
			'[1,2]': 'static/img/move_dir_dl.png',
			'[0,1]': 'static/img/move_dir_l.png'
		};
		
		if(image !== null)
			image.remove();
			
		image = manager.form_arrows(jqs, images[JSON.stringify(tile_position)]);
	});
}

FormManager.prototype.form_nop = function(json)
{
	this.new_form();
	
	$('#instruction').append(this.form_header('static/img/editor_empty_large.png', 'No operation'));
	this.program_direction_select($('#direction'), 'Set position of next command');
	
		
};

FormManager.prototype.form_move = function(json)
{
	this.new_form();
	
	$('#instruction').append(this.form_header('static/img/editor_move_large.png', 'Move action')).append(this.form_selector('action-choice', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}]));
	var set_direction = $('<div></div>').appendTo($('#instruction')).css({position: 'relative', height: '64px', width: '100%'});
	this.action_direction_select(set_direction);
	
	var variable_direction = $('<div id="var-dir"></div>').append(this.form_selector('variable-dir', [{key: 'DIR1', value: '1'},{key: 'DIR2', value: '2'},{key: 'DIR3', value: '3'}])).hide().appendTo($('#instruction'));
	$('#action-choice').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_direction.show();
			variable_direction.hide();
		}
		else
		{
			set_direction.hide();
			variable_direction.show();
		}
	});

	this.program_direction_select($('#direction'), 'Set direction of next command');

};

FormManager.prototype.form_split = function(json)
{
	this.new_form();
	
	$('#instruction').append(this.form_header('static/img/editor_split_large.png', 'Split action')).append(this.form_selector('action-choice', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}]));
	var set_direction = $('<div></div>').appendTo($('#instruction')).css({position: 'relative', height: '64px', width: '100%'});
	this.action_direction_select(set_direction);
	
	var variable_direction = $('<div id="var-dir"></div>').append(this.form_selector('variable-dir', [{key: 'DIR1', value: '1'},{key: 'DIR2', value: '2'},{key: 'DIR3', value: '3'}])).hide().appendTo($('#instruction'));
	$('#action-choice').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_direction.show();
			variable_direction.hide();
		}
		else
		{
			set_direction.hide();
			variable_direction.show();
		}
	});

	this.program_direction_select($('#direction'), 'Set direction of next command');

};

FormManager.prototype.form_look = function(json)
{
	this.new_form();
	
	$('#instruction').append(this.form_header('static/img/editor_look_large.png', 'Look')).append(this.form_selector('action-choice', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}]));
	
	var set_direction = $('<div></div>').appendTo($('#instruction')).css({position: 'relative', height: '64px', width: '100%'});
	this.action_direction_select(set_direction);
	
	var variable_direction = $('<div id="var-dir"></div>').append(this.form_selector('variable-dir', [{key: 'DIR1', value: '1'},{key: 'DIR2', value: '2'},{key: 'DIR3', value: '3'}])).hide().appendTo($('#instruction'));
	variable_direction.css('height', '64px');
	
	var variables = $('<div></div>').appendTo($('#instruction')).css('margin', '15px');
	
	variables.append($('<div>Save entity to</div>'));
	variables.append(this.form_selector('entity_var', [{key: 'ENT1', value: '1'}, {key: 'ENT2', value: '2'}, {key: 'ENT3', value: '3'}]));
	variables.append($('<div>Save energy level to</div>'));
	variables.append(this.form_selector('energy_var', [{key: 'NUM1', value: '1'}, {key: 'NUM2', value: '2'}, {key: 'NUM3', value: '3'}]));
	
	$('#action-choice').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_direction.show();
			variable_direction.hide();
		}
		else
		{
			set_direction.hide();
			variable_direction.show();
		}
	});

	this.program_direction_select($('#direction'), 'Set direction of next command');

};

FormManager.prototype.form_if = function(json)
{
	this.new_form();
	
	$('#instruction').append(this.form_header('static/img/editor_if_large.png', 'If')).append('<span>Test case type</span>').append(this.form_selector('action-choice', [{key: 'Entity', value: '1'},{key: 'Direction', value: '2'}, {key: 'Number', value: '3'}]));
	
	var entity1 = $('<div id="entity1" class="form-margin"></div>').append(this.form_selector('set-ent-choice1', [{key: 'Set Entity', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_entity1 = $('<div></div>').append(this.form_selector('set-entity1', [{key: 'Friend', value: '1'}, {key: 'Enemy', value: '2'}, {key: 'Food', value: '3'}, {key: 'Boundary', value: '4'}, {key: 'Empty', value: '5'}])).hide().appendTo($('#entity1'));
	var variable_entity1 = $('<div></div>').append(this.form_selector('variable-ent1', [{key: 'ENT1', value: '1'},{key: 'ENT2', value: '2'},{key: 'ENT3', value: '3'}])).hide().appendTo($('#entity1'));
	var entity2 = $('<div id="entity2" class="form-margin"></div>').append(this.form_selector('set-ent-choice2', [{key: 'Set Entity', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_entity2 = $('<div></div>').append(this.form_selector('set-entity2', [{key: 'Friend', value: '1'}, {key: 'Enemy', value: '2'}, {key: 'Food', value: '3'}, {key: 'Boundary', value: '4'}, {key: 'Empty', value: '5'}])).hide().appendTo($('#entity2'));
	var variable_entity2 = $('<div></div>').append(this.form_selector('variable-ent2', [{key: 'ENT1', value: '1'},{key: 'ENT2', value: '2'},{key: 'ENT3', value: '3'}])).hide().appendTo($('#entity2'));

	var direction1 = $('<div id="ins-direction1" class="form-margin"></div>').append(this.form_selector('set-dir-choice1', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_direction1 = $('<div></div>').hide().appendTo($('#ins-direction1')).css({position: 'relative', height: '64px', width: '100%'});
	this.action_direction_select(set_direction1);
	var variable_direction1 = $('<div></div>').append(this.form_selector('variable-dir1', [{key: 'DIR1', value: '1'},{key: 'DIR2', value: '2'},{key: 'DIR3', value: '3'}])).hide().appendTo($('#ins-direction1'));	
	var direction2 = $('<div id="ins-direction2" class="form-margin"></div>').append(this.form_selector('set-dir-choice2', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_direction2 = $('<div></div>').hide().appendTo($('#ins-direction2')).css({position: 'relative', height: '64px', width: '100%'});
	this.action_direction_select(set_direction2);
	var variable_direction2 = $('<div></div>').append(this.form_selector('variable-dir2', [{key: 'DIR1', value: '1'},{key: 'DIR2', value: '2'},{key: 'DIR3', value: '3'}])).hide().appendTo($('#ins-direction2'));	

	var number1 = $('<div id="number1" class="form-margin"></div>').append(this.form_selector('set-num-choice1', [{key: 'Set Number', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_number1 = $('<div></div>').append('<input type="number"></input>').hide().appendTo($('#number')).css({position: 'relative', height: '64px', width: '100%'});
	var variable_number1 = $('<div></div>').append(this.form_selector('variable-num1', [{key: 'NUM1', value: '1'},{key: 'NUM2', value: '2'},{key: 'NUM3', value: '3'}])).hide().appendTo($('#number1'));	
	var number2 = $('<div id="number2" class="form-margin"></div>').append(this.form_selector('set-num-choice2', [{key: 'Set Number', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_number2 = $('<div></div>').append('<input type="number"></input>').hide().appendTo($('#number')).css({position: 'relative', height: '64px', width: '100%'});
	var variable_number2 = $('<div></div>').append(this.form_selector('variable-num1', [{key: 'NUM1', value: '1'},{key: 'NUM2', value: '2'},{key: 'NUM3', value: '3'}])).hide().appendTo($('#number2'));	

	$('#action-choice').change(function(event)
	{
		if($(this).val() == 1)
		{
			direction1.hide();
			direction2.hide();
			number1.hide();
			number2.hide();
			entity1.show();
			
			entity2.show();
		}
		
		else if($(this).val() == 2)
		{
			entity1.hide();
			entity2.hide();
			number1.hide();
			number2.hide();
			direction1.show();
			direction2.show();
		}
		else
		{
			entity1.hide();
			entity2.hide();
			direction1.hide();
			direction2.hide();
			number1.show();
			number2.show();
		}
	}).trigger('change');
	
	$('#set-ent-choice1').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_entity1.show();
			set_entity2.show();
			variable_entity1.hide();
			variable_entity2.hide();
		}
		else
		{
			set_entity1.hide();
			set_entity2.hide();
			variable_entity1.show();
			variable_entity2.show();
		}
	}).trigger('change');
	
	$('#set-dir-choice1').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_direction1.show();
			set_direction2.show();
			variable_direction1.hide();
			variable_direction2.hide();
		}
		else
		{
			set_direction1.hide();
			set_direction2.hide();
			variable_direction1.show();
			variable_direction2.show();
		}
	}).trigger('change');	

	$('#set-num-choice1').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_number1.show();
			set_number2.show();
			variable_number1.hide();
			variable_number2.hide();
			
		}
		else
		{
			set_number1.hide();
			set_number2.hide();
			variable_number1.show();
			variable_number2.show();
		}
	}).trigger('change');
	
	this.program_direction_select($('#direction'), 'Set direction of next command');

};
