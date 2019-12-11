var cur_state = 1;
var states;
var program;
var pure_text;
var mobileBrowser = mobileCheck();

//update tables
function show(direction) {
    //animate
    if(!animating && !mobileBrowser) {
        let logo_y = getPos(document.getElementById("logo-id")).y;
        let button_y = getPos(document.getElementById("prev-next")).y;
        if(direction == "next") [logo_y, button_y] = [button_y, logo_y];
        spawnCharacters("run1", {x: 0, y: logo_y, w: canvas.width*0.01}, '#00f4a4');
        spawnCharacters("run2", {x: canvas.width / pixel_ratio, y: button_y, w: 0}, '#00f4a4');
        animating = 1, requestAnimationFrame(draw);
    }
    let cur_program = JSON.parse(JSON.stringify(program));

    cur_program[states[cur_state - 1].line] = `<div id="cur-line" style="display: inline" class="highlight">&rarr; ${cur_program[states[cur_state - 1].line]}
    </div><div id="expansion" style="display: block; float: right;">${expandCommand(states[cur_state])}</div>`;
	$('#program').html(`
        <div class="row" id="program-title-row" style="padding-bottom: 1em">
            <div class="col-md-1 col-3" style="padding-right: 0"><a href="/" id="go-back" style="">&larr;</a></div>
            <div class="col-md-11 col-9" style="padding-left: 0"><h11 style="line-height: 0.7">${lang.run.program}</h11></div>
        </div>
    ${cur_program.join('<br>')}`);
    $('#results').html(formatData(states[cur_state]));
    
    $('#expansion').addClass('animated bounceIn');
    $('#changed').addClass('animated shake');
    $('#changed-state').addClass('animated shake');
    $('#cur-line').addClass('animated flash');
	
	checkVisibility();
	refreshTooltip();
	$('.head').each(function() {
		setTab($(this).attr('class').split(' ')[1]);
	});
}

$('#prev').on('click', function() {
    cur_state--;
    cur_state = Math.min(states.length-1, Math.max(1, cur_state));
    while(cur_state > 1 && (!states[cur_state - 1].visible || pure_text[states[cur_state - 1].line][0] == '#') ) cur_state--;
    show();
});

$('#next').on('click', function() {
    cur_state++;
    cur_state = Math.min(states.length-1, Math.max(1, cur_state));
    while(cur_state < states.length && (!states[cur_state - 1].visible || pure_text[states[cur_state - 1].line][0] == '#')) cur_state++;
    show("next");
});

