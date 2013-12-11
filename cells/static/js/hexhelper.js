Hex = {};

Hex.move = function(point, direction)
{
	result = [point[0], point[1]]; // Make a copy, so we run without side effects

	if (direction === 'L')
	{
		result[0]--;
	}
	else if (direction === 'R')
	{
		result[0]++;
	}
	else if (direction === 'UL')
	{
		result[0]--;
		result[1]--;
	}
	else if (direction === 'UR')
	{
		result[1]--;
	}
	else if (direction === 'DL')
	{
		result[1]++;
	}
	else if (direction === 'DR')
	{
		result[0]++;
		result[1]++;
	}

	return result;
};

Hex.rotate = function(direction, increment)
{
	if (direction === 'L')
	{
		if (increment === 'CC')
			return 'DL';
		else
			return 'UL';
	}
	else if (direction === 'R')
	{
		if (increment === 'CC')
			return 'UR';
		else
			return 'DR';
	}
	else if (direction === 'UL')
	{
		if (increment === 'CC')
			return 'L';
		else
			return 'UR';
	}
	else if (direction === 'UR')
	{
		if (increment === 'CC')
			return 'UL';
		else
			return 'R';
	}
	else if (direction === 'DL')
	{
		if (increment === 'CC')
			return 'DR';
		else
			return 'L';
	}
	else if (direction === 'DR')
	{
		if (increment === 'CC')
			return 'R';
		else
			return 'DL';
	}
};
