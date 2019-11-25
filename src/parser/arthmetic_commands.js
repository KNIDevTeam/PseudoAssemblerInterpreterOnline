function Command_Add_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right)
	this.make_calculation = function(a, b)
	{
		return a + b;
	}
}

function Command_Subtract_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right)
	this.make_calculation = function(a, b)
	{
		return a - b;
	}
}

function Command_Multiply_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right)
	this.make_calculation = function(a, b)
	{
		return a * b;
	}
}

function Command_Divide_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right)
	this.make_calculation = function(a, b)
	{
		return a / b;
	}
}

function Command_Add_Memory(register_left, base_register, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register)
	this.make_calculation = function(a, b)
	{
		return a + b;
	}
}

function Command_Subtract_Memory(register_left, base_register, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register)
	this.make_calculation = function(a, b)
	{
		return a - b;
	}
}

function Command_Multiply_Memory(register_left, base_register, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register)
	this.make_calculation = function(a, b)
	{
		return a * b;
	}
}

function Command_Divide_Memory(register_left, base_register, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register)
	this.make_calculation = function(a, b)
	{
		return a / b;
	}
}