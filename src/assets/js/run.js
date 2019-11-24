$('#run').on('click', function() {
    $('#run').css('display', 'none');
    $('#input').css('display', 'none');

    var pure_text = $('#input').html().replace(/<br>/g, '\n').replace(/<[^>]*>|⭾/g, '').replace(/^#.*$/gm, '').replace(/^ +/gm, '');
    var results = emulate(pure_text);

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
            ${results.registry.reduce(function(accumulator, val, ind) {
                return accumulator +
                `<tr>
                    <td>${ind}</td>
                    <td>${val ? `<b>${val}</b>` : 'undefined'}</td>
                </tr>`
            }, '') + 
            `<tr>
                <td>STATUS</td>
                <td><span class="keyword">${results.status}</span></td>
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
            ${results.memory.reduce(function(accumulator, val, ind) {
                return accumulator +
                `<tr>
                    <td>${ind*4}</td>
                    <td>${results.variables[ind] ? `<span class="keyword">${results.variables[ind]}</span>` : 'undefined'}</td>
                    <td>${val ? `<b>${val}</b>` : 'undefined'}</td>
                </tr>`
            }, '')}
            </tfoot>
        </table>
    </div>`;
    $('#results').html(
        `<div class="row gtr-uniform">
            <div class="col-3 col-12-small">${registry_html}</div>
            <div class="col-9 col-12-small">${memory_html}</div>
        </div>`
    );
});

function emulate(text) {
    /* ... */
    return temp;
}

var temp = {
    registry: [0, 1, 2, 4, "🤔", -5, undefined, 00, 123, -0, 1, 1, undefined, 130, 140000000, 15],
    status: "11",
    memory: [0, 1, 2, 3, 4, 5, 2137, undefined, undefined, undefined, 1500, 100, 900, undefined, "hmm", "¯\\_(ツ)_/¯"],
    variables: ["LOREM", "IPSUM", '', "DOLOR", "SIT", "AMET", '', '', '', "jp2"]
};