function Factory(name, command_constructor) {
    this.name = name;
    this.comm = command_constructor;

    this.set_next = function (next_factory) {
        this.next = next_factory;
    };

    this.build = function (line) {
        let args = line.split(/ +|,|\(|\)|\t+|\*/);
        if (this.is_it_me(args))
        {
            let lbl = this.get_label(args);
            this.generate_args(args.slice(lbl === "" ? 0 : 1));
            return [this.fabricate(), lbl];
        }
        else return this.next.build(line);
    };
    this.is_it_me = function (args) {
        return (args[0] === this.name || args[1] === this.name);
    };
    this.get_label = function (args) {
		return (args[0] === this.name ? "" : args[0]);
    };
}

function Factory_Registers(name, command_constructor) {
    Factory.call(this, name, command_constructor);


    this.check_coherency = function (args) {
        if (!/^\d*$/.exec(args[1])) throw "left register must be an int";
        if (!/^\d*$/.exec(args[2])) throw "right registe must be an int";
        if (!(args.length === 3)) throw "wrong number of arguments";

    };

    this.generate_args = function (args) {
        //this.check_coherency(args);
        this.register_left = args[1];
        this.register_right = args[2];
    };
    this.fabricate = function () {
        return new this.comm(this.register_left, this.register_right);
    };
}

function Factory_Memory(name, command_constructor) {
    Factory.call(this, name, command_constructor);
    this.fabricate = function () {
        return new this.comm(this.register_left, this.shift, this.base_register);
    };
    this.check_coherency = function (args) {
        if (!/^\d*$/.exec(args[1])) throw "register number must be an int";
        if (!/^\d*$/.exec(args[2]) && !/^\D/.exec(args[2])) throw "Label can't start with number";
        if (args.length === 5 && !/^\d*$/.exec(args[3])) throw "register number must be an int";
        if (args.length !== 4 && args.length !== 5) throw "wrong number of args";
    };
    this.generate_args = function (args) {
        //todo show different error codes forr different errors
        //this.check_coherency(args);
        this.register_left = args[1];
        this.shift = args[2];
        if (args.length === 4) this.base_register = args[3];
        else this.base_register = -1;
    };
}

function End_Factory() {
    this.build = function(line) {
        throw "no such command";
    };
}

function Factory_Jump(name, command_constructor) {
    Factory.call(this, name, command_constructor);
    this.fabricate = function () {
        return new this.comm(this.target);
    };

    this.check_coherency = function (args) {
        if (args.length !== 2) throw "to many args";
    };

    this.generate_args = function (args) {
        //this.check_coherency(args);
        this.target = args[1];
    };
}

function Factory_Allocation(name, command_constructor) {
    Factory.call(this, name, command_constructor);
    let types = ["INTEGER"];
    this.fabricate = function () {
        return new this.comm(this.size, this.rand, this.value)
    };

    this.generate_args = function (args) {
        if (types.includes(args[1])) {
            this.size = 1;
            if (args.length === 4) {
                this.rand = false;
                this.value = parseInt(args[2]);
            } else {
                this.rand = true;
                this.value = 0;
            }
        } else {
            this.size = parseInt(args[1]);
            if (args.length === 5) {
                this.rand = false;
                this.value = parseInt(args[3]);
            } else {
                this.rand = true;
                this.value = 0;
            }
        }
    };

    this.check_coherency = function (args) {
        //todo make check coherency for Declarrations
    };
}