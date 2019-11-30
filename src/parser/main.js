function main_parse(lines)
{
	function State()
	{
		this.registers = [];
		for(let i = 0; i < 16; i++) this.registers[i] = 0;
		this.memory = [];
		this.state = 0;
		this.line = 0;
		this.memory_labels = Object();
		this.lbls = Object();
	}
	let program = [];
	let factories = [];
	let stat = new State();
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
	factories.push(new Factory_Registers("DR", Command_Load_Register));
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
			let res = factories[0].build(lines[i]);
			program.push(res[0]);
			if(res[1] !== "")
			{
				stat.lbls[res[1]] = i - skipped;
				stat.lbls[i-skipped] = res[1];
			}
		}
	}
	console.log(program);
	let states = [];
	states.push(JSON.parse(JSON.stringify(stat)));
	for(stat.line = 0; stat.line < program.length; stat.line++)
	{
		program[stat.line].translate_address(stat);
		stat = program[stat.line].execute(stat);
		states.push(JSON.parse(JSON.stringify(stat)));
	}
	return states;
}
