FormManager = function(){};

$(function() 
{
	var f = new FormManager();
	f.form_move();
});

FormManager.prototype.form_header = function(img, text)
{
	var header = $('<table><tr></tr></table>');
	
	$('<td><img /></td>').appendTo($('tr', header)).find('img').attr('src', img);
	$('<td></td>').appendTo($('tr', header)).text(text);
	
	return header;
	
}

FormManager.prototype.form_selector = function(id, options)
{
	var selector = $('<select id="' + id + '"></select>');
	
	for(var i=0; i < options.length; i++)
	{
		$('<option value="' + options[i].value + '"></option>').text(options[i].key).appendTo(selector);
	}
	
	return selector;
}

FormManager.prototype.form_nop = function(json)
{
	$('#instruction').append(this.direction_form_header('static/img/editor_empty_large.png', 'No operation'));
	
	var direction_form = $('#direction');
	$('#direction-graphics').css({left: direction_form.width()/2, top: direction_form.height()/2});
	
	grid = new HexGrid([24, 24], 12, 2, [-4, 2], 'horizontal');
	
	$('#direction-graphics').click(function(event)
	{
		var offset = $(this).offset();
		var position = [event.clientX - offset.left, event.clientY - offset.top];
		var tile_position = grid.get_tile_position(position);
		
		if(tile_position[0] === 0 && tile_position[1] === 0)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_ul.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 1 && tile_position[1] === 0)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_ur.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 2 && tile_position[1] === 1)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_r.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 2 && tile_position[1] === 2)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_dr.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 1 && tile_position[1] === 2)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_dl.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 0 && tile_position[1] === 1)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_l.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
	});	
};

FormManager.prototype.form_move = function(json)
{
	
	$('#instruction').append(this.form_header('static/img/editor_move_large.png', 'Move action')).append(this.form_selector('action-choice', [{key: 'Set Direction', value: '1'},{key: 'From Variable', value: '2'}]));
	
	var set_direction = $('<div id="set-dir"><img id="move-direction" src="static/img/move_direction.png"/></div>');
	set_direction.appendTo($('#instruction'));
	$('#move-direction').css({left: $('#set-dir').width()/2, top: $('#set-dir').height()/2});
	
	set_dir_grid = new HexGrid([24, 24], 12, 2, [-4, 2], 'horizontal');
	$('#move-direction').click(function(event)
	{
		var offset = $(this).offset();
		var position = [event.clientX - offset.left, event.clientY - offset.top];
		var tile_position = set_dir_grid.get_tile_position(position);
		
		if(tile_position[0] === 0 && tile_position[1] === 0)
		{
			set_direction.append('<img class="direction-image" src="static/img/move_dir_ul.png"></img>');
			$('.direction-image').css({left: set_direction.width()/2, top: set_direction.height()/2});
		}
		
		if(tile_position[0] === 1 && tile_position[1] === 0)
		{
			set_direction.append('<img class="direction-image" src="static/img/move_dir_ur.png"></img>');
			$('.direction-image').css({left: set_direction.width()/2, top: set_direction.height()/2});
		}
		
		if(tile_position[0] === 2 && tile_position[1] === 1)
		{
			set_direction.append('<img class="direction-image" src="static/img/move_dir_r.png"></img>');
			$('.direction-image').css({left: set_direction.width()/2, top: set_direction.height()/2});
		}
		
		if(tile_position[0] === 2 && tile_position[1] === 2)
		{
			set_direction.append('<img class="direction-image" src="static/img/move_dir_dr.png"></img>');
			$('.direction-image').css({left: set_direction.width()/2, top: set_direction.height()/2});
		}
		
		if(tile_position[0] === 1 && tile_position[1] === 2)
		{
			set_direction.append('<img class="direction-image" src="static/img/move_dir_dl.png"></img>');
			$('.direction-image').css({left: set_direction.width()/2, top: set_direction.height()/2});
		}
		
		if(tile_position[0] === 0 && tile_position[1] === 1)
		{
			set_direction.append('<img class="direction-image" src="static/img/move_dir_l.png"></img>');
			$('.direction-image').css({left: set_direction.width()/2, top: set_direction.height()/2});
		}
	});	
	
	
	
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
	
	/*----------- INSTRUCTION DIRECTION --------------*/
	var direction_form = $('#direction');
	$('#direction-graphics').css({left: direction_form.width()/2, top: direction_form.height()/2});
	
	grid = new HexGrid([24, 24], 12, 2, [-4, 2], 'horizontal');
	
	$('#direction-graphics').click(function(event)
	{
		var offset = $(this).offset();
		var position = [event.clientX - offset.left, event.clientY - offset.top];
		var tile_position = grid.get_tile_position(position);
		
		if(tile_position[0] === 0 && tile_position[1] === 0)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_ul.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 1 && tile_position[1] === 0)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_ur.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 2 && tile_position[1] === 1)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_r.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 2 && tile_position[1] === 2)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_dr.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 1 && tile_position[1] === 2)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_dl.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
		
		if(tile_position[0] === 0 && tile_position[1] === 1)
		{
			direction_form.append('<img class="direction-image" src="static/img/selection_direction_l.png"></img>');
			$('.direction-image').css({left: direction_form.width()/2, top: direction_form.height()/2});
		}
	});	
};

