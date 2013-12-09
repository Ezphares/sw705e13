/**
 * Object representing a sprite. Should be constructed using the IfyGL load_sprites function
 *
 * @constructor
 * @param {WebGLTexture} texture A processed WebGL texture
 * @param {Image} img The source image for texture
 * @param {number} frame_width The width of each individual frame
 * @param {number} frame_height The height of each individual frame
 * @param {array} origin The x and y offsets of the sprite's origin
 * @see IfyGL
 */
Sprite = function(gl, texture, img, frame_width, frame_height, origin)
{
	// Properties
	this.texture = texture;
	this.frame_width = frame_width;
	this.frame_height = frame_height;
	this.img = img;
	this.origin = origin || [0,0];
	
	// Derived properties
	this.frames_per_row = Math.floor(this.img.width / this.frame_width);
	this.frames = Math.floor(this.img.height / this.frame_height) * this.frames_per_row;
	
	// Buffers
	var fzero = this.get_frame(0);
	
	this.source = gl.createBuffer();	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.source);
	gl.bufferData(gl.ARRAY_BUFFER, this.make_rect(fzero[0], fzero[1], fzero[2], fzero[3]), gl.STATIC_DRAW);
	
	this.target = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.target);
	gl.bufferData(gl.ARRAY_BUFFER, this.make_rect(0 - origin[0], 0 - origin[1], frame_width - origin[0], frame_height - origin[1]), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	// Sanity check
	if (this.frames < 1)
		throw 'Attempt to create a sprite without frames. Possibly frame width/height was set to a larger value than the image size';
};

Sprite.prototype.make_rect = function(left, top, right, bottom)
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
 * Gets the WebGL coordinates for a frame
 *
 * @param {number} frame The frame number to calculate
 * @return {array} The GL coordinates of the frame, in the order [left, top, right, bottom]
 */
Sprite.prototype.get_frame = function(frame)
{
	if (typeof frame !== 'number')
		frame = 0;
	
	// Make sure the frame exists
	frame = frame % this.frames;
	
	// Calculate the texture pixel coordinates
	var frame_left = (frame % this.frames_per_row) * this.frame_width;
	var frame_top = Math.floor(frame / this.frames_per_row) * this.frame_height;
	var frame_right = frame_left + this.frame_width;
	var frame_bottom = frame_top + this.frame_height;
	
	// Convert to WebGL texture coordinates
	return [frame_left / this.img.width,
			frame_top / this.img.height,
			frame_right / this.img.width,
			frame_bottom / this.img.height]
};