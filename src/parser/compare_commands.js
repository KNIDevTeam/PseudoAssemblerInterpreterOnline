function Command_Compare_Memory(register_left, shift, base_register)
{
	Command.call(this);
	Command_Memory.call(this, register_left, shift, base_register);
	this.execute = function(state)
	{
		state.sign_flag = Math.sign(state.registers[this.register_left] - state.memory[this.address]);
		console.log("sign: ", state.sign_flag);
		return state;
	};
}

function Command_Compare_Register(register_left, register_right)
{
	Command.call(this);
	Command_Register.call(this, register_left, register_right);
	this.execute = function(state)
	{
		state.sign_flag = Math.sign(state.registers[this.register_left] - state.registers[this.register_right]);
		console.log("sign: ", state.sign_flag);
		return state;
	};
}