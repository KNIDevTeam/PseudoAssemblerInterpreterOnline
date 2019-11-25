function Factory(name, command_constructor) 
{
	this.name = name;
	this.comm = command_constructor;

	this.set_next = function(next_factory)
	{
		this.next = next_factory;
	}

	this.build = function(line)
	{
		args = line.split(/ +|,|\(|\)|\t+|\*/);
		if(this.is_it_me(args)) 
		{
			this.generate_args(args.slice(1));
			console.log("its me", this.name)
			return this.fabricate();
		}
		else this.next.build(line);
	}
	this.is_it_me = function(args)
	{
		return (args[0] == this.name || args[1] == this.name);
	}
}

function Factory_Registers(name, command_constructor)
{
	Factory.call(this, name, command_constructor);
	this.fabricate = function()
	{
		return new this.command_constructor(this.register_left, this.register_right);
	}

	this.check_coherency = function(args)
	{
		if(!/^\d*$/.execute(args[1]) || !/^\d*$/.execute(args[2]) || !(args.length == 3)) return false;
		return true;
	}

	this.generate_args = function(args)
	{
		if(!check_coherency(args)) throw "wrong command syntax";
		this.register_left = command[1];
		this.register_right = command[2];
	}
}

function Factory_Memory(name, command_constructor)
{
	Factory.call(this, name, command_constructor);
	this.fabricate = function()
	{
		return new this.command_constructor(this.register_left, this.shift, this.base_register);
	}
	this.check_coherency = function(args)
	{
		if(!/^\d*$/.execute(args[1])) return false;
		if(!/^\d*$/.execute(args[2]) && !/^\D/.execute(args[2])) return false;
		if(args.length == 4 && !/^\d*$/.execute(args[3])) return false;
		if(args.length != 3 && args.length != 4) return false;
	}
	this.generate_args = function(args)
	{
		//todo show different error codes forr different errors
		if(!check_coherency(args)) throw "wrong command syntax";
		this.left_register = args[1];
		this.shift = args[2];
		if(args.length == 4) this.base_register = args[3];
		else this.base_register = 14;
	}
}

function End_Factory() {
	this.build = function(line)
	{
		throw "wrong command syntax";
	}
}

function Factory_Jump(name, command_constructor)
{
	Factory.call(this, name, command_constructor);
	this.fabricate = function()
	{
		return new this.command_constructor(this.target);
	}

	this.check_coherency = function(args)
	{
		if(args.length != 2) return false;
		return true;
	}

	this.generate_args = function(args)
	{
		if(!check_coherency(args)) throw "wrong command syntax";
		this.target = args[1];
	}
}