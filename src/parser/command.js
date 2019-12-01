function Command()
{
	this.execute = function(state)
	{
		throw "FunctionNotImplemented";
	};
	this.translate_address = function(state)
	{

	};
}

function Command_Memory(register_left, shift, base_register)
{
	this.register_left = parseInt(register_left);
	this.shift = shift;
	this.base_register = parseInt(base_register);
	this.translate_address = function(state)
	{
		let base = 0;
		if(this.base_register === -1) base += state.registers[14];
		if(state.registers[this.base_register] !== undefined) base += state.registers[this.base_register];
		let pattern = /^[0-9]*$/;
		if(pattern.test(this.shift))
		{
			base += parseInt(this.shift);
		}
		else if(state.memory_labels[this.shift] !== undefined)
		{
			base += state.memory_labels[this.shift];
		}
		else
		{
			throw "No such Label";
		}
		this.address = base;
	};
}

function Command_Register(register_left, register_right)
{
	this.register_left = parseInt(register_left);
	this.register_right = parseInt(register_right);
}

