function Command()
{
	this.execute = function(state)
	{
		throw "FunctionNotImplemented";
	};
	this.translate_address = function(state)
	{

	};
	this.set_changes = function(state)
	{
		state.tar = state.registers[this.register_left];
	}
}

function Command_Memory(register_left, shift, base_register)
{
	this.register_left = parseInt(register_left);
	this.shift = shift;
	this.base_register = parseInt(base_register);
	this.translate_address = function(state)
	{
		let base = 0;
		if(this.base_register === -1) base += state.registers[14] / 4;
		if(state.registers[this.base_register] !== undefined) base += state.registers[this.base_register] / 4;
		let pattern = /^-*[0-9]*$/;
		if(pattern.test(this.shift)) base += parseInt(this.shift) / 4;
		else if(state.memory_labels[this.shift] !== undefined) base += state.memory_labels[this.shift];
		else throw `Missing label: '${this.shift}'`;
		if(base >= state.memory.length) throw `Invalid address: '${base * 4}'`;
		this.address = base;
		console.log(this.address, state.line)
	};
	this.set_changes = function(state)
	{
		Command.prototype.set_changes.call(this, state);
		state.source = state.memory[this.address];
	};

}

function Command_Register(register_left, register_right)
{
	this.register_left = parseInt(register_left);
	this.register_right = parseInt(register_right);
	this.set_changes = function(state)
	{
		Command.prototype.set_changes.call(this, state);
		state.source = state.registers[this.register_right];
	};
}

function Command_Comment()
{
	Command.call(this);
	this.execute  = function(state)
	{
		return state;
	};
	this.set_changes = function (state) {
		state.tar = null;
		state.result = null;
		state.source = null;
	}
}