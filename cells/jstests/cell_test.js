(function() {
	var cell1;
	var cell2;
	var getval;
	
	module('Cell', {
		setup: function() {
		cell1 = new Cell([0, 0], 175, 0, 0, 1);
		cell2 = new Cell([0, 0], 100, 0, 0, 2);
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
	
	

})();