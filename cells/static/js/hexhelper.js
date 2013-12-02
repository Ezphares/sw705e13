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
