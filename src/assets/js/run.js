var cur_state = 1;
var states;
var program;

//update tables
function show(direction) {
    //animate
    if(!animating) {
        let logo_y = getPos(document.getElementById("logo-id")).y;
        let button_y = getPos(document.getElementById("prev-next")).y;
        if(direction == "next") [logo_y, button_y] = [button_y, logo_y];
        spawnCharacters("run1", {x: 0, y: logo_y, w: canvas.width*0.01});
        spawnCharacters("run2", {x: canvas.width, y: button_y, w: 0});
        animating = 1, requestAnimationFrame(draw);
    }

    cur_state = Math.min(states.length-1, Math.max(1, cur_state));

    let cur_program = JSON.parse(JSON.stringify(program));
    cur_program[states[cur_state].line] = '<div id="cur-line" style="display: inline">&rarr; ' + cur_program[states[cur_state].line] + "</div>";
    $('#program').html('<h2>Program</h2>' + cur_program.join('<br>'));
    $('#results').html(formatData(states[cur_state]));
    
    $('#cur-line').addClass('animated flash');
    //$('#cursor').addClass('animated flash');
	checkVisibility();
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
$('#run').on('click', function() {
    $('#run').css('display', 'none');
    $('#input').css('display', 'none');
    $('#prev-next').css('display', 'block');
    $('#program').css('display', 'block');
    $('#prev').css('display', 'none');

    program = $('#input').html().replace(/<span class="comment">[^<]*<\/span><br>/gm, '').split('<br>');
    var pure_text = $('#input').html().replace(/<br>/g, '\n').replace(/<[^>]*>|⭾/g, '').replace(/^#.*$/gm, '').replace(/^ +/gm, '').replace(/^\n/gm, '');

    //emulate program
    states = emulate(pure_text);

    show();
    $('#results').addClass('animated fadeIn');
    $('#program').addClass('animated fadeIn');
});

function formatData(data) {
    var registry_html = `<h3>Registry</h3>
    <div class="table-wrapper">
        <table class="default">
            <thead>
                <tr>
                    <th>Address</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tfoot>
            ${data.registry.reduce(function(accumulator, val, ind) {
                return accumulator +
                `<tr>
                    <td><span class="number">${ind}</span></td>
                    <td>${val != undefined ? `<b>${val}</b>` : 'undefined'}</td>
                </tr>`
            }, '') + 
            `<tr>
                <td>STATUS</td>
                <td><span class="keyword">${data.status}</span></td>
            </tr>`}
            </tfoot>
        </table>
    </div>`;

    var memory_html = `<h3>Memory</h3>
    <div class="table-wrapper">
        <table class="default">
            <thead>
                <tr>
                    <th>Address</th>
                    <th>Variable</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tfoot>
            ${data.memory.reduce(function(accumulator, val, ind) {
                return accumulator +
                `<tr>
                    <td><span class="number">${ind*4}</span></td>
                    <td>${data.variables[ind] != undefined ? `<span class="keyword">${data.variables[ind]}</span>` : 'undefined'}</td>
                    <td>${val != undefined ? `<b>${val}</b>` : 'undefined'}</td>
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
		$('#prev').fadeOut(100);
		$('#next').fadeIn(100);
	} else if (cur_state == states.length-1) {
		$('#prev').fadeIn(100);
		$('#next').fadeOut(100);
	} else {
		$('#prev').fadeIn(100);
		$('#next').fadeIn(100);
	}
}

//state generation
function emulate(text) {
    let states = [];
    let res = main_parse(text.split('\n'));
    for(let i = 0; i < res.length; i++) {
        states.push(translate(res[i]));
    }
    console.log(states);
    return states;
}

function translate(state) {
    let res = {};

    res.registry = state.registers;
    res.status = state.state;
    res.memory = state.memory;
    res.line = state.line;

    res.variables = Object.keys(state.memory_labels);
    return res;
}