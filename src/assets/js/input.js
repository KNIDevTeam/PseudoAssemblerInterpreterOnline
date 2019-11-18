$('body').attr("spellcheck",false)

$('.editable').each(function(){
    this.contentEditable = true;
});

var keywords = 'DS|DC|A|AR|S|SR|M|MR|D|DR|C|CR|L|LR|ST|LA|J|JN|JZ|JP';

var keywordRegExp = new RegExp('(^|<p>|<br>|<div>| )(KEY) '.replace(/KEY/g, keywords), 'g');
var strayHTML = /<font color="#00f4a4"><b>[^>]*<\/b><\/font>/g;

$("#input").on('keyup', function() {
    var savedSel = rangeSelectionSaveRestore.saveSelection();

    var content = $(this).html();
    

    //highlight keywords
    content = content.replace(keywordRegExp, function(str) {
        var space = (str[0] == ' ');
        str = str.substring((space ? 1 : 0), str.length - 1);
        str = (space ? ' ' : '') + '<font color="#00f4a4"><b>' + str + '</b></font> '
        return str;
    });

    //console.log(content);

    //replace marker for checking
    content = content.replace(/<span id="selectionBoundary" style="line-height: 0; display: none;">⚶<\/span>/g, '⚶');
    //remove stray html
    content = content.replace(strayHTML, function(str) {
        var temp = str.replace(/⚶/g, '');
        if(!temp.match(new RegExp('<font color="#00f4a4"><b>(' + keywords + ')<\/b><\/font>', 'g'))) {
            str = str.replace(/<font color="#00f4a4">|<b>|<\/b>|<\/font>/g, '');
        }
        return str;
    });
    //restore marker
    content = content.replace(/⚶/g, '<span id="selectionBoundary" style="line-height: 0; display: none;">⚶</span>');

    $(this).html(content);

    rangeSelectionSaveRestore.restoreSelection(savedSel);
    $(this).focus();

    console.log(content.replace(/<br>|<div>/g, '\n').replace(/<[^>]*>|⚶/g, ''));
});

$("#input").on('blur', function() {
    var content = $(this).html();
    //console.log(content);
    content = content.replace(/<[^>]*>/g, '');
    if(content == '') $(this).html('Type something in here...');
});

$("#input").on('click', function() {
    var content = $(this).html();
    if(content == 'Type something in here...') $(this).html('');
});