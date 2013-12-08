FormManager = function()
{
	this.form = $('#form');
};

$(function() 
{
	var f = new FormManager();
	f.form_look();
	
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