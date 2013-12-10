Instruction = {};

Instruction.nop = function()
{
	return {
		'type': 'nop',
		
		'continue': 'R'
	};
};

Instruction.move = function()
{
	return {
		'type': 'move',
		'target':
		{
			'source': 'explicit',
			'value': 'R'
		},
		
		'continue': 'R'
	};
};

Instruction.split = function()
{
	return {
		'type': 'split',
		'target':
		{
			'source': 'explicit',
			'value': 'R'
		},
		
		'continue': 'R'
	};
};

Instruction.look = function()
{
	return {
		'type': 'split',
		'target':
		{
			'source': 'explicit',
			'value': 'R'
		},
		
		'save':
		{
			'entity': 'ENT1',
			'energy': 'NUM1'
		},
		
		'continue': 'R'
	};
};

Instruction.if = function()
{
	return {
		'type': 'if',

		'expr_type': 'NUM',
		'first':
		{
			'source': 'explicit',
			'value': 50
		},
		'second':
		{
			'source': 'derived',
			'value': 'DV_OWNHEALTH'
		},
		'operator': '=',
		
		'continue': 'R',
		'divert': 'DL'
	};
};

Instruction.loop = function()
{
	return {
		'type': 'loop',

		'expr_type': 'DIR',
		'variable': 'DIR1',
		'start':
		{
			'source': 'explicit',
			'value': 'R'
		},
		'end':
		{
			'source': 'explicit',
			'value': 'DL'
		},
		'increment': 'DV_COUNTERCLOCKWISE',
		
		'continue': 'R',
		'divert': 'DL'
	};
};