//initialise
$('#run-button').on('click', function() {
    //format just in case
    $('#input').html(formatInput($('#input').html()));

    //check for errors

    //purge html, sanitise input
    pure_text = $('#input').html().replace(/<br>/g, '\n').replace(/<[^>]*>|⭾/g, '').replace(/^ +/gm, '').replace(/^\n/gm, '').split('\n').filter(function(element) {
        return (element != null && element != "");
    });

    //get breakpoints
    let breakpoints = [];
    $('.active-breakpoint').each(function() {
        breakpoints.push(Number(this.id.replace('line-number-', '')));
    });

    try {
        states = emulate(pure_text, breakpoints);
    } catch(err) {
        if(!err[0].message) err = [{message: err[0], line: -1}];

        //add error messages
        err.forEach(function(err, ind) {
            let temp = $('#input').html().split('<br>');
            if(err.line == -1) temp.splice(0, 0, ''), err.line = 0;
            
            temp[err.line] = `<div id="error-${ind}" style="float: left">${temp[err.line]}&nbsp; <span class="error">${lang.run.errors[err.message]}${err.arg ? `: ${err.arg}` : ''}</span></div>`;
            temp = temp.join('<br>');
            $('#input').html(temp);

            //animate
            spawnCharacters("error", getPos(document.getElementById(`error-${ind}`)), '#ff446c');
            if(!animating) animating = 1, requestAnimationFrame(draw);

            $(`#error-${ind}`).addClass('animated shake');
            let node = document.querySelector(`#error-${ind}`);
            node.addEventListener('animationend', function() {
                $(`#error-${ind}`).removeClass('animated shake');
                node.removeEventListener('animationend', this);
                if (typeof callback === 'function') callback()
            });
        });

		refreshTooltip();
        return;
    }

    //filter states by breakpoints
    if(breakpoints.length) {
        states.forEach(function(state, ind) {
            if(breakpoints.includes(state.line)) states[ind].visible = 1;
        });
		states[states.length - 1].visible = 1;
    } else {
        states.forEach(function(state, ind) {
            states[ind].visible = 1;
        });
    }

    //make breakpoints not clickable
    $('.line-number').each(function() {
        this.onclick = null;
    });

    //skip to end if fastforwarded
    if(document.getElementById('fast-forward').checked) cur_state = states.length - 1;

    //skip comments
    while(pure_text[states[cur_state - 1].line][0] == '#' && cur_state < states.length) cur_state++;
    
    program = $('#input').html().split('<br>');

    //change visibility of elements
    $('#errors').css('display', 'none');
    $('#run').css('display', 'none');
    $('#input').css('display', 'none');
    $('#prev-next').css('display', 'block');
    $('#program').css('display', 'block');
    $('#prev').css('opacity', '0');
    $('#prev').css('visibility', 'hidden');

    //show results
    show();
    let rect = document.getElementById('program-title-row').getBoundingClientRect();
    $('#line-number-container').css('top', `${rect.height}px`);

    $('#results').addClass('animated fadeIn');
    $('#program').addClass('animated fadeIn');
});

$('.copy').click(function() {
	let key = $(this).attr('data-example');
	const el = document.createElement('textarea');
	el.value = lang['examples']['programs'][key]['code'];
	document.body.appendChild(el);
	el.select();

	try {
		copied = document.execCommand('copy');
	} catch (ex) {
		copied = false;  
	}

	if(copied) {
		$(this).html('<i class="fa fa-check"></i>');   
	}
	
	document.body.removeChild(el);
});

