FormManager = function()
{
	this.$form = $('#form');
};

FormManager.grid_data = {
	'[0,0]': 'ul',
	'[1,0]': 'ur',
	'[2,1]': 'r',
	'[2,2]': 'dr',
	'[1,2]': 'dl',
	'[0,1]': 'l'
};

FormManager.directions = ['UL', 'UR', 'R', 'DR', 'DL', 'L'];
FormManager.entities = ['FRIEND', 'ENEMY', 'EMPTY', 'FOOD', 'BOUND'];

FormManager.prototype.clear = function()
{
	this.$form.html('').hide();
};

FormManager.prototype.new_form = function()
{
	this.clear();
	this.$form.html('<div id="instruction"></div><div id="direction"></div>').show();
};
/***********************
 * FORMPART PRIMITIVES *
 ***********************/
FormManager.prototype.form_header = function(img, text)
{
	var header = $('<table><tr></tr></table>');
	
	$('<td><img /></td>').appendTo($('tr', header)).find('img').attr('src', img);
	$('<td></td>').appendTo($('tr', header)).text(text);
	
	return header;
};
 
FormManager.prototype.formpart_dropdown = function(options)
{
	var $element = $('<select></select>');
	
	for(var i=0; i < options.length; i++)
	{
		$('<option></option>').attr('value', options[i].value).text(options[i].key).appendTo($element);
	}
	
	return $element;
};

FormManager.prototype.formpart_choose_variable = function(json, key, type)
{
	var direct = false;
	var name = [type + '1',
				type + '2',
				type + '3'];
	
	var initial = json[key].value;
	if (!initial)
	{
		direct = true;
		initial = json[key];
	}
	else
	{
		if (json[key].source != 'variable')
			initial = name[0];
	}
	
	var $element = this.formpart_dropdown([{key: name[0], value: name[0]}, {key: name[1], value: name[1]}, {key: name[2], value: name[2]}]).val(initial);
	
	// The split between update and change events are technically redundant, but made for consistency with direction pick
	$element.bind('update', function(event)
	{
		event.stopPropagation();
		event.preventDefault();
		var value = $(this).val();
		
		if (direct)
			json[key] = value;
		else
		{
			json[key].value = value;
			json[key].source = 'variable';
		}
	}).change(function(event)
	{
		$(this).trigger('update');
	});
	
	return $element;
};
 
FormManager.prototype.formpart_entity_pick = function(json, key)
{
	var initial = json[key].value;
	if (FormManager.entities.indexOf(initial) === -1)
		initial = 'FRIEND';
	
	var $element = this.formpart_dropdown([{key: 'Friend', value: 'FRIEND'}, {key: 'Enemy', value: 'ENEMY'}, {key: 'Empty Tile', value: 'EMPTY'}, {key: 'Food', value: 'FOOD'}, {key: 'Out of Bounds', value: 'BOUND'}]).val(initial);
	
	$element.bind('update', function(event)
	{
		event.stopPropagation();
		event.preventDefault();
		var value = $(this).val();
		
		json[key].value = value;
		json[key].source = 'explicit';

	}).change(function(event)
	{
		$(this).trigger('update');
	});
	
	return $element;
}
 
