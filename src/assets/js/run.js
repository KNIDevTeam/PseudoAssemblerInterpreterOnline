var current_state = 0;

$('#prev').on('click', function() {
    current_state--;
    current_state = Math.min(states.length-1, Math.max(0, current_state));
    $('#results').html(formatData(states[current_state]));
});

$('#next').on('click', function() {
    current_state++;
    current_state = Math.min(states.length-1, Math.max(0, current_state));
    $('#results').html(formatData(states[current_state]));
});

var states;

$('#run').on('click', function() {
    $('#run').css('display', 'none');
    $('#input').css('display', 'none');
    $('#prev-next').css('display', 'block')

    var pure_text = $('#input').html().replace(/<br>/g, '\n').replace(/<[^>]*>|⭾/g, '').replace(/^#.*$/gm, '').replace(/^ +/gm, '');
    states = emulate(pure_text);

    current_state = Math.min(states.length-1, Math.max(0, current_state));
    $('#results').html(formatData(states[current_state]));
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
                    <td>${val ? `<b>${val}</b>` : 'undefined'}</td>
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
                    <td>${data.variables[ind] ? `<span class="keyword">${data.variables[ind]}</span>` : 'undefined'}</td>
                    <td>${val ? `<b>${val}</b>` : 'undefined'}</td>
                </tr>`
            }, '')}
            </tfoot>
        </table>
    </div>`;

    return `<div class="row gtr-uniform">
    <div class="col-3 col-12-small">${registry_html}</div>
    <div class="col-9 col-12-small">${memory_html}</div>
    </div>`;
}

function rnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//placeholder for generating states
function emulate(text) {
    /* ... */
    let states = [];
    console.log(temp);
    for(let s = 0; s < 10; s++) {
        let random_temp = JSON.parse(JSON.stringify(temp));
        let reg_edits = rnd(1, 10);
        for(let i = 0; i < reg_edits; i++) {
            let j = rnd(0, 15);
            random_temp.registry[j] = rnd(0, 100);
        }
        let mem_edits = rnd(1, 10);
        for(let i = 0; i < mem_edits; i++) {
            let j = rnd(0, random_temp.memory.length-1);
            random_temp.memory[j] = rnd(0, 100);
        }
        states.push(random_temp);
    }
    console.log(temp);
    return states;
    
}

var temp = {
    registry: [0, 1, 2, 4, "🤔", -5, undefined, 00, 123, -0, 1, 1, undefined, 130, 140000000, 15],
    status: "11",
    memory: [0, 1, 2, 3, 4, 5, 2137, undefined, undefined, undefined, 1500, 100, 900, undefined, "hmm", "¯\\_(ツ)_/¯"],
    variables: ["LOREM", "IPSUM", '', "DOLOR", "SIT", "AMET", '', '', '', "jp2"]
};