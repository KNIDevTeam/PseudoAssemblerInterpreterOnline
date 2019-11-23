var lang = {};

function refreshTooltip() {
	$('.command-name').off();
	$('.command-name').tooltip({html: true});
}

function hideTooltips() {
	$('.command-name').tooltip('hide');	
}

function getShortDoc(cmd_name) {
	let prefix = cmd_name + ": ";
	
	if (lang['docs']['commands']['content'].hasOwnProperty(cmd_name) && lang['docs']['commands']['content'][cmd_name].hasOwnProperty('short'))
		return prefix + lang['docs']['commands']['content'][cmd_name]['short'];
	else
		return prefix + '---';
}

function getCommandsDoc() {
	let html = '<div class="accordion" id="accordionCommands">';

	for (let cmd_name in lang['docs']['commands']['content']) {
		let cmd_info = lang['docs']['commands']['content'][cmd_name];
		html += `
		<div class="card"> 
			<div class="card-header" id="heading`+cmd_name+`"> 
				<h2 class="mb-0"> 
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse`+cmd_name+`" aria-expanded="false" aria-controls="collapse`+cmd_name+`">`+cmd_name+`: `+cmd_info['short']+`</button> 
				</h2> 
			</div> 
			<div id="collapse`+cmd_name+`" class="collapse" aria-labelledby="heading`+cmd_name+`" data-parent="#accordionCommands"> 
				<div class="card-body">
					<p>`+cmd_info['long']+`</p>
					<hr>
					<p>`+cmd_info['params']+`</p>
					<hr>
					<p>`+cmd_info['examples']+`</p>
				</div>
			</div> 
		</div>`
	}
		
	html += '</div>';
	
	return html;
}

function recompose(obj,string){
    var parts = string.split('.');
	if (!obj.hasOwnProperty(parts[0])) return '';
    var newObj = obj[parts[0]];
    if (parts[1]) {
        parts.splice(0,1);
        var newString = parts.join('.');
        return recompose(newObj, newString);
    }
    return newObj;
}

function getLang() {
	$.ajax({
		type: 'GET',
		url: 'lang/eng.json',
		async: false,
		beforeSend: function (xhr) {
		  if (xhr && xhr.overrideMimeType) {
			xhr.overrideMimeType('application/json;charset=utf-8');
		  }
		},
		dataType: 'json',
		success: function (data) {
		  lang = data;
		},
		error: function (data) {
			alert('Probably not valid json');
		}
	});
}

function setLang() {
	$('[data-lang]').each((i, el) => {
		let key = $(el).attr('data-lang');
		let text = recompose(lang, key);
		if (text != '') $(el).html(text).removeAttr('data-lang');
	})
}

getLang();

console.log(lang);

setLang();

$('#commands-content').html(getCommandsDoc());
