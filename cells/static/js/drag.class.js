Drag = function(pos, sprite, edit, size, instruction) {
	this.coordinate = pos; // Dobbelt array
	this.sprite = sprite;
	this.editor = edit;
	this.size = size;
	this.instruction = instruction;
	
	this.tempx = pos;
	this.tempy = pos;
	this.amIMoving = false;
	this.offsetx = 0;
	this.offsety = 0;
};

Drag.prototype.draw(gl) {
	gl.draw_sprite(this.sprite, 0, this.coordinate[x] - this.offsetx, this.coordinate[y] - this.offsety);
};


Drag.prototype.mousedown(coord) {
	if (coord[0] >= this.coordinate[0] && coord[0] <= this.coordinate[0] + this.size[0] &&
		coord[1] >= this.coordinate[1] && coord[1] <= this.coordinate[1] + this.size[1]) {
			this.offsetx = coord[0] - this.coordinate[0];
			this.offsety = coord[1] - this.coordinate[1];
			
			
			Drag.prototype.move(coord);
		}
};

Drag.prototype.move(coord) {
	this.offsetx = coord[0] - this.coordinate[0];
	this.offsety = coord[1] - this.coordinate[1];
	
	//Beregn x, y ud i forhold til offset
	this.tempx = coord[0];
	this.tempy = coord[1];
};

Drag.prototype.release(x, y) {
	this.coordinate[0] = x;
	this.coordinate[1] = y;
	
	this.editor.drop(coordinate, instruction);
};