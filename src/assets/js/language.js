var lang = {};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function eraseCookie(cname) {
	document.cookie = cname + "= ;-1;path=/";
}

function setCookie(cname, cvalue, exdays) {
	eraseCookie(cname);
	cvalue = cvalue.replace(/(\r\n|\n|\r)/gm, "|n|");
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length).replace(/\|n\|/g, "\n");
	  }
	}
	return "";
}

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

function setFlags(lang) {
	if (lang == 'pl') {
		$('#pl-flag').addClass('active');
		$('#uk-flag').addClass('inactive');
	} else {
		$('#pl-flag').addClass('inactive');
		$('#uk-flag').addClass('active');
	}	
}

function getLang() {
	let current_lang = getCookie('lang');
	
	if (current_lang != 'pl') {
		current_lang = 'eng';
		setCookie('lang', 'eng', 15);
	}
	
	setFlags(current_lang);
	
	$.ajax({
		type: 'GET',
		url: 'lang/' + current_lang + '.json',
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

//sleep(1000);

setLang();

$('#commands-content').html(getCommandsDoc());

$('.inactive').click(() => {
	let new_lang = $('.inactive').attr('data-lang-type');
	let input_cookie = getCookie('input');
	
	setCookie('lang', new_lang, 15);
	
	if (input_cookie === lang.index.exampleProgram)
		eraseCookie('input');
	
	location.reload();
});