function expandCommand(state) {
    let res = "";
    let source = state.command_source;
    let target = state.command_target;
    let result = state.command_result;
    
    //get labels
    let command = pure_text[states[cur_state - 1].line].split(/ |,/).filter(function(element) {
        return (element != null && element != "");
    });
    if(command[1].match(/DS|DC/)) source = command[0];
    if(!command[0].match(new RegExp(`^(${keywords})$`))) command.splice(0, 1);
    let t_label = command[1], s_label = command[2];
    if(t_label.match(/^[0-9]+$/)) t_label = `REG [ ${t_label} ]`;
    if(command[0].match(/R/) && s_label.match(/^[0-9]+$/)) s_label = `REG [ ${s_label} ]`;

    //insert formatting
    t_label = `<span class="keyword">${t_label}</span>`;
    s_label = `<span class="keyword">${s_label}</span>`;
    let s_value = source;
    source = `<span class="highlight">${source}</span>`
    let t_value = target;
    target = `<span class="highlight">${target}</span>`
    result = `<span class="highlight">${result}</span>`

    let jump_condition = `STATUS = <span class="highlight">${states[cur_state - 1].status}</span>`, make_jump = (states[cur_state].line == t_value);
    switch(state.command) {
        case 'Command_Allocate_Value':
        case 'Command_Allocate_No_Value':
            res = `<span class="keyword">${source.replace(html_regexp, '')}</span> := ${result}`;
            break;
        case 'Command_Add_Memory':
        case 'Command_Add_Registers':
            res = `${t_label} &larr; ${result}<br>${result} = ${target} + ${source}<br>[ ${t_label} + ${s_label} ]`;
            break;
        case 'Command_Subtract_Memory':
        case 'Command_Subtract_Registers':
            res = `${t_label} &larr; ${result}<br>${result} = ${target} - ${source}<br>[ ${t_label} - ${s_label} ]`;
            break;
        case 'Command_Multiply_Registers':
        case 'Command_Multiply_Memory':
            res = `${t_label} &larr; ${result}<br>${result} = ${target} * ${source}<br>[ ${t_label} * ${s_label} ]`;
            break;
        case 'Command_Divide_Memory':
        case 'Command_Divide_Registers':
            res = `${t_label} &larr; ${result}<br>${result} = ${target} / ${source}<br>[ ${t_label} / ${s_label} ]`;
            break;
        case 'Command_Store':
            target = state.variables[target];
            res = `${s_label} &larr; ${result}<br>[ ${t_label} ]`;
            break;
        case 'Command_Load_Register':
            res = `${t_label} &larr; ${result}<br>[ ${s_label} ]`;
            break;
        case 'Command_Load':
            let s_label2 = states[cur_state - 1].variables[source.replace(html_regexp, '') / 4];
            s_label2 = `<span class="keyword">${s_label2}</span>`;
            res = `${t_label} &larr; ${result}<br>[ ${s_label} = ${source} = ${s_label2} ]`;
            break;
        case 'Command_Load_Address':
            res = `${t_label} &larr; ${result}<br>[ ${s_label} ]`;
            break;
        case 'Command_Jump_Positive':
            if(!make_jump) jump_condition = jump_condition + ' ≤ 0', make_jump = -1;
        case 'Command_Jump_Zero':
            if(!make_jump) jump_condition = jump_condition + ' ≠ 0', make_jump = -1;
        case 'Command_Jump_Negative':
            if(!make_jump) jump_condition = jump_condition + ' ≥ 0', make_jump = -1;
        case 'Command_Jump_Always':
            source = `<span class="highlight">${s_value+1}</span>`;
            target = `<span class="highlight">${t_value+1}</span>`;
            res = `${jump_condition}<br>${make_jump == 1 ? `${source} &rarr; ${target}<br>[ ${t_label} ]` : ''}`;
            break;
        case 'Command_Compare_Memory':
        case 'Command_Compare_Register':
            res = `STATUS &larr; ${result}<br>${result} = ${target} - ${source}<br>[ ${t_label} - ${s_label} ]`;
            break;
    }
    return res;
}

//state generation
function emulate(text, breakpoints) {
    let temp_states = [];
    let res = main_parse(text);

    if(res[1].length === 0) {
        let output = main_execute(res[0], res[2]);
        //throw errors if found
        if(output[1]) throw [{ message: output[1][0], arg: output[1][1], line: output[2] }];

        let states_parser = output[0];
        for(let i = 0; i < states_parser.length; i++) {
            temp_states.push(translate(states_parser[i]));
        }
    } else {
        res[1].forEach(function(el, ind) {
            res[1][ind] = {message: el[0][0], line: el[1]};
        });
        throw res[1];
    }
    return temp_states;
}

function translate(state) {
    let res = {};
    res.registry = state.registers;
    res.status = state.sign_flag;
    res.memory = state.memory;
    res.line = state.line;
    res.reg_init = state.value_defined_registers;
    res.mem_init = state.value_defined_memory;
    res.variables = Object.keys(state.memory_labels);
    res.command = state.command;
    res.command_result = state.result;
    res.command_target = state.tar;
    res.command_source = state.source;
    res.state_changed = state.state_changed;
    return res;
}