FormManager.prototype.formpart_direction_pick = function(json, key, class_picker, class_overlay)
{
	var $element = $('<div class="direction-palette-wrapper"></div>').data('direct', false);
	var $picker = $('<div class="direction-palette picker"></div>').addClass(class_picker).appendTo($element);
	var $overlay = $('<div class="direction-palette overlay"></div>').addClass(class_overlay).appendTo($element);
	var grid = new HexGrid([24, 24], 12, 2, [-4, 2], 'horizontal');

	var direction = json[key].value;
	if (!direction)
	{
		$element.data('direct', true);
		direction = json[key];
	}
	else
	{
		if (json[key].source !== 'explicit' || FormManager.directions.indexOf(direction) === -1)
			direction = 'R';
	}
	$element.data('direction', direction.toLowerCase());
	
	$element.bind('refresh', function(event)
	{
		$overlay.removeClass('l r ul ur dl dr').addClass($(this).data('direction'));
	}).trigger('refresh');
	
	$element.bind('update', function(event)
	{
		event.stopPropagation();
		event.preventDefault();
		var value = $(this).data('direction').toUpperCase();
		
		if ($(this).data('direct'))
			json[key] = value;
		else
		{
			json[key].value = value;
			json[key].source = 'explicit';
		}
	});
	
	$picker.click(function(event)
	{
		var offset = $(this).offset();
		var position = [event.pageX - offset.left, event.pageY - offset.top];
		var tile_position = grid.get_tile_position(position);
		
		if(grid.is_inside(tile_position) && !(tile_position[0] === 1 && tile_position[1] === 1))
		{
			$element.data('direction', FormManager.grid_data[JSON.stringify(tile_position)]).trigger('refresh').trigger('update');
		}
	});
	
	return $element;
};

/**********************
 * FORMPART COMPOUNDS *
 **********************/
FormManager.prototype.formpart_continue = function(json, has_divert)
{
	var $element = $('<div></div>');

	var width = '100%';
	if (has_divert)
		width = '50%';
		
	this.formpart_direction_pick(json, 'continue', 'continue', 'editor').css({'width': width, 'display': 'inline-block'}).appendTo($element);
	if (has_divert)
		this.formpart_direction_pick(json, 'divert', 'divert', 'editor').css({'width': width, 'display': 'inline-block'}).appendTo($element);
		
	return $element;
}

FormManager.prototype.formpart_load_direction = function(json, key)
{
	var $element = $('<div></div>').css('height', '110px');
	$element.append($('<div class="form-label">Choose direction:</div>'));
	var $picker = this.formpart_dropdown([{key: 'Set Direction', value: 'explicit'}, {key: 'From Variable', value: 'variable'}]).val(json[key].source).appendTo($element);
	
	var $explicit_wrapper = $('<div></div>').hide().appendTo($element);
	var $variable_wrapper = $('<div></div>').hide().appendTo($element);
	
	var $explicit = this.formpart_direction_pick(json, key, 'board', 'board').appendTo($explicit_wrapper);
	var $variable = this.formpart_choose_variable(json, key, 'DIR').appendTo($variable_wrapper);

	$picker.change(function(event)
	{
		var source = $(this).val();
		if (source === 'explicit')
		{
			$explicit_wrapper.show();
			$explicit.trigger('update');
			
			$variable_wrapper.hide();
		}
		else
		{
			$variable_wrapper.show();
			$variable.trigger('update');
			
			$explicit_wrapper.hide();
		}
	});
	
	$element.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		$picker.trigger('change');
	});
	
	return $element;
};

FormManager.prototype.formpart_load_entity = function(json, key)
{
	var $element = $('<div></div>').css('height', '110px');
	$element.append($('<div class="form-label">Choose entity type:</div>'));
	var $picker = this.formpart_dropdown([{key: 'Set Entity Type', value: 'explicit'}, {key: 'From Variable', value: 'variable'}]).val(json[key].source).appendTo($element);
	
	var $explicit_wrapper = $('<div></div>').hide().appendTo($element);
	var $variable_wrapper = $('<div></div>').hide().appendTo($element);
	
	var $explicit = this.formpart_entity_pick(json, key).appendTo($explicit_wrapper);
	var $variable = this.formpart_choose_variable(json, key, 'ENT').appendTo($variable_wrapper);

	$picker.change(function(event)
	{
		var source = $(this).val();
		if (source === 'explicit')
		{
			$explicit_wrapper.show();
			$explicit.trigger('update');
			
			$variable_wrapper.hide();
		}
		else
		{
			$variable_wrapper.show();
			$variable.trigger('update');
			
			$explicit_wrapper.hide();
		}
	});
	
	$element.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		$picker.trigger('change');
	});
	
	return $element;
};

