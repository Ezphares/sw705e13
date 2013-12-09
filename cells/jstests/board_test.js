(function() {
	var health_count_value;
	var board;
	var food;
	var friend;
	var enemy;
	
	module('Board', {
		setup: function() {
			health_count_value = 21;
			board = new Board(10, 0);
			food = new Food(100, [0, 0]);
			friend = new Cell([0, 0], 175, 0, new Program(3), 1);
			enemy = new Cell([0, 0], 175, 0, new Program(3), 2);;
		}
	});

	test('health_count', function() {
			equal(Board.prototype.health_count(100, 80), health_count_value, 'Health Count should be 21');
		});
		
	test('add_entity and remove_entity', function() {
			expect(2);
			
			board.add_entity(food);
			ok(board.entities.length == 1, 'Add Entity: Non-empty entity list succeeds.');
			
			board.remove_entity(food);
			ok(board.entities.length == 0, 'Remove Entity: Empty entity list succeeds.');
			console.log(board.entities);
		});
		
	test('isDone', function() {
		expect(1);
		console.log(board);
		
		board.add_entity(friend);
		
		ok(board.isDone(), 'isDone: Succeeds when there is only one cell on the board');
	});
	
})();