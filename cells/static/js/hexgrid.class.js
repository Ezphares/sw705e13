HexGrid = function(tile_size, tile_cutoff, edge_size, grid_offset, orientation)
{
	if (orientation !== 'horizontal')
	{
		console.log('Only horizontal orientation is currently supported');
		return;
	}
	
	this.orientation = orientation;
	this.tile_size = tile_size;
	this.tile_cutoff = tile_cutoff;
	this.edge_size = edge_size;
	this.grid_offset = grid_offset;
	
	this.tile_deadzone = [this.tile_size[0] / 2, this.tile_cutoff / 2];
	this.tile_livezone = [this.tile_size[0], this.tile_size[1] - this.tile_cutoff];

	this.delta_x = [this.tile_size[0], 0];
	this.delta_y = [-this.tile_size[0] / 2, this.tile_size[1] - this.tile_deadzone[1]];
	

};

HexGrid.prototype.get_tile_position = function(point)
{
	var origin = this.get_pixel_coordinate([0, 0]);
	var low = this.get_pixel_coordinate([0, 0]);
	var high = this.get_pixel_coordinate([0, 0]);
	var lowp = [0, 0];
	var highp = [0, 0];
	
	// Localizing the y-range
	if (point[1] <= origin[1]) // North of zero
	{
		while (high[1] > point[1] + this.delta_y[1])
		{
			low[0] -= this.delta_y[0];
			low[1] -= this.delta_y[1];
			lowp[1]--;
			high[0] -= this.delta_y[0];
			high[1] -= this.delta_y[1];
			highp[1]--;
		}
		low[0] -= this.delta_y[0];
		low[1] -= this.delta_y[1];
		lowp[1]--;
	}
	else
	{
		high[0] += this.delta_y[0];
		high[1] += this.delta_y[1];
		highp[1]++;
		while (high[1] < point[1])
		{
			low[0] += this.delta_y[0];
			low[1] += this.delta_y[1];
			lowp[1]++;
			high[0] += this.delta_y[0];
			high[1] += this.delta_y[1];
			highp[1]++;
		}
	}
	
	return {low: lowp, high: highp};
};

HexGrid.prototype.get_pixel_coordinate = function(position)
{
	var origin = [ this.grid_offset[0] - this.delta_y[0] * this.edge_size, this.grid_offset[1] + this.delta_y[1] / 2 ];
	return [ origin[0] + position[0] * this.delta_x[0] + position[1] * this.delta_y[0],
			 origin[1] + position[0] * this.delta_x[1] + position[1] * this.delta_y[1] ];
};

HexGrid.prototype.is_inside = function(position)
{
	if (position[0] < 0 || position[1] < 0
	  || position[0] >= (this.edge_size * 2) - 1
	  || position[1] >= (this.edge_size * 2) - 1)
	{
		return false;
	}
	
	if (position[0] - position[1] > this.edge_size - 1 || position[1] - position[0] > this.edge_size - 1)
	{
		return false;
	}
	
	return true;
};



/********
 * TEST *
 ********/
 $(function()
 {
 
	function getPosition(e) {

		//this section is from http://www.quirksmode.org/js/events_properties.html
		var targ;
		if (!e)
			e = window.event;
		if (e.target)
			targ = e.target;
		else if (e.srcElement)
			targ = e.srcElement;
		if (targ.nodeType == 3) // defeat Safari bug
			targ = targ.parentNode;

		// jQuery normalizes the pageX and pageY
		// pageX,Y are the mouse positions relative to the document
		// offset() returns the position of the element relative to the document
		var x = e.pageX - $(targ).offset().left;
		var y = e.pageY - $(targ).offset().top;

		return [x, y];
	};
 
	gl = new IfyGL({
		canvas: 'game',
		texturepath: 'static/img/',
		shaderpath: 'static/shaders/',
		width: 640,
		height: 480
	});
	
	gl.init();
	
	var sprite_loader = [{filename: 'tile.png', frame_width: 32, frame_height: 32, origin: [16,16]},
						 {filename: 'tilemark.png', frame_width: 32, frame_height: 32, origin: [16,16]}];
						 

	gl.load_sprites(sprite_loader, function(sprites)
	{
		tile = sprites[0];
		mark = sprites[1];
		grid = new HexGrid([16, 16], 8, 3, [16, 16], 'horizontal');
		
		select = [[0,0],[0,0]];
		
		$('#game').click(function(event)
		{
			var position = getPosition(event);
			//border:
			position[0]--;
			position[1]--;
			
			point = grid.get_tile_position(position);
			select = [point.low, point.high];
		});
		
		setInterval(function()
		{
			for (var i = 0; i < 6; i++)
			{
				for (var j = 0; j < 6; j++)
				{
					var c = grid.get_pixel_coordinate([i,j]);
					if (grid.is_inside([i, j]))
						gl.draw_sprite(tile, 0, c[0], c[1]);
				}
			}
			var c = grid.get_pixel_coordinate(select[0]);
			gl.draw_sprite(mark, 0, c[0], c[1]);
			c = grid.get_pixel_coordinate(select[1]);
			gl.draw_sprite(mark, 0, c[0], c[1]);
			
			
		}, 17)
	});
});