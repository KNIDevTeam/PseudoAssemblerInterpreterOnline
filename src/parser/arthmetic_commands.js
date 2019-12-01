function Command_Arthmetic()
{
	Command.call(this);
	this.execute = function(state)
	{
		if(this.type === "memory") state.registers[this.register_left] = this.make_calculation(state.registers[this.register_left], state.memory[this.address]);
		if(this.type === "register") state.registers[this.register_left] = this.make_calculation(state.registers[this.register_left], state.registers[this.register_right]);
		state.sign_flag = Math.sign(state.registers[this.register_left]);
		state.value_defined_registers[this.register_left] = true;
		return state;
	};
}
function Command_Arthmetic_Memory(register_left, shift, base_register)
{
	Command_Arthmetic.call(this);
	Command_Memory.call(this, register_left, shift, base_register);
	this.type = "memory";
}

function Command_Arthmetic_Registers(register_left, register_right)
{
	Command_Arthmetic.call(this);
	Command_Register.call(this, register_left, register_right);
	this.type = "register";
}


function Command_Add_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right);
	this.make_calculation = function(a, b)
	{
		return a + b;
	}
}

function Command_Subtract_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right);
	this.make_calculation = function(a, b)
	{
		return a - b;
	}
}

function Command_Multiply_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right);
	this.make_calculation = function(a, b)
	{
		return a * b;
	}
}

function Command_Divide_Registers(register_left, register_right)
{
	Command_Arthmetic_Registers.call(this, register_left, register_right);
	this.make_calculation = function(a, b)
	{
		return a / b;
	}
}

function Command_Add_Memory(register_left, shift, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register);
	this.make_calculation = function(a, b)
	{
		return a + b;
	}
}

function Command_Subtract_Memory(register_left, shift, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register);
	this.make_calculation = function(a, b)
	{
		return a - b;
	}
}

function Command_Multiply_Memory(register_left, shift, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register);
	this.make_calculation = function(a, b)
	{
		return a * b;
	}
}

function Command_Divide_Memory(register_left, shift, base_register)
{
	Command_Arthmetic_Memory.call(this, register_left, shift, base_register);
	this.make_calculation = function(a, b)
	{
		return a / b;
	}
}