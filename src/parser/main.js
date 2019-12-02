var timeout_threshold = 1000;

function main_parse(lines)
{
	function State()
	{
		this.registers = [];
		for(let i = 0; i < 16; i++) this.registers[i] = 0;
		this.memory = [];
		this.sign_flag = 0;
		this.line = 0;
		this.memory_labels = Object();
		this.lbls = Object();
		this.line_execution_count = {};
		this.value_defined_registers = [];
		for(let i = 0; i < 16; i++) this.value_defined_registers[i] = 0;
		this.value_defined_registers[14] = 1;
		this.value_defined_memory = [];
	}
	let program = [];
	let factories = [];
	let stat = new State();
	let errors = [];
	factories.push(new Factory_Allocation("DC", Command_Allocate_Value));
	factories.push(new Factory_Allocation("DS", Command_Allocate_No_Value));
	factories.push(new Factory_Registers("AR", Command_Add_Registers));
	factories.push(new Factory_Registers("SR", Command_Subtract_Registers));
	factories.push(new Factory_Registers("MR", Command_Multiply_Registers));
	factories.push(new Factory_Registers("DR", Command_Divide_Registers));
	factories.push(new Factory_Memory("A", Command_Add_Memory));
	factories.push(new Factory_Memory("S", Command_Subtract_Memory));
	factories.push(new Factory_Memory("M", Command_Multiply_Memory));
	factories.push(new Factory_Memory("D", Command_Divide_Memory));
	factories.push(new Factory_Memory("ST", Command_Store));
	factories.push(new Factory_Memory("L", Command_Load));
	factories.push(new Factory_Memory("LA", Command_Load_Address));
	factories.push(new Factory_Registers("LR", Command_Load_Register));
	factories.push(new Factory_Jump("JP", Command_Jump_Positive));
	factories.push(new Factory_Jump("J", Command_Jump_Always));
	factories.push(new Factory_Jump("JZ", Command_Jump_Zero));
	factories.push(new Factory_Jump("JN", Command_Jump_Negative));
	factories.push(new Factory_Registers("CR", Command_Compare_Register));
	factories.push(new Factory_Memory("C", Command_Compare_Memory));
	factories.push(new End_Factory());
	for(let i = factories.length - 2; i >= 0; i--)
	{
		factories[i].set_next(factories[i+1]);
	}
	let skipped = 0;
	for(let i = 0; i < lines.length; i++)
	{
		if(lines[i] === "")
		{
			skipped++;
			continue;
		}
		else
		{
			let res = [];
			try
			{
				res = factories[0].build(lines[i]);
			}
			catch (error) {
				errors.push([error, i - skipped]);
			}
			program.push(res[0]);
			if(res[1] !== "")
			{
				stat.lbls[res[1]] = i - skipped;
				stat.lbls[i-skipped] = res[1];
			}
		}
	}
	return [program, errors, stat];
}

function main_execute(program, initial_state) {
	let states = [];
	let stat = initial_state;
	for(stat.line = 0; stat.line < program.length; stat.line++)
	{
		if(stat.line_execution_count[stat.line] === undefined) stat.line_execution_count[stat.line] = 0;
		else stat.line_execution_count[stat.line]++;
		if(stat.line_execution_count[stat.line] > timeout_threshold) throw "Infinite Loop Error";
		states.push(JSON.parse(JSON.stringify(stat)));
		for(let i = 0; i < stat.value_defined_registers.length; i++)
			if(stat.value_defined_registers[i] === 2) stat.value_defined_registers[i] = 1;
		for(let i = 0; i < stat.value_defined_memory.length; i++)
			if(stat.value_defined_memory[i] === 2) stat.value_defined_memory[i] = 1;
		try
		{
			program[stat.line].translate_address(stat);
		}
		catch (error) {
			return [states, error, stat.line];
		}
		stat = program[stat.line].execute(stat);
	}
	stat.line = stat.line-1;
	states.push(JSON.parse(JSON.stringify(stat)));
	console.log(states);
	return [states, null, null];
}
