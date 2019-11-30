function Command_Allocate_No_Value(size, rand, value)
{
	Command.call(this);
	this.size = size;
	this.execute = function(state)
	{
		state.memory_labels[state.lbls[state.line]] = state.memory.length;
		for(let i = 0; i < this.size; i++)
		{
			state.memory.push(0);
			console.log(state.memory);
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
		for(let i = 0; i < this.size; i++)
		{
			if(true === this.rand) state.memory.push(Math.floor(Math.random() * 101));
			else state.memory.push(this.value);
			console.log(state.memory, this.value, this.rand);
		}
		return state;
	};
}