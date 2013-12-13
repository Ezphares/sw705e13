Drag = function()
{
};

Drag.prototype.draw = function(gl)
{
	var paddingX = 50;
	var paddingY = 50;
	var spacing = 70;
	gl.draw_text("Nothing", 'black', 15, 0, 26, 10);
	gl.draw_text("Move", 'black', 15, 0, 102, 10);
	gl.draw_text("Split", 'black', 15, 0, 175, 10);
	gl.draw_text("Look", 'black', 15, 0, 245, 10);
	gl.draw_text("If", 'black', 15, 0, 326, 10);
	gl.draw_text("Loop", 'black', 15, 0, 385, 10);

	gl.draw_sprite(Editor.set['nop'], 0, paddingX, paddingY);
	gl.draw_sprite(Editor.set['move'], 0, paddingX = paddingX + spacing, paddingY);
	gl.draw_sprite(Editor.set['split'], 0, paddingX = paddingX + spacing, paddingY);
	gl.draw_sprite(Editor.set['look'], 0, paddingX = paddingX + spacing, paddingY);
	gl.draw_sprite(Editor.set['if'], 0, paddingX = paddingX + spacing, paddingY);
	gl.draw_sprite(Editor.set['loop'], 0, paddingX = paddingX + spacing, paddingY);
	
	if (canvas_x > 50 - 21 && canvas_x < 50 + 21 && canvas_y > paddingY - 22 && canvas_y < paddingY + 22) {
		gl.draw_sprite(Editor.set['nop'], 0, mouseX, mouseY);
		drag_sprite = Instruction.nop();
	}
	else if (canvas_x > 120 - 21 && canvas_x < 120 + 21 && canvas_y > paddingY - 22 && canvas_y < paddingY + 22) {
		gl.draw_sprite(Editor.set['move'], 0, mouseX, mouseY);
		drag_sprite = Instruction.move();
	}
	else if (canvas_x > 190 - 21 && canvas_x < 190 + 21 && canvas_y > paddingY - 22 && canvas_y < paddingY + 22) {
		gl.draw_sprite(Editor.set['split'], 0, mouseX, mouseY);
		drag_sprite = Instruction.split();
	}
	else if (canvas_x > 260 - 21 && canvas_x < 260 + 21 && canvas_y > paddingY - 22 && canvas_y < paddingY + 22) {
		gl.draw_sprite(Editor.set['look'], 0, mouseX, mouseY);
		drag_sprite = Instruction.look();
	}
	else if (canvas_x > 330 - 21 && canvas_x < 330 + 21 && canvas_y > paddingY - 22 && canvas_y < paddingY + 22) {
		gl.draw_sprite(Editor.set['if'], 0, mouseX, mouseY);
		drag_sprite = Instruction.if();
	}
	else if (canvas_x > 400 - 21 && canvas_x < 400 + 21 && canvas_y > paddingY - 22 && canvas_y < paddingY + 22) {
		gl.draw_sprite(Editor.set['loop'], 0, mouseX, mouseY);
		drag_sprite = Instruction.loop();
	}
};