/**
 * Creates an IfyGL instance
 *
 * @constructor
 * @this {IfyGL}
 * @param {object} params A dictionary of property defaults to override.
 * @property {string} shaderpath URL prefix to the shader files
 * @property {string} texturepath URL prefix to the texture files
 * @property {string} canvas ID of the desired canvas (default "canvas")
 * @property {number} width Desired width of the canvas (default 640)
 * @property {number} height Desired height of the canvas (default 480)
 */
IfyGL = function(params)
{
	// Default parameters:
	this.shaderpath = '';		// Url path
	this.texturepath = '';		// Url path
	this.canvas = 'ifygl';		// ID
	this.width = 800;			// Standard Resolution
	this.height = 600;			// Standard Resolution
	this.debug = false;
	
	// Extract parameters if given
	if (typeof params === 'object')
		for (var attr in params)
			if (this.hasOwnProperty(attr))
				if (typeof this[attr] === typeof params[attr])
					this[attr] = params[attr];
					
	// Attributes
	/** @private */ this.gl = null;				// WebGL context
	/** @private */ this.program = null;		// WebGL shader program
	/** @private */ this.resolution = null;		// Screen resolution as vector
	/** @private */ this.buffer_vertex = null;	// Vertex buffer
	/** @private */ this.buffer_texture = null; // Texture position buffer
	/** @private */ this.p_resolution = null;	// Pointer to GPU resolution
	/** @private */ this.p_position = null;		// Pointer to GPU draw destination
	/** @private */ this.p_texture = null;		// Pointer to GPU draw source
	
	this.p_source = null;
	this.p_target = null;
	this.p_stetch = null;
	this.source = [0,0];
	this.target = [0,0];
	this.stretch = [0,0];
};

/**
 * Initializes WebGL, buffers and program.
 * This is the first function that should be called after the constructor.
 * Changes to public properties on the instance has no effect after this call.
 */
IfyGL.prototype.init = function()
{
	// Set up WebGL context
	var element = document.getElementById(this.canvas);
	if (element === null || element.tagName !== 'CANVAS')
		throw 'Invalid canvas element';
	
	element.width = this.width;
	element.height = this.height;
	
	this.gl = element.getContext('experimental-webgl', { premultipliedAlpha: false });
	if (this.gl === null)
		throw alert("Could not initialize WebGL. Does your browser support it?");
		
	// Create the shader program
	this.create_program();
	
	// Misc GL settings
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.enable(this.gl.BLEND);
	this.gl.disable(this.gl.DEPTH_TEST);
	this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	
	// Create unit buffer for primitive draws
	this.buffer_unit = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer_unit);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, Sprite.make_rect(0, 0, 1, 1), this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	
	// Single texture setup
	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'u_sampler'), 0);
	
	// Frame Hack
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function( callback )
				{
					window.setTimeout(callback, 1000 / 60);
				};
	})();
};

/**
 * Loads and links the shader program
 * This is meant mainly for internal use.
 *
 * @private
 */
 IfyGL.prototype.create_program = function()
 {
	// Get shaders
	var vertex = this.load_shader('vshader.glsl', this.gl.VERTEX_SHADER);
	var fragment = this.load_shader('fshader.glsl', this.gl.FRAGMENT_SHADER);
	
	// Create, link and activate the shader program
	this.program = this.gl.createProgram();
	this.gl.attachShader(this.program, vertex);
	this.gl.attachShader(this.program, fragment);
	
	this.gl.linkProgram(this.program);
	if (this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS) !== true)
		throw "Unable to link shaders.";
		
	this.gl.useProgram(this.program);
	
	// Set up pointers to graphics memory, and lock in the resolution
	this.p_resolution = this.gl.getUniformLocation(this.program, 'u_resolution');
	this.resolution = [this.width, this.height];
	this.gl.uniform2f(this.p_resolution, this.resolution[0], this.resolution[1]);
	
	this.p_position = this.gl.getAttribLocation(this.program, 'a_position');
	this.gl.enableVertexAttribArray(this.p_position);
	
	this.p_texture = this.gl.getAttribLocation(this.program, 'a_texcoord');
	this.gl.enableVertexAttribArray(this.p_texture);
	
	this.p_source = this.gl.getUniformLocation(this.program, 'u_source');
	this.p_target = this.gl.getUniformLocation(this.program, 'u_target');
	this.p_stretch = this.gl.getUniformLocation(this.program, 'u_stretch');
 };

/**
 * Loads and compiles a shader file.
 * This is meant mainly for internal use.
 *
 * @private
 * @param {string} name The filename in which the shader is stored
 * @param {shaderType} type The type of the shader
 * @return {WebGLShader} The compiled shader
 */
IfyGL.prototype.load_shader = function(name, type)
{
	// Request the GLSL file
	var xhr = new XMLHttpRequest();
	xhr.open('get', this.shaderpath + name, false);
	xhr.send(null);
	
	if (xhr.status != 200)
		throw 'Could not load shader file "' + name + '"';
		
	var source = xhr.responseText;
	
	// Create and compile the shader
	var shader = this.gl.createShader(type);
	this.gl.shaderSource(shader, source);
	this.gl.compileShader(shader);
	if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
	{
		this.gl.deleteShader(shader);
		throw 'Could not compile shader "' + name + '":' + this.gl.getShaderInfoLog(shader);
	}
	return shader;
};

/**
 * Make a rectangle as a WebGL triangle-list
 * This is meant mainly for internal use.
 *
 * @private
 * @param {number} left The x-coordinate of left side of the rectangle
 * @param {number} top The y-coordinate of top of the rectangle
 * @param {number} right The x-coordinate of right side of the rectangle
 * @param {number} bottom The y-coordinate of bottom of the rectangle
 * @return {Float32Array} The WebGL triangle-list
 * @deprecated
 */
 IfyGL.prototype.make_rect = function(left, top, right, bottom)
 {
 	return new Float32Array([
	left, top,
	right, top,
	left, bottom,
	left, bottom,
	right, top,
	right, bottom]);
 };
 
 /**
  * Loads sprites for the game
  *
  * @param {array} sprites An array of objects describing filenames to load. Each object should contain the keys:
  * <ul><li>filename (string)</li><li>frame_height (number)</li><li>frame_width (number)</li></ul>
  * @param {function} callback A function that will get called after the sprites are loaded.
  *   This function will get an array of the finished sprites as parameter.
  * @see Sprite
  */
 IfyGL.prototype.load_sprites = function(sprites, callback, len, res)
 {
	// Set up recursive parameters
	if (typeof len !== "number")
		len = 0;
		
	if (typeof res !== "object")
		res = [];
	
	// If all sprites are loaded
	if (len >= sprites.length)
		callback(res);
	else
	{
		// Set up WebGL texture and image container
		var texture = this.gl.createTexture();
		var img = new Image();
		var gl = this.gl;
		var instance = this;
		
		// Image-loaded callback
		img.onload = function()
		{
			// Since 'this' does not work in a callback, create a lambda
			// expression taking the IfyGL instance as parameter i.
			//TODO:
			// At some point this should probably be made as a function
			// on the IfyGL prototype, so the function is not created each call.
			(function(i)
			{
				// WebGL texture processing.
				i.gl.bindTexture(i.gl.TEXTURE_2D, texture);
				i.gl.texImage2D(i.gl.TEXTURE_2D, 0, i.gl.RGBA, i.gl.RGBA, i.gl.UNSIGNED_BYTE, img);
				i.gl.texParameteri(i.gl.TEXTURE_2D, i.gl.TEXTURE_MAG_FILTER, i.gl.LINEAR);
				i.gl.texParameteri(i.gl.TEXTURE_2D, i.gl.TEXTURE_MIN_FILTER, i.gl.LINEAR_MIPMAP_NEAREST);
				i.gl.generateMipmap(i.gl.TEXTURE_2D);
				i.gl.bindTexture(i.gl.TEXTURE_2D, null);
				
				// Add the sprite to the result array
				res.push(new Sprite(gl, texture, img, sprites[len]['frame_width'], sprites[len]['frame_height'], sprites[len]['origin']));
				
				// Recursive call
				i.load_sprites(sprites, callback, len + 1, res);
			})(instance);
		};
		
		// With the callback set up, start actually loading the image
		img.src = this.texturepath + sprites[len]['filename'];
	}
 };
 
 IfyGL.prototype.bind_uniforms = function()
 {
	this.gl.uniform2f(this.p_source, this.source[0], this.source[1]);
	this.gl.uniform2f(this.p_target, this.target[0], this.target[1]);
	this.gl.uniform2f(this.p_stretch, this.stretch[0], this.stretch[1]);
 }
 
/**
 * Draws a sprite to the canvas
 *
 * @param {Sprite} sprite The sprite to draw
 * @param {number} frame The the frame to draw
 * @param {number} x The x-coordinate of the leftmost pixels of the destination
 * @param {number} y The y-coordinate of the top pixels of the destination
 * @see Sprite
 */ 
 IfyGL.prototype.draw_sprite = function(sprite, frame, x, y)
 {
	// Rounding coordinates
	x = Math.round(x);
	y = Math.round(y);

	this.source = sprite.get_frame(frame);
	this.target = [x, y];
	this.stretch = [1, 1]; // No stretch.
	this.bind_uniforms();
 
	// Set up the position vertex buffer, and pass it to the vertex shader
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sprite.target);
	this.gl.vertexAttribPointer(this.p_position, 2, this.gl.FLOAT, false, 0, 0);
	
	// Ditto for the texture coordinate buffer
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sprite.source);
	this.gl.vertexAttribPointer(this.p_texture, 2, this.gl.FLOAT, false, 0, 0);
	
	// Activate the texture
	this.gl.bindTexture(this.gl.TEXTURE_2D, sprite.texture);
	
	// Draw the sprite
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
 }; 

/**
 * Draws a sprite to the canvas, stretched to fill a rectangle
 *
 * @param {Sprite} sprite The sprite to draw
 * @param {number} frame The the frame to draw
 * @param {number} left The x-coordinate of the leftmost pixels of the destination
 * @param {number} top The y-coordinate of the top pixels of the destination
 * @param {number} right The x-coordinate of the rightmost pixels of the destination
 * @param {number} bottom The y-coordinate of the bottom pixels of the destination
 * @see Sprite
 */ 
 IfyGL.prototype.draw_sprite_stretched = function(sprite, frame, left, top, right, bottom)
 {
	// Rounding coordinates
	left = Math.round(left);
	top = Math.round(top);
	right = Math.round(right);
	bottom = Math.round(bottom);
 
	this.source = sprite.get_frame(frame);
	this.target = [left, top];
	this.stretch = [right - left, bottom - top]; // Use stretch to create the position
	this.bind_uniforms();
 
	// Set up the unit buffer for positions
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer_unit);
	this.gl.vertexAttribPointer(this.p_position, 2, this.gl.FLOAT, false, 0, 0);
	
	// Texture coordinate buffer
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sprite.source);
	this.gl.vertexAttribPointer(this.p_texture, 2, this.gl.FLOAT, false, 0, 0);
	
	// Activate the texture
	this.gl.bindTexture(this.gl.TEXTURE_2D, sprite.texture);
	
	// Draw the sprite
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
 }; 
 
 /**
 * Draws a line of text to the canvas
 *
 * @param {string} text The string to draw
 * @param {string} color The CSS3 color of the text 	
 * @param {number} size Thefont size to use
 * @param {number} x The x-coordinate of the leftmost pixels of the destination
 * @param {number} y The y-coordinate of the top pixels of the destination
 * @see Sprite
 */ 
 IfyGL.prototype.draw_text = function(text, color, size, align, x, y)
 {
 	// Rounding coordinates
	x = Math.round(x);
	y = Math.round(y);
	
	// Create text
	var data = helpers.create_text(this.gl, text, color, size, align);
	// TODO: Cache this.
	
	var xoffset = 0;
	if (align === 'center'){
		xoffset = -data.width / 2;
	}
	else if (align === 'right'){
		xoffset = -data.width;
	}
	
	this.source = [0,0];
	this.target = [x + xoffset, y];
	this.stretch = [data.width, data.height];
	this.bind_uniforms();
 
	// Set up the unit buffer for positions
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer_unit);
	this.gl.vertexAttribPointer(this.p_position, 2, this.gl.FLOAT, false, 0, 0);

	// Unit buffer for texture as well. Eureka.
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer_unit);
	this.gl.vertexAttribPointer(this.p_texture, 2, this.gl.FLOAT, false, 0, 0);
	
	this.gl.bindTexture(this.gl.TEXTURE_2D, data.texture);
	
	// Draw the text
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6); 
 };
