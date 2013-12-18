/**
 * Constructor for Menu class
 */
Menu = function(active, inactive, tile, back, home, start, newButton, startHere)
{
	this.spr_tile = tile; // Tile sprite
	this.spr_back = back; // Sprite for back button
	this.spr_home = home; // Sprite for home button
	this.spr_start = start; // Sprite for start/ok button
	this.spr_new = newButton; // Sprite for clear button
	this.spr_active_button = active; // Default sprite for menu button, if the button should be active
	this.spr_inactive_button = inactive; // Same sprite, but grayed out because of inactive button
	this.spr_startHere = startHere; // Sprite that symbolize where the program should start
	this.state = 'Start'; // State of the menu. Used to navigate around different screens.
};

/**
 * Updates the state of the menu depending on button presses
 */
Menu.prototype.update = function(x, y, gl)
{
	var center_x = gl.width/2;
	var center_y = gl.height/2;
	
	var offset_x = ((this.spr_active_button.frame_width)/2);
	var offset_y = (this.spr_active_button.frame_height/2);
	
	if(x <= center_x+offset_x && x >= center_x-offset_x)
	{
		//First button is pressed
		if(y >= center_y-offset_y-105 && y <= center_y+offset_y-105)
		{
			if(this.state == 'Start'){
				this.state = 'Singleplayer';
			}
			else if(this.state === 'Singleplayer'){
				//this.state = 'Challenges';
				alert("Go to challenges");
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 1");
			}
			else if(this.state === 'Skirmish'){
				this.state = 'InEditor';
			}
		}
		//Second button is pressed
		else if(y >= center_y-offset_y-35 && y <= center_y+offset_y-35)
		{
			if(this.state == 'Start'){
				alert("Multiplayer is not yet implemented");
			}
			else if(this.state === 'Singleplayer'){
				this.state = 'Skirmish';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 2");
			}
			else if(this.state === 'Skirmish'){
				alert("Go to import screen");
			}
		}
		//Third button is pressed
		else if(y >= center_y-offset_y+35 && y <= center_y+offset_y+35)
		{
			if(this.state == 'Start'){
				location.href='/static/pdf/cells-manual.pdf';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 3");
			}
		}
		//Fourth button is pressed
		else if(y >= center_y-offset_y+105 && y <= center_y+offset_y+105)
		{
			if(this.state == 'Start'){
				this.state = 'InEditor';
			}
			else if(this.state === 'Challenges'){
				alert("Go to challenge 4");
			}
		}
	}
	else if(x >= 0 && x <= (this.spr_back.frame_width) && y <= gl.height && y >= gl.height-(this.spr_back.frame_height))
	{
		if(this.state == 'Singleplayer' || this.state == 'Multiplayer' || this.state == 'InEditor'){
			this.state = 'Start';
		}
		else if(this.state === 'Challenges' || this.state === 'Skirmish'){
			this.state = 'Singleplayer';
		}
		else if(this.state === 'InGame')
		{
			this.state = 'InEditor';
		}
	}
	else if(x >= 40 && x <= 40+(this.spr_home.frame_width) && y <= gl.height && y >= gl.height-(this.spr_home.frame_height))
	{
		if(this.state != 'Start' && this.state != 'InGame'){
			this.state = 'Start';
		}
	}
	else if(x >= gl.width-(this.spr_start.frame_width) && x <= gl.width && y <= gl.height && y >= gl.height-(this.spr_start.frame_height))
	{
		if(this.state == 'InEditor'){
			this.state = 'InGame';
		}
	}
	else if(x >= 80 && x <= 80+(this.spr_new.frame_width) && y <= gl.height && y >= gl.height-(this.spr_new.frame_height))
	{
		if(this.state == 'InEditor'){
			this.state = 'Clean';
		}
	}
};

/**
 * Draw the correct menu depending on the state
 */
Menu.prototype.draw = function(gl)
{
	if(this.state === 'Start'){
		this.draw_startmenu(gl);
	}
	else if(this.state === 'Singleplayer') {
		this.draw_singleplayermenu(gl);
	}
	else if(this.state === 'Multiplayer'){
		alert("Multiplayer not yet implemented");
	}
	else if(this.state === 'Challenges') {
		this.draw_challengesmenu(gl);
	}
	else if(this.state === 'Skirmish'){
		this.draw_skirmishmenu(gl);
	}
	else if(this.state === 'InEditor'){
		this.draw_editor(gl);
	}
	else if(this.state === 'InGame'){
		this.draw_game(gl);
	}
};

