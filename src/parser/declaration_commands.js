function Command_Allocate_No_Value(size, rand, value)
{
	Command.call(this);
	this.size = size;
	this.execute = function(state)
	{
		state.memory_labels[state.lbls[state.line]] = state.memory.length;
		state.source = null;
		state.result = this.value;
		state.tar = null;
		for(let i = 0; i < this.size; i++)
		{
			if(i > 0) state.memory_labels[state.lbls[state.line] + "[" + i + "]"] = state.memory.length + i;
			state.value_defined_memory.push(0);
			state.memory.push(0);
		}
		return state;
	};
}

function Command_Allocate_Value(size, rand, value)
{
	Command.call(this);
	this.size = size;
	this.rand = rand;
	this.value = value;
	this.execute = function(state)
	{
		state.memory_labels[state.lbls[state.line]] = state.memory.length;
		state.source = null;
		state.result = this.value;
		state.tar = null;
		for(let i = 0; i < this.size; i++)
		{
			if(i > 0) state.memory_labels[state.lbls[state.line] + "[" + i + "]"] = state.memory.length + i;
			state.value_defined_memory.push(2);
			if(true === this.rand) state.memory.push(Math.floor(Math.random() * 101));
			else state.memory.push(this.value);
		}
		return state;
	};
}