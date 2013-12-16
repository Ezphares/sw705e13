(function() {
	var cell1;
	var cell2;
	var board;
	var getval;
	
	module('Cell', {
		setup: function() {
		cell1 = new Cell([0, 0], 175, 0, 0, 1);
		cell2 = new Cell([0, 0], 100, 0, 0, 2);
		board = new Board(10, 0);
		}
	});
	
	test('get_value', function() {
		expect(3);
		
		ok(cell1.get_value({
			'source': 'explicit',
			'value': 'R'
		}) == 'R', 'Succeeds when get_value returns R');
		
		ok(cell1.get_value({
			'source': 'variable',
			'value': 'DIR1'
		}) == 'R', 'Succeeds when DIR1 is R');
		
		ok(cell1.get_value({
			'source': 'derived',
			'value': 'DV_OWNHEALTH'
		}) == '175', 'Succeeds when get_value returns 175');
	});
	
	test('battle', function() {
		expect(2);
		
		board.add_entity(cell1);
		board.add_entity(cell2);
		cell1.battle(board);
		
		ok(board.entities.length == 1, 'succeeds when 1 cells are on the board');
		ok(cell1.energy == 275, 'Succeeds when cell1 has eaten all of cell2\'s energy');
	});
})();