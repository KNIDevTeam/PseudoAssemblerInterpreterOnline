function Command()
{
	this.execute = function(state)
	{
		throw "FunctionNotImplemented";
	}
	this.translate_address = function(labels_map_memory, labels_map_program, registers)
	{

	}
}

function Command_Arthmetic()
{
	Command.call(this)
	this.make_calculation = function(a, b)
	{
		throw "FunctionNotImplemented";
	}
	this.execute = function(state)
	{
		if(type = "memory") state.registers[this.register_left] = this.make_calculation(state.registers[this.register_left], state.memory[this.address]);
		if(type = "register") state.registers[this.register_left] = this.make_calculation(state.registers[this.register_left], state.registers[this.register_right]);
		state.sign = Math.sign(state.registers[this.register_left]);
		return state;
	}
}



function Command_Arthmetic_Memory(register_left, shift, base_register)
{
	Command_Arthmetic.call(this);
	Command_Memory.call(this, register_left, shift, base_register)
	this.type = "memory";
}

function Command_Memory(register_left, shift, base_register)
{
	this.register_left = register_left;
	this.shift = shift;
	this.base_register = base_register;
	this.translate_address = function(labels_map_memory, labels_map_program, registers)
	{
		var base = 0;
		if(this.base_register == -1) base += registers[14];
		if(registers[base_register] !== undefined) base += registers[base_register];
		var pattern = /[0-9]*/;
		if(pattern.test(shift)) this.address = parseInt(shift);
		else if(registers[shift] !== undefined) this.address = parseInt(shift);
		else throw "WrongShiftException";
	}
}

function Command_Arthmetic_Registers(register_left, register_right)
{
	Command_Arthmetic.call(this);
	Command_Register.call(this, register_left, register_right);
	this.type = "register";
}

function Command_Register(register_left, register_right)
{
	this.register_left = register_left;
	this.register_right = register_right;
}

