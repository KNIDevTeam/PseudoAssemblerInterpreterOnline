function Command_Add_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a + b;
	}
}

function Command_Subtract_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a - b;
	}
}

function Command_Multiply_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a * b;
	}
}

function Command_Divide_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a / b;
	}
}

function Command_Add_Memory(register_left, register_right, base_register)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a + b;
	}
}

function Command_Subtract_Memory(register_left, register_right, base_register)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a - b;
	}
}

function Command_Multiply_Memory(register_left, register_right, base_register)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a * b;
	}
}

function Command_Divide_Memory(register_left, register_right, base_register)
{
	Command_Arthmetic_Registers.call(this)
	function make_calculation(a, b)
	{
		return a / b;
	}
}