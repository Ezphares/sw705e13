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
FormManager.entities = ['FRIEND', 'ENEMY', 'FOOD', 'EMPTY', 'BOUND'];

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

FormManager.prototype.formpart_number_pick = function(json, key)
{
	var initial = json[key].value;
	if (isNaN(parseInt(initial)))
		initial = '0';
	
	var $element = $('<input type="number" />').val(initial);
	
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
};
 
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
};

FormManager.prototype.formpart_load_number = function(json, key)
{
	var $element = $('<div></div>').css('height', '110px');
	$element.append($('<div class="form-label">Choose number:</div>'));
	var $picker = this.formpart_dropdown([{key: 'Set Number', value: 'explicit'}, {key: 'From Variable', value: 'variable'}, {key: 'Own Health', value: 'derived'}]).val(json[key].source).appendTo($element);
	
	var $explicit_wrapper = $('<div></div>').hide().appendTo($element);
	var $variable_wrapper = $('<div></div>').hide().appendTo($element);
	
	var $explicit = this.formpart_number_pick(json, key).appendTo($explicit_wrapper);
	var $variable = this.formpart_choose_variable(json, key, 'NUM').appendTo($variable_wrapper);

	$picker.change(function(event)
	{
		var source = $(this).val();
		if (source === 'explicit')
		{
			$explicit_wrapper.show();
			$explicit.trigger('update');
			
			$variable_wrapper.hide();
		}
		else if (source === 'variable')
		{
			$variable_wrapper.show();
			$variable.trigger('update');
			
			$explicit_wrapper.hide();
		}
		else 
		{
			$explicit_wrapper.hide();
			$variable_wrapper.hide();
			json[key] = {source: 'derived', value: 'DV_OWNHEALTH'};
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
	var $number_first = this.formpart_load_number(json, 'first').appendTo($number_wrapper);
	$number_wrapper.append($('<div class="form-label">Comparison operator:</div>'));
	var $number_operator = this.formpart_dropdown([{key: 'Equal', value: '='}, {key: 'Less', value: '<'}, {key: 'Greater', value: '>'}, {key: 'Less or Equal', value: '<='}, {key: 'Greater or Equal', value: '>='}, {key: 'Not Equal', value: '!='}]).val(json.operator).appendTo($number_wrapper);
	var $number_second = this.formpart_load_number(json, 'second').appendTo($number_wrapper);
	
	$number_operator.change(function()
	{
		json.operator = $(this).val();
	});
	
	$number_wrapper.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		$number_operator.trigger('change');
		$number_first.trigger('update');
		$number_second.trigger('update');
	});
	
	
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
};

FormManager.prototype.form_loop = function(json)
{
	this.new_form();
	this.formpart_continue(json, true).appendTo($('#direction'));
	
	$('#instruction').append(this.form_header('static/img/editor_for_large.png', 'Loop'));
	
	$('#instruction').append($('<div class="form-label">Choose loop type:</div>'));
	var $picker = this.formpart_dropdown([{key: 'Numbers', value: 'NUM'}, {key: 'Directions', value: 'DIR'}, {key: 'Entity Types', value: 'ENT'}]).val(json.expr_type).appendTo($('#instruction'));

	// DIRECTION LOOP	
	var $direction_wrapper = $('<div></div').appendTo($('#instruction')).hide();
	$direction_wrapper.append($('<div class="form-label">Choose loop variable:</div>'));
	$direction_variable = this.formpart_choose_variable(json, 'variable', 'DIR').val(json.variable).appendTo($direction_wrapper);

	$direction_wrapper.append($('<div class="form-label">Loop start:</div>'));
	var $direction_start = this.formpart_load_direction(json, 'start').appendTo($direction_wrapper);
	$direction_wrapper.append($('<div class="form-label">Loop end:</div>'));
	var $direction_end = this.formpart_load_direction(json, 'end').appendTo($direction_wrapper);
	
	$direction_wrapper.append($('<div class="form-label">Loop direction:</div>'));
	var $direction_increment = this.formpart_dropdown([{key: 'Clockwise', value: 'DV_CLOCKWISE'}, {key: 'Counter-Clockwise', value: 'DV_COUNTERCLOCKWISE'}]).val(json.increment).appendTo($direction_wrapper);
	
	$direction_increment.bind('change', function(event)
	{
		json.increment = $(this).val();
	});
	
	$direction_wrapper.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
	
		$direction_variable.trigger('change');
		$direction_start.trigger('update');
		$direction_end.trigger('update');
		$direction_increment.trigger('change');
	});
	
	// NUMBER LOOP
	var $number_wrapper = $('<div></div').appendTo($('#instruction')).hide();
	$number_wrapper.append($('<div class="form-label">Choose loop variable:</div>'));
	$number_variable = this.formpart_choose_variable(json, 'variable', 'NUM').val(json.variable).appendTo($entity_wrapper);
	
	$number_wrapper.append($('<div class="form-label">Loop start:</div>'));
	var $number_start = this.formpart_load_number(json, 'start').appendTo($number_wrapper);
	$number_wrapper.append($('<div class="form-label">Loop end:</div>'));
	var $number_end = this.formpart_load_number(json, 'end').appendTo($number_wrapper);
	
	$number_wrapper.append($('<div class="form-label">Loop direction:</div>'));
	var $number_increment = this.formpart_dropdown([{key: '+1', value: '+1'}, {key: '-1', value: '-1'}]).val(json.increment).appendTo($number_wrapper);
	
	$number_increment.bind('change', function(event)
	{
		json.increment = $(this).val();
	});
	
	$number_wrapper.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
	
		$number_variable.trigger('change');
		$number_start.trigger('update');
		$number_end.trigger('update');
		$number_increment.trigger('change');
	});
	
	// ENTITY LOOP
	var $entity_wrapper = $('<div></div').appendTo($('#instruction')).hide();
	$entity_wrapper.append($('<div class="form-label">Choose loop variable:</div>'));
	var $entity_variable = this.formpart_choose_variable(json, 'variable', 'ENT').val(json.variable).appendTo($entity_wrapper);
	$entity_wrapper.append($('<div class="form-label">Entity type loop sequence:<br />&nbsp;Friend<br />&nbsp;Enemy<br />&nbsp;Food<br />&nbsp;Empty Tile<br />&nbsp;Out of Bounds</div>'));
	
	$entity_wrapper.bind('update', function(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		$entity_variable.trigger('change');
		json.start = {source: 'explicit', value: 'FRIEND'};
		json.end = {source: 'explicit', value: 'BOUND'};
		json.increment = 'DV_NEXTENTITY';
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
