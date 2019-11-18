$('body').attr("spellcheck", false);

$('.editable').each(function() {
    this.contentEditable = true;
});

var keywords = 'DS|DC|A|AR|S|SR|M|MR|D|DR|C|CR|L|LR|ST|LA|J|JN|JZ|JP';

var keywordRegExp = new RegExp(`(^|<br>|<div>|<p>| )(${keywords}) `, 'g');
var strayHTML = /<span class="command-name">[^>]*<\/span>/g;
var markerAndHTML = /<[^>]*>|⚶/g;
var HTMLRegExp = /<[^>]*>/g

//format input text

$("#input").on('keyup', function() {
    var savedSel = rangeSelectionSaveRestore.saveSelection();

    var content = $(this).html();
    console.log(content);

    //replace selection marker for checking
    content = content.replace(/<span id="selectionBoundary" style="line-height: 0; display: none;">⚶<\/span>/g, '⚶');

    //make newlines consistent
    content = content.replace(/<br>|((?!^)<div>)|<p>/g, '\n').replace(/<div>|<\/div>|<\/p>/g, '').replace(/\n{2}/g, '\n');

    //highlight keywords
    content = content.replace(keywordRegExp, function(str) {
        var space = (str[0] == ' ');
        str = str.substring((space ? 1 : 0), str.length - 1);
        str = `${(space ? ' ' : '')}<span class="command-name" data-name="${str.replace(markerAndHTML, '')}">${str}</span> `
        return str;
    });
    
    //remove stray html
    content = content.replace(strayHTML, function(str) {
        var temp = str.replace(/⚶/g, '');
        if(!temp.match(new RegExp(`<span class="command-name" data-name="(${keywords})">(${keywords})<\/span>`, 'g'))) {
            str = str.replace(new RegExp(`<span class="command-name" data-name="(${keywords})">|<\/span>`, 'g'), '');
        }
        return str;
    });
    
    //check length of labels
    var pure_text = content.replace(markerAndHTML, '').split('\n');
    var longest_label = pure_text.reduce(function(accumulator, current) {
        var words = current.split(' ').filter(function(element) {
            return (element != null && element != "");
        });

        if(words[0]) return Math.max(accumulator, words[0].length);
        else return accumulator;
    }, 0);

    console.log(longest_label);

    //delete old label formatting
    content = content.replace(/<span class="label" style="width: ([0-9]*)px">[^>]*<\/span>/g, function(str) {
        return str.replace(HTMLRegExp, '');
    });

    //shorten whitespace
    content = content.replace(/([^\S\r\n]|&nbsp;)+/g, ' ');

    //insert new label formatting
    content = content.split('\n');
    content.forEach(function(current, index) {
        var words = current.split(' ').filter(function(element) {
            return (element != null && element != "");
        });

        var temp = current.replace(markerAndHTML, '').split(' ').filter(function(element) {
            return (element != null && element != "");
        });

        if(!temp.length) return;
        if(temp[0].length && !temp[0].match(new RegExp(`^(${keywords})$`, 'g'))) {
            words.splice(0, 1, `<span class="label" style="width: ${longest_label*12}px">${words[0]}</span>`);
        } else words.splice(0, 0, `<span class="label" style="width: ${longest_label*12}px"> </span>`);
        content[index] = words.join(' ');
    });
    content = content.join('\n');

    //restore marker
    content = content.replace(/⚶/g, '<span id="selectionBoundary" style="line-height: 0; display: none;">⚶</span>');
    //restore newlines
    content = content.replace(/\n/g, '<br>');

    console.log(content);

    $(this).html(content);

    rangeSelectionSaveRestore.restoreSelection(savedSel);
});

$("#input").on('blur', function() {
    var content = $(this).html();
    content = content.replace(HTMLRegExp, '');
    if(content == '') $(this).html('Type something in here...');
});

$("#input").on('click', function() {
    var content = $(this).html();
    if(content == 'Type something in here...') $(this).html('');
});