/****************
 * ACTUAL FORMS *
 ****************/
FormManager.prototype.form_nop = function(json)
{
	this.new_form();
	this.formpart_continue(json, false).appendTo($('#direction'));
	
	$('#instruction').append(this.form_header('static/img/editor_empty_large.png', 'No operation'));
};

FormManager.prototype.form_move = function(json)
{
	this.new_form();
	this.formpart_continue(json, false).appendTo($('#direction'));
	
	$('#instruction').append(this.form_header('static/img/editor_move_large.png', 'Move action'));
	$('#instruction').append(this.formpart_load_direction(json, 'target').trigger('update'));
};

FormManager.prototype.form_split = function(json)
{
	this.new_form();
	this.formpart_continue(json, false).appendTo($('#direction'));
	
	$('#instruction').append(this.form_header('static/img/editor_split_large.png', 'Split action'));
	$('#instruction').append(this.formpart_load_direction(json, 'target').trigger('update'));
};

FormManager.prototype.form_look = function(json)
{
	this.new_form();
	this.formpart_continue(json, false).appendTo($('#direction'));
	
	$('#instruction').append(this.form_header('static/img/editor_look_large.png', 'Look'));
	$('#instruction').append(this.formpart_load_direction(json, 'target').trigger('update'));
	
	$('#instruction').append($('<div class="form-label">Save entity type spotted to:</div>'));
	$('#instruction').append(this.formpart_choose_variable(json, 'save_entity', 'ENT'));
	$('#instruction').append($('<div class="form-label">Save energy found to:</div>'));
	$('#instruction').append(this.formpart_choose_variable(json, 'save_energy', 'NUM'));
};