function formatData(data) {
    var registry_html = `<div style="padding-bottom: 1em"><h11>` + lang.run.registers.header + `</h11></div>
    <div class="table-wrapper">
        <table class="default">
            <thead>
                <tr>
                    <th>` + lang.run.registers.address + `</th>
                    <th>` + lang.run.registers.value + `</th>
                </tr>
            </thead>
            <tfoot>
            ${data.registry.reduce(function(accumulator, val, ind) {
                if(!data.reg_init[ind]) return accumulator;
                return accumulator +
                `<tr${data.reg_init[ind] == 2 ? ' id="changed"' : ''}>
                    <td><span class="highlight">${ind}</span></td>
                    <td><b>${data.reg_init[ind] == 2 ? `<span class="highlight">${val}</span>` : `${val}`}</b></td>
                </tr>`
            }, '') + 
            `<tr${data.state_changed ? ' id="changed-state"' : ''}>
                <td>` + lang.run.registers.state + `</td>
                <td><span class="keyword">${data.status}</span></td>
            </tr>`}
            </tfoot>
        </table>
    </div>`;
	
	let in_tab = false;
	let tab_name = false;
	let tab_index = 0;
	
    var memory_html = `<div style="padding-bottom: 1em"><h11>` + lang.run.memory.header + `</h11></div>
    <div class="table-wrapper">
        <table class="default">
            <thead>
                <tr>
                    <th>` + lang.run.memory.address + `</th>
                    <th>` + lang.run.memory.var + `</th>
                    <th>` + lang.run.memory.value + `</th>
                </tr>
            </thead>
            <tfoot>
            ${data.memory.reduce(function(accumulator, val, ind) {
                //if(!data.mem_init[ind]) return accumulator;
				if (in_tab) 
					tab_index++;
				
				if (in_tab && data.variables[ind] != tab_name + '[' + tab_index + ']') {
					in_tab = false;
					tab_index = 0;
				} 
				
				if (!in_tab && ind != data.memory.length-1 && data.variables[ind] + '[1]' == data.variables[ind+1]) {
					in_tab = true;
					tab_name = data.variables[ind];
				} else if (!in_tab) {
					tab_index = 0;
				}
				
                return accumulator +
                `<tr${data.mem_init[ind] == 2 ? ' id="changed"' : ''} ${in_tab ? (tab_index > 0 ? ` class="item-${tab_name}" style="display: none"` : ` class="head ${tab_name}"  onclick=toggleTab("${tab_name}")`) : ''}>
                    <td><span class="highlight">${ind*4}</span></td>
                    <td><span class="keyword">${data.variables[ind]}</span></td>
                    <td><b class="value">${!data.mem_init[ind] ? `---` : (data.mem_init[ind] == 2 ? `<span class="highlight">${val}</span>` : `${val}`)}</b></td>
                </tr>`
            }, '')}
            </tfoot>
        </table>
    </div>`;

    return `<div class="row">
    <div class="col-md-4" id="registers">${registry_html}</div>
    <div class="col-md-8" id="memory">${memory_html}</div>
    </div>`;
}

function setTab(tab_name) {
	let elements = $(`.item-${tab_name}`).length;
	let changed = false;
	
	$(`.${tab_name} .keyword`).html(`${tab_name} [0 - ${elements}]`);
	$(`.${tab_name} .value`).hide();
	
	$(`.item-${tab_name}`).each(function(index) {
		if ($(this).is('#changed'))
			changed = true;
	});
	
	if (changed)
		$('.' + tab_name).addClass('animated shake');
};

function toggleTab(tab_name) {
	let elements = $(`.item-${tab_name}`).length;
	
	$(`.item-${tab_name}`).each(function(index) {
		if ($(this).is(':visible')) {
			$(this).fadeOut('fast');
			$(`.${tab_name} .keyword`).html(`${tab_name} [0 - ${elements}]`);
			$(`.${tab_name} .value`).hide();
		} else {
			$(this).fadeIn('fast');
			$(`.${tab_name} .keyword`).html(tab_name);
			$(`.${tab_name} .value`).show();
		}
	});
};

function checkVisibility() {
	if (cur_state == 1) {
		$('#prev').css('opacity', '0');
		$('#next').css('opacity', '1');
		$('#prev').css('visibility', 'hidden');
		$('#next').css('visibility', 'visible');
	} else if (cur_state == states.length-1) {
		$('#prev').css('opacity', '1');
		$('#next').css('opacity', '0');
		$('#prev').css('visibility', 'visible');
		$('#next').css('visibility', 'hidden');
	} else {
		$('#prev').css('opacity', '1');
		$('#next').css('opacity', '1');
		$('#prev').css('visibility', 'visible');
		$('#next').css('visibility', 'visible');
	}
}

//from detectmobilebrowsers.com
function mobileCheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};