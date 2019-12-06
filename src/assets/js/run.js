var cur_state = 1;
var states;
var program;
var pure_text, sans_html;
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

    cur_state = Math.min(states.length-1, Math.max(1, cur_state));
    let cur_program = JSON.parse(JSON.stringify(program));
    
    //handle comment spaghetti
    let hidden_lines = 0;
    for(let i = 0; i < sans_html.length; i++) {
        if(sans_html[i][0] == '#') hidden_lines++;
        else if(sans_html[i] == pure_text[states[cur_state - 1].line]) break;
    }

    cur_program[states[cur_state - 1].line + hidden_lines] = '<div id="cur-line" style="display: inline">&rarr; ' + cur_program[states[cur_state - 1].line + hidden_lines] + "</div>";
    $('#program').html(
        //handle strange mobile display
        `${mobileBrowser ? 
            `<a href="/" id="go-back" style="">&larr;</a><h11 style="line-height: 0.7">${lang.run.program}</h11>` :
            
            `<div class="row" style="padding-bottom: 1em">
            <div class="col-1 col-12-xsmall style="padding-right: 0" ><a href="/" id="go-back" style="">&larr;</a></div>
            <div class="col-11 col-12-xsmall" style="padding-left: 0"><h11 style="line-height: 0.7">${lang.run.program}</h11></div>
            </div>`
        }
    ${cur_program.join('<br>')}`);
    $('#results').html(formatData(states[cur_state]));
    
    $('#cur-line').addClass('animated flash');
	checkVisibility();
	refreshTooltip();
}

$('#prev').on('click', function() {
    cur_state--;
    show();
});

$('#next').on('click', function() {
    cur_state++;
    show("next");
});

//initialise
$('#run-button').on('click', function() {
    //format just in case
    $('#input').html(formatInput($('#input').html()));

    //check for errors
    pure_text = $('#input').html().replace(/<br>/g, '\n').replace(/<[^>]*>|⭾/g, '').replace(/^#.*$/gm, '').replace(/^ +/gm, '').replace(/^\n/gm, '').split('\n');
    sans_html = $('#input').html().replace(/<br>/g, '\n').replace(/<[^>]*>|⭾/g, '').replace(/^ +/gm, '').split('\n');

    try {
        states = emulate(pure_text);
    } catch(err) {
        if(typeof(err) === 'string') err = [{message: err, line: -1}];

        //add error messages
        err.forEach(function(err, ind) {
            let hidden_lines = 0;
            if(err.line != -1) {
                //handle comment spaghetti
                for(let i = 0; i < sans_html.length; i++) {
                    if(sans_html[i][0] == '#') hidden_lines++;
                    else if(sans_html[i] == pure_text[err.line]) break;
                }
            }

            let temp = $('#input').html().split('<br>');
            if(err.line == -1) temp.splice(0, 0, ''), err.line = 0;
            
            temp[err.line + hidden_lines] = `<div id="error-${ind}" style="float: left">${temp[err.line + hidden_lines]}&nbsp; <span class="error">${err.message}</span></div>`;
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

    //skip to end if fastforwarded
    if(document.getElementById('fast-forward').checked) cur_state = states.length - 1;
    
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
    $('#results').addClass('animated fadeIn');
    $('#program').addClass('animated fadeIn');
});

//state generation
function emulate(text) {
    let temp_states = [];
    let res = main_parse(text);

    if(res[1].length === 0) {
        let output = main_execute(res[0], res[2]);
        //throw errors if found
        if(output[1]) throw [{ message: output[1], line: output[2] }];

        let states_parser = output[0];
        for(let i = 0; i < states_parser.length; i++) {
            temp_states.push(translate(states_parser[i]));
        }
    } else {
        res[1].forEach(function(el, ind) {
            res[1][ind] = {message: el[0], line: el[1]};
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
                `<tr>
                    <td><span class="number">${ind}</span></td>
                    <td><b>${val}</b></td>
                </tr>`
            }, '') + 
            `<tr>
                <td>` + lang.run.registers.state + `</td>
                <td><span class="keyword">${data.status}</span></td>
            </tr>`}
            </tfoot>
        </table>
    </div>`;

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
                if(!data.mem_init[ind]) return accumulator;
                return accumulator +
                `<tr>
                    <td><span class="number">${ind*4}</span></td>
                    <td><span class="keyword">${data.variables[ind]}</span></td>
                    <td><b>${val}</b></td>
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