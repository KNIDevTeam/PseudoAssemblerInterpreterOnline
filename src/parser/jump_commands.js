function Command_Jump(target)
{
	Commad.call(this);
	this.target = target;
	this.execute = function(state)
	{
		if(this.condition(state.sign)) state.line = this.address;
		return state;
	}
	this.translate_address = function(labels_map_memory, labels_map_program, registers)
	{
		if(labels_map_program[this.target] !== undefined) this.address = labels_map_program[this.target];
		else throw "WrongLablelException";
	}
}

function Command_Jump_Positive(target)
{
	Command_Jump.call(this, target)
	this.condition = function(sign)
	{
		return sign == 1;
	}
}

function Command_Jump_Positive(target)
{
	Command_Jump.call(this, target)
	this.condition = function(sign)
	{
		return sign == 0;
	}
}

function Command_Jump_Negative(target)
{
	Command_Jump.call(this, target)
	this.condition = function(sign)
	{
		return sign == -1;
	}
}

function Command_Jump_Zero(target)
{
	Command_Jump.call(this, target)
	this.condition = function(sign)
	{
		return true;
	}
}