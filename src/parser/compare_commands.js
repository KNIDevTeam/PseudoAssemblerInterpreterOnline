function Command_Compare_Memory(register_left, shift, base_register)
{
	Command.call(this);
	Command_Memory.call(this, register_left, shift, base_register)
	this.execute = function(state)
	{
		state.sign = Math.sign(registers[this.register_left] - memory[this.address]);
		return state;
	}
}

function Command_Compare_Register(register_left, shift, base_register)
{
	Command.call(this);
	Command_Memory.call(this, register_left, register_right)
	this.execute = function(state)
	{
		state.sign = Math.sign(state.registers[this.register_left] - state.registers[this.register_right]);
		return state;
	}
}