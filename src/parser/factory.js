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
        args = this.clear_args(args);
        if(/^\d/.exec(args[0])) throw "Label can't start with number";
        if(/,/.exec(args[0])) throw "Label can't contain commas";
        if(/\./.exec(args[0])) throw "Label can't contain periods";
		return (args[0] === this.name ? "" : args[0]);
    };
    this.clear_args = function (args) {
        let res = [];
        for(let i = 0; i < args.length; i++)
            if(args[i] !== "") res.push(args[i]);
        return res;
    };



}

function Factory_Registers(name, command_constructor) {
    Factory.call(this, name, command_constructor);


    this.check_coherency = function (args) {
        if (!/^\d*$/.exec(args[1])) throw "left register must be positive int";
        if (!/^\d*$/.exec(args[2])) throw "right register must be positive int";
        if (!(args.length === 3)) throw "wrong number of arguments";

    };

    this.generate_args = function (args) {
        args = this.clear_args(args);
        this.check_coherency(args);
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
        if (!/^\d*$/.exec(args[1])) throw "register number must be positive int";
        if (!/^-*\d*$/.exec(args[2]) && !/^\D/.exec(args[2])) throw "Label can't start with number";
        if (args.length === 4 && !/^\d*$/.exec(args[3])) throw "register number must be positive int";
        if (args.length !== 4 && args.length !== 3) throw "wrong number of args";
    };
    this.generate_args = function (args) {
        args = this.clear_args(args);
        this.check_coherency(args);
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
        if (/^\d/.exec(args[1])) throw "label can't start with number";
    };

    this.generate_args = function (args) {
        //this.check_coherency(args);
        args = this.clear_args(args);
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
        args = this.clear_args(args);
        this.check_coherency(args);
        if (types.includes(args[1])) {
            this.size = 1;
            if (args.length === 3) {
                this.rand = false;
                this.value = parseInt(args[2]);
            } else {
                this.rand = true;
                this.value = 0;
            }
        } else {
            this.size = parseInt(args[1]);
            if (args.length === 4) {
                this.rand = false;
                this.value = parseInt(args[3]);
            } else {
                this.rand = true;
                this.value = 0;
            }
        }
    };

    this.check_coherency = function (args) {
        if(args.length < 2 || ((types.includes(args[1]) && (args.length !== 2 && args.length !== 3))))
            throw "wrong number of arguments: " + args.length;
        if(types.includes(args[2]) && (args.length !== 3 && args.length !== 4)) throw "wrong number of arguments: " + args.length;
        if(!types.includes(args[1]) && !types.includes(args[2])) throw "No such type of variable";
        if(types.includes(args[2]) && !/^\d*$/.exec(args[1])) throw "size of array must be positive integer";
        if((types.includes(args[1]) && !/^-*\d*$/.exec(args[2])  && args.length === 3) ||
            (types.includes(args[2]) && !/^-*\d*$/.exec(args[3]) && args.length === 4))
            throw "value must be an integer";

    };
}