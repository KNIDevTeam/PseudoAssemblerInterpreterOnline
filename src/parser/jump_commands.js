function Command_Jump(target)
{
	Commad.call(this);
	this.target = target;
	function execute(state)
	{
		if(this.condition(state.sign)) state.line = this.address;
		return state;
	}

	function translate_address(labels_map_memory, labels_map_program, registers)
	{
		if(labels_map_program[this.target] !== undefined) this.address = labels_map_program[this.target];
		else throw "WrongLablelException";
	}
}