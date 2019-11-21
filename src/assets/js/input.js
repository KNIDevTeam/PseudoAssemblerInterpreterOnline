$('body').attr("spellcheck", false);

$('.editable').each(function() {
    this.contentEditable = true;
});

var keywords = 'DS|DC|A|AR|S|SR|M|MR|D|DR|C|CR|L|LR|ST|LA|J|JN|JZ|JP';

var keyword_regexp = new RegExp(`(^| )(${keywords}) `, 'gm');
var marker_and_html = /<[^>]*>|⮓/g;
var html_regexp = /<[^>]*>/g

var placeholder = 1;

//format input text

$("#input").on('keyup', function(key) {
    key = key.which;
    if(!(key <= 13 || key == 32 || (key >= 48 && key <= 90) || (key >= 106 && key <= 111) || key >= 186)) return;

    //check if needs to be cleared
    if(placeholder) $(this).html(''), placeholder = 0;

    var saved_sel = rangeSelectionSaveRestore.saveSelection();
    var content = $(this).html();

    //replace selection markers
    var markers = content.match(/<span id="selectionBoundary_[0-9]+_[0-9]+" style="line-height: 0; display: none;">⭾<\/span>/g);
    content = content.replace(/⭾/g, '⮓');

    //shorten whitespace
    content = content.replace(/(\s|&nbsp;)+/g, ' ');

    //make newlines consistent
    content = content.replace(/<br>|((?!^)<div>)|<p>/g, '\n').replace(/<div>|<\/div>|<\/p>/g, '').replace(/\n{2}/g, '\n');

    //purge html tags
    content = content.replace(html_regexp, '');
	
    //check length of labels
    var longest_label = content.replace(marker_and_html, '').split('\n').reduce(function(accumulator, current) {
        var words = current.split(' ').filter(function(element) {
            return (element != null && element != "");
        });

        if(words[0]) return Math.max(accumulator, words[0].length);
        else return accumulator;
    }, 0) * 10 + 10;

    //insert new label formatting
    content = content.split('\n');
    content.forEach(function(current, index) {
        var words = current.split(' ').filter(function(element) {
            return (element != null && element != "");
        });
        var temp = current.replace(marker_and_html, '').split(' ').filter(function(element) {
            return (element != null && element != "");
        });

        if(!temp.length) return;
        if(temp[0].length && !temp[0].match(new RegExp(`^(${keywords})$`, 'g'))) {
            words.splice(0, 1, `<span class="label" style="width: ${longest_label}px">${words[0]}</span>`);
        } else words.splice(0, 0, `<span class="label" style="width: ${longest_label}px"> </span>`);
        content[index] = words.join(' ');
    });
    content = content.join('\n');

    //highlight keywords
    content = content.replace(keyword_regexp, function(str) {
        var space = (str[0] == ' ' ? ' ' : '');
        str = str.substring(space.length, str.length - 1);
		var cmd_doc = getShortDoc(str);
        str = `${space}<span class="command-name" title="${cmd_doc}" data-name="${str.replace(marker_and_html, '')}">${str}</span> `
        return str;
    });

    //restore markers
    markers.forEach(function(span) {
        content = content.replace(/⮓/, span);
    });

    //restore newlines
    content = content.replace(/\n/g, '<br>');

    $(this).html(content);
    rangeSelectionSaveRestore.restoreSelection(saved_sel);
	
	refreshTooltip();
	$('#run').fadeIn();
});

$("#input").on('blur', function() {
    var content = $(this).html().replace(/<[^>]*>|⭾|\s|&nbsp;/g, '');
    if(content == '') {
        placeholder = 1;
		$(this).html('Type something in here...');	
		$('#run').fadeOut();
	}
});

$("#input").on('click', function() {
    var content = $(this).html();
    if(content == 'Type something in here...') $(this).html(''), placeholder = 0;;
});