function Command_Store(register_left, shift, base_register)
{
	Command_Memory.call(register_left, shift, base_register);

	function execute(state)
	{
		state.memory[this.address] = state.registers[this.register_left];
		return state;
	}
}

function Command_load(register_left, shift, base_register)
{
	Command_Memory.call(register_left, shift, base_register);

	function execute(state)
	{
		state.registers[register_left] = state.memory[this.address];
		return state;
	}
}

function Command_Load_Register(register_left, register_right)
{
	Command_Register.call(register_left, register_right);

	function execute(state)
	{
		state.registers[this.register_left] = state.registers[this.register_right];
		return state;
	}
}

function Command_Load_Address(register_left, shift, base_register)
{
	Command_Memory.call(register_left, shift, base_register);

	function execute(state)
	{
		state.registers[this.register_left] = this.address;
		return state;
	}
}