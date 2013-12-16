(function() {
	/* VARIABLE DECLARATION */

	/* MODULE DEFINITION - SETUP CALLED BEFORE EACH TEST */
	module('Instruction', {
		setup: function() {
			
		}
	});
	
	test('Nop', function() {
		ok(Instruction.nop().type == 'nop', 'Succeeds when Instruction returns nop');
	});
	
	test('Move', function() {
		ok(Instruction.move().type == 'move', 'Succeeds when Instruction returns move');
	});
	
	test('Split', function() {
		ok(Instruction.split().type == 'split', 'Succeeds when Instruction returns split');
	});
	
	test('Look', function() {
		ok(Instruction.look().type == 'look', 'Succeeds when Instruction returns look');
	});
	
	test('If', function() {
		ok(Instruction.if().type == 'if', 'Succeeds when Instruction returns if');
	});
	
	test('Loop', function() {
		ok(Instruction.loop().type == 'loop', 'Succeeds when Instruction returns loop');
	});
	
})();