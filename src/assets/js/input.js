$('body').attr("spellcheck", false);

$('.editable').each(function() {
    this.contentEditable = true;
});

var keywords = 'DS|DC|A|AR|S|SR|M|MR|D|DR|C|CR|L|LR|ST|LA|J|JN|JZ|JP';

var keyword_regexp = new RegExp(`(^| |⮓)(${keywords}) `, 'gm');
var marker_and_html = /<[^>]*>|⮓/g;
var html_regexp = /<[^>]*>/g

var placeholder = 0;

//format input text

$("#input").on('keyup paste contextmenu', function(e) {
    key = e.which;
    if(key == null) $('#input').keyup({which: 13});
    if(!(key <= 13 || key == 32 || (key >= 48 && key <= 90) || (key >= 106 && key <= 111) || key >= 186)) return;
	
	hideTooltips();

    //check if needs to be cleared
    if(placeholder) $(this).html(''), placeholder = 0;

    var saved_sel = rangeSelectionSaveRestore.saveSelection();
    $(this).html(formatInput($(this).html()));
    rangeSelectionSaveRestore.restoreSelection(saved_sel);
	
	refreshTooltip();
	$('#run').fadeIn();
});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatInput(content) {
    //replace selection markers
    var markers = content.match(/<span id="selectionBoundary_[0-9]+_[0-9]+" style="line-height: 0; display: none;">⭾<\/span>/g);
    if(markers) markers.forEach(function(marker) {
        content = content.replace(marker, '⮓');
    });

    //remove error messages
    content = content.replace(/<span class="error">[^>]*<\/span>/g, '');

    //shorten whitespace
    content = content.replace(/([^\S\n]|&nbsp;)+/g, ' ');

    //make newlines consistent
    content = content.replace(/<br>|((?!^)<div>)|<p>/g, '\n').replace(/<div>|<\/div>|<\/p>/g, '').replace(/\n{2}/g, '\n');
    content = content.replace(/^\n/, '');

    //purge html tags
    content = content.replace(html_regexp, '');

    //remove whitespace from beginning of lines
    content = content.replace(/^ +/gm, '');
    
    setCookie('input', content.replace(/⮓/g, ''), 5);

    //check length of labels
    var longest_label = content.replace(marker_and_html, '').split('\n').reduce(function(accumulator, current) {
        var words = current.split(' ').filter(function(element) {
            return (element != null && element != "");
        });

        //ignore comments
        if(words[0] && words[0][0] != '#') return Math.max(accumulator, words[0].length+1);
        else return accumulator;
    }, 0) / 2.1 + 1;
    longest_label = Math.round(longest_label * 100) / 100;

    //insert new label formatting
    content = content.split('\n');
    content.forEach(function(current, index) {
        var words = current.split(' ').filter(function(element) {
            return (element != null && element != "");
        });
        var temp = current.replace(marker_and_html, '').split(' ').filter(function(element) {
            return (element != null && element != "");
        });

        if(!temp.length ) return;

        //ignore comments
        if(temp[0].length >= 1 && temp[0][0] == '#') return;

        if(temp[0].length && !temp[0].match(new RegExp(`^(${keywords})$`, 'g'))) {
            words.splice(0, 1, `<span class="label" style="width: ${longest_label}em">${words[0]}</span>`);
        } else words.splice(0, 0, `<span class="label" style="width: ${longest_label}em"> </span>`);
        content[index] = words.join(' ');
    });
    content = content.join('\n');

    //highlight keywords
    content = content.replace(keyword_regexp, function(str) {
        var space = (str[0] == ' ' ? ' ' : '');
        str = str.substring(space.length, str.length - 1);
        var cmd = str.replace(marker_and_html, '');
		var cmd_doc = getShortDoc(cmd);
        str = `${space}<span class="command-name" title="${cmd_doc}" data-name="${cmd}">${str}</span> `
        return str;
    });

    //highlight values
    content = content.replace(/\([0-9]*⮓?[0-9]*\)/g, function(str) {
        str = str.substring(1, str.length - 1);
        return `(<span class="number">${str}</span>)`;
    });

    //find comments
    var comments = content.match(/^#.*$/gm);
    //purge html and insert new formatting
    if(comments) comments.forEach(function(comment) {
        var formatted = `<span class="comment">${comment.replace(html_regexp, '')}</span>`;
        content = content.replace(new RegExp(`^${escapeRegExp(comment)}$`, 'm'), formatted);
    });

    //restore markers
    if(markers) markers.forEach(function(span) {
        content = content.replace(/⮓/, span);
    });

    //restore newlines
    content = content.replace(/\n/g, '<br>');
    
    return content;
}

(() => {
    cookie = getCookie('input');
    if (cookie != '' && cookie != '\n' && cookie != ' ')
        $("#input").html(formatInput(cookie));
    else
        $("#input").html(formatInput(lang.index.exampleProgram));
})();

//place example program
//$("#input").html(formatInput(lang.index.exampleProgram));
refreshTooltip();
$('#run').fadeIn();

$("#input").on('blur', function() {
    var content = $(this).html().replace(/<[^>]*>|⭾|\s|&nbsp;/g, '');
    if(content == '') {
        placeholder = 1;
		$(this).html(lang.index.typeSth);	
		$('#run').fadeOut();
	}
});

$("#input").on('click', function() {
    var content = $(this).html();
    if(content == lang.index.typeSth) {
        $(this).html('');
        placeholder = 0;
    }
});