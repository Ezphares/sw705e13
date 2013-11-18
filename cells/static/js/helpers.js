helpers = {};

helpers.po2 = function(value, po2)
{
	var po2 = po2 || 1;
	while (po2 < value)
		po2 *= 2;
		
	return po2;
};

helpers.canvas_texture = function(gl, texture, canvas)
{
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
};

helpers.create_text = function(gl, text, color, size, align)
{
	var canvas = document.getElementById('text-render');
	var context = canvas.getContext('2d');
	
	// Measure text
	context.font = size + "px sans-serif";
	var width = helpers.po2(context.measureText(text).width);
	var height = helpers.po2(2 * size);
	canvas.width = width;
	canvas.height = height;
		
	// Draw text
	context.font = size + "px sans-serif";
	context.fillStyle = color;
	context.textAlign = align;
	context.textBaseline = 'top';

	var x = 0;
	if (align === 'center')
		x = width / 2;
	else if (align === 'right')
		x = width;
	context.fillText(text, x, 0);
	
	// Create Texture
	var texture = gl.createTexture();
	helpers.canvas_texture(gl, texture, canvas);
	return {'width': width, 'height': height, 'texture': texture};
};