FormManager.prototype.form_if = function(json)
{
	this.new_form();
	this.formpart_continue(json, true).appendTo($('#direction'));
	
	$('#instruction').append(this.form_header('static/img/editor_if_large.png', 'If'));
	
	$('#instruction').append($('<div class="form-label">Choose comparison type:</div>'));
	var $picker = this.formpart_dropdown([{key: 'Numbers', value: 'NUM'}, {key: 'Directions', value: 'DIR'}, {key: 'Entity Types', value: 'ENT'}]).val(json.expr_type).appendTo($('#instruction'));
	
	// DIRECTION COMPARISON	
	var $direction_wrapper = $('<div></div').appendTo($('#instruction')).hide();
	var $direction_first = this.formpart_load_direction(json, 'first').appendTo($direction_wrapper);
	$direction_wrapper.append($('<div class="form-label">Comparison operator:</div>'));
	var $direction_operator = this.formpart_dropdown([{key: 'Equal', value: '='}, {key: 'Not Equal', value: '!='}]).val(json.operator).appendTo($direction_wrapper);
	var $direction_second = this.formpart_load_direction(json, 'second').appendTo($direction_wrapper);
	
	$direction_operator.change(function()
	{
		json.operator = $(this).val();
	});
	
	$direction_wrapper.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		$direction_operator.trigger('change');
		$direction_first.trigger('update');
		$direction_second.trigger('update');
	});
	
	// NUMBER COMPARISON
	var $number_wrapper = $('<div></div').appendTo($('#instruction')).hide();
	
	
	// ENTITY COMPARISON
	var $entity_wrapper = $('<div></div').appendTo($('#instruction')).hide();
	var $entity_first = this.formpart_load_entity(json, 'first').appendTo($entity_wrapper);
	$entity_wrapper.append($('<div class="form-label">Comparison operator:</div>'));
	var $entity_operator = this.formpart_dropdown([{key: 'Equal', value: '='}, {key: 'Not Equal', value: '!='}]).val(json.operator).appendTo($entity_wrapper);
	var $entity_second = this.formpart_load_entity(json, 'second').appendTo($entity_wrapper);
	
	$entity_operator.change(function()
	{
		json.operator = $(this).val();
	});
	
	$entity_wrapper.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		$entity_operator.trigger('change');
		$entity_first.trigger('update');
		$entity_second.trigger('update');
	});

	// TYPE CHANGE
	$picker.change(function(event)
	{
		json.expr_type = $(this).val();
	
		if ($(this).val() === 'DIR')
		{
			$direction_wrapper.show().trigger('update');
			$number_wrapper.hide();
			$entity_wrapper.hide();
		}
		else if ($(this).val() === 'NUM')
		{
			$direction_wrapper.hide();
			$number_wrapper.show().trigger('update');
			$entity_wrapper.hide();
		}
		else if ($(this).val() === 'ENT')
		{
			$direction_wrapper.hide();
			$number_wrapper.hide();
			$entity_wrapper.show().trigger('update');
		}
	}).trigger('change');
	
	
	
	
	/*
	var entity1 = $('<div id="entity1" class="form-margin"></div>').append(this.form_selector('set-ent-choice1', [{key: 'Set Entity', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_entity1 = $('<div></div>').append(this.set_entity('set-entity1')).hide().appendTo($('#entity1'));
	var variable_entity1 = $('<div></div>').append(this.var_selector('entity', 'variable-ent1')).hide().appendTo($('#entity1'));
	
	var ent_comparison = $('<div></div>').append(this.form_selector('ent-comparison', [{key: '=', value: '1'},{key: '!=', value: '2'}])).hide().appendTo($('#entity1'));
	
	var entity2 = $('<div id="entity2" class="form-margin"></div>').append(this.form_selector('set-ent-choice2', [{key: 'Set Entity', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_entity2 = $('<div></div>').append(this.set_entity('set-entity2')).hide().appendTo($('#entity2'));
	var variable_entity2 = $('<div></div>').append(this.var_selector('entity', 'variable-ent2')).hide().appendTo($('#entity2'));

	var direction1 = $('<div id="ins-direction1" class="form-margin"></div>').append(this.form_selector('set-dir-choice1', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_direction1 = $('<div></div>').hide().appendTo($('#ins-direction1')).css({position: 'relative', height: '64px', width: '100%'});
	this.action_direction_select(set_direction1);
	var variable_direction1 = $('<div></div>').append(this.var_selector('direction', 'variable-dir1')).hide().appendTo($('#ins-direction1'));	
	
	var dir_comparison = $('<div></div>').append(this.form_selector('dir-comparison', [{key: '=', value: '1'},{key: '!=', value: '2'}])).hide().appendTo($('#ins-direction1'));	
	
	var direction2 = $('<div id="ins-direction2" class="form-margin"></div>').append(this.form_selector('set-dir-choice2', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_direction2 = $('<div></div>').hide().appendTo($('#ins-direction2')).css({position: 'relative', height: '64px', width: '100%'});
	this.action_direction_select(set_direction2);
	var variable_direction2 = $('<div></div>').append(this.var_selector('direction','variable-dir2')).hide().appendTo($('#ins-direction2'));	

	var number1 = $('<div id="number1" class="form-margin"></div>').append(this.form_selector('set-num-choice1', [{key: 'Set Number', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_number1 = $('<div></div>').append('<input type="number"></input>').hide().appendTo($('#number1')).css({position: 'relative', height: '64px', width: '100%'});
	var variable_number1 = $('<div></div>').append(this.var_selector('number', 'variable-num1')).hide().appendTo($('#number1'));	
	
	var num_comparison = $('<div></div>').append(this.form_selector('num-comparison', [{key: '>', value: '1'},{key: '=', value: '2'}, {key: '<', value: '3'}])).hide().appendTo($('#number1'));		
	
	var number2 = $('<div id="number2" class="form-margin"></div>').append(this.form_selector('set-num-choice2', [{key: 'Set Number', value: '1'},{key: 'From Variable', value: '2'}])).hide().appendTo('#instruction');
	var set_number2 = $('<div></div>').append('<input type="number"></input>').hide().appendTo($('#number2')).css({position: 'relative', height: '64px', width: '100%'});
	var variable_number2 = $('<div></div>').append(this.form_selector('number', 'variable-num1')).hide().appendTo($('#number2'));	

	$('#action-choice').change(function(event)
	{
		if($(this).val() == 1)
		{
			direction1.hide();
			direction2.hide();
			number1.hide();
			num_comparison.hide();
			number2.hide();
			entity1.show();
			ent_comparison.show();
			entity2.show();
		}
		
		else if($(this).val() == 2)
		{
			entity1.hide();
			ent_comparison.hide();
			entity2.hide();
			number1.hide();
			num_comparison.hide();
			number2.hide();
			direction1.show();
			dir_comparison.show();
			direction2.show();
		}
		else
		{
			entity1.hide();
			ent_comparison.hide();
			entity2.hide();
			direction1.hide();
			dir_comparison.hide();
			direction2.hide();
			number1.show();
			num_comparison.show();
			number2.show();
		}
	}).trigger('change');
	
	$('#set-ent-choice1').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_entity1.show();
			variable_entity1.hide();
		}
		else
		{
			set_entity1.hide();
			variable_entity1.show();
		}
	}).trigger('change');	

	$('#set-ent-choice2').change(function(event)
	{
		if($(this).val() == 1)
		{
			set_entity2.show();
			variable_entity2.hide();
		}
		else
		{
			set_entity2.hide();
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
	
	this.program_direction_select($('#direction'), 'Set direction of next command if test case is true ');
	//this.program_direction_select($('#direction'), 'Set direction of next command if test case is false ');
	*/
};

FormManager.prototype.form_loop = function(json)
{
	this.new_form();
	this.formpart_continue(json, true).appendTo($('#direction'));
	
	$('#instruction').append(this.form_header('static/img/editor_for_large.png', 'Loop'));
	/*
	$('#instruction').append('<span>Choose type to loop</span>').append(this.form_selector('action-choice', [{key: 'Entity', value: '1'},{key: 'Direction', value: '2'}, {key: 'Number', value: '3'}]));
	
	var entity = $('<div></div>').append('<span>Choose variable to loop</span>').append(this.var_selector('entity', 'ent-var')).hide().appendTo($('#instruction'));
	
	var direction = $('<div id="dir-select"></div>').append('<span>Choose loop direction and start</span>').append(this.form_selector('directions', [{key: 'clockwise', value: '1'}, {key: 'counter-clockwise', value: '2'}])).appendTo($('#instruction'));
	var set_direction = $('<div></div>').css({position: 'relative', height: '64px', width: '100%'}).appendTo($('#dir-select'));
	this.action_direction_select(set_direction);
	
	var number = $('<div id ="number"></div>').append('<span>Choose variable to save current loop number in </span>').append(this.var_selector('number', 'num-var')).hide().appendTo($('#instruction'));
	var set_number1 = $('<div></div>').append('<span>Choose starting number </span>').append('<input type="number"></input>').appendTo($('#number')).css({position: 'relative', height: '64px', width: '100%'});
	var set_number2 = $('<div></div>').append('<span>Choose ending number </span>').append('<input type="number"></input>').appendTo($('#number')).css({position: 'relative', height: '64px', width: '100%'});
	
	$('#action-choice').change(function(event)
	{
		if($(this).val() == 1)
		{
			entity.show();
			direction.hide();
			number.hide();
			
		}
		else if($(this).val() == 2)
		{
			direction.show();
			entity.hide();
			number.hide();
		}
		else
		{
			number.show();
			direction.hide();
			entity.hide();
		}
	}).trigger('change');	
	
	this.program_direction_select($('#direction'), 'Set direction of loop entry');
	//this.program_direction_select($('#direction'), 'Set direction of loop exit');*/
};