/**
 * Helper function to draw a menu button
 */
Menu.prototype.draw_button = function(active, text, x, y, gl)
{
	//If the button should be active, then draw spr_active_button from the x, y, position
	if(active){
		gl.draw_sprite(this.spr_active_button, 0, gl.width/2, y);
	}
	//else draw the inactive sprite
	else{
		gl.draw_sprite(this.spr_inactive_button, 0, gl.width/2, y);
	}
	
	//Add text to button. Offset y-position to make the text fit the center of the button
	gl.draw_text(text, 'black', 25, 'center', gl.width/2, y-15);
};


/**
 * Draw blue hexagon grid background of menu
 */
Menu.prototype.draw_background = function(gl){
	var state = true; //Used to switch between each row to make hexagon tiles fit
	
	for(var i=-16; i <= gl.height; i+= 13)
	{
		for(var j=-16; j<=gl.width; j+=(this.spr_tile.frame_width)/2)
		{
			if(state){
				gl.draw_sprite(this.spr_tile, 0, j, i);
			}
			else{
				gl.draw_sprite(this.spr_tile, 0, j+8, i);
			}
		}
		state = !state; // Change row
	}
};

/**
 * Helper function to draw the elements on the start menu
 * Elements include: 4 menu buttons
 */
Menu.prototype.draw_startmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(true, 'Singleplayer', 0, gl.height/2-105, gl);
	this.draw_button(false, 'Multiplayer', 0, gl.height/2-35, gl);
	this.draw_button(true, 'Manual', 0, gl.height/2+35, gl);
	this.draw_button(true, 'Editor', 0, gl.height/2+105, gl);
};

/**
 * Helper function to draw the elements on the singleplayer menu
 * Elements include: 2 menu buttons + back + home
 */
Menu.prototype.draw_singleplayermenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(false, 'Challenges', 0, gl.height/2-105, gl);
	this.draw_button(true, 'Skirmish', 0, gl.height/2-35, gl);
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
};

/**
 * Helper function to draw the elements on the challenges menu
 * Elements include: 4 menu buttons + back + home
 */
Menu.prototype.draw_challengesmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(false, '1', 0, gl.height/2-105, gl);
	this.draw_button(false, '2', 0, gl.height/2-35, gl);
	this.draw_button(false, '3', 0, gl.height/2+35, gl);
	this.draw_button(false, '4', 0, gl.height/2+105, gl);
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
};

/**
 * Helper function to draw skirmish menu
 * Elements include: 2 menu buttons + back + home
 */
Menu.prototype.draw_skirmishmenu = function(gl)
{
	this.draw_background(gl);
	this.draw_button(true, 'New', 0, gl.height/2-105, gl);
	this.draw_button(false, 'Import', 0, gl.height/2-35, gl);
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
};

/**
 * Helper function to draw editor
 * Elements include: back + home + start/ok + clear/new + start indicator
 * Draw text for buttons: clear/new + start/ok + start
 */
Menu.prototype.draw_editor = function(gl)
{
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
	gl.draw_sprite(this.spr_home, 0, 40, gl.height-(this.spr_home.frame_height));
	gl.draw_sprite(this.spr_new, 0, 80, gl.height-(this.spr_new.frame_height));
	gl.draw_sprite(this.spr_startHere, 0, 60, 100);
	gl.draw_sprite(this.spr_start, 0, gl.width-(this.spr_start.frame_width), gl.height-(this.spr_start.frame_height));
	
	gl.draw_text("Clear", 'black', 20, 0, 88, gl.height-(this.spr_new.frame_height)+3);
	gl.draw_text("Start", 'white', 15, 0, 70, 107);
	gl.draw_text("OK", 'black', 15, 0, gl.width-(this.spr_start.frame_width)+5, gl.height-(this.spr_start.frame_height)+7);
};

/**
 * Helper function to draw back button on game
 */
Menu.prototype.draw_game = function(gl)
{
	gl.draw_sprite(this.spr_back, 0, 0, gl.height-(this.spr_back.frame_height));
};