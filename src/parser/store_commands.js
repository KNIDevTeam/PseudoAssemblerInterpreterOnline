function Command_Store(register_left, shift, base_register)
{
	Command.call(this);
	Command_Memory.call(this, register_left, shift, base_register);
	this.execute = function(state)
	{
		state.value_defined_memory[this.address] = true;
		state.memory[this.address] = state.registers[this.register_left];
		return state;
	}
}

function Command_Load(register_left, shift, base_register)
{
	Command.call(this);
	Command_Memory.call(this, register_left, shift, base_register);
	this.execute = function(state)
	{
		state.registers[register_left] = state.memory[this.address];
		state.value_defined_registers[this.register_left] = true;
		return state;
	}
}

function Command_Load_Register(register_left, register_right)
{
	Command.call(this);
	Command_Register.call(this, register_left, register_right);
	this.execute = function(state)
	{
		state.registers[this.register_left] = state.registers[this.register_right];
		state.value_defined_registers[this.register_left] = true;
		return state;
	}
}

function Command_Load_Address(register_left, shift, base_register)
{
	Command.call(this);
	Command_Memory.call(this, register_left, shift, base_register);
	this.execute = function(state)
	{
		state.registers[this.register_left] = this.address;
		state.value_defined_registers[this.register_left] = true;
		return state;
	}
}