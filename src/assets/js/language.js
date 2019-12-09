let lang = {};

/**
 * Erase cookie.
 *
 * @param cname
 */
function eraseCookie(cname) {
	document.cookie = cname + "= ;-1;path=/";
}

/**
 * Set cookie.
 *
 * @param cname
 * @param cvalue
 * @param exdays
 */
function setCookie(cname, cvalue, exdays) {
	eraseCookie(cname);
	cvalue = cvalue.replace(/(\r\n|\n|\r)/gm, "|n|");
	cvalue = cvalue.replace(/(\t)/gm, " ");
	let d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 *  Get cookie.
 *
 * @param cname
 *
 * @returns {string}cookie_value
 */
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length).replace(/\|n\|/g, "\n");
	  }
	}
	return "";
}

/**
 *  Refresh tooltips.
 */
function refreshTooltip() {
	$('.command-name').off();
	$('.command-name').tooltip({html: true});
}

/**
 * Hide tooltips
 */
function hideTooltips() {
	$('.command-name').tooltip('hide');
	$('.tooltip').hide();
}


/**
 * Get short documentation for command.
 *
 * @param cmd_name
 *
 * @returns {string}cmd_doc
 */
function getShortDoc(cmd_name) {
	let prefix = cmd_name + ": ";
	
	if (lang['docs']['commands']['content'].hasOwnProperty(cmd_name) && lang['docs']['commands']['content'][cmd_name].hasOwnProperty('short'))
		return prefix + lang['docs']['commands']['content'][cmd_name]['short'];
	else
		return prefix + '---';
}

/**
 *  Get documentation for commands.
 *
 * @returns {string}doc_html
 */
function getCommandsDoc() {
	let html = '<div class="accordion" id="accordionCommands">';

	for (let cmd_name in lang['docs']['commands']['content']) {
		let cmd_info = lang['docs']['commands']['content'][cmd_name];
		html += `
		<div class="card"> 
			<div class="card-header" id="heading${cmd_name}"> 
				<h2 class="mb-0"> 
					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse${cmd_name}" aria-expanded="false" aria-controls="collapse${cmd_name}">${cmd_name}: ${cmd_info['short']}</button> 
				</h2> 
			</div> 
			<div id="collapse${cmd_name}" class="collapse" aria-labelledby="heading${cmd_name}" data-parent="#accordionCommands"> 
				<div class="card-body">
					<p>${cmd_info['long']}</p>
					<hr>
					<p>${cmd_info['params']}</p>
					<hr>
					<p>${cmd_info['examples']}</p>
				</div>
			</div> 
		</div>`
	}
		
	html += '</div>';
	
	return html;
}

/**
 * Return class property from string.
 *
 * @param obj
 * @param string
 *
 * @returns {string|string|*}class_property
 */
function recompose(obj,string){
	let parts = string.split('.');
	if (!obj.hasOwnProperty(parts[0])) return '';
	let newObj = obj[parts[0]];
	if (parts[1]) {
        parts.splice(0,1);
        let newString = parts.join('.');
        return recompose(newObj, newString);
    }
    return newObj;
}

/**
 * Set active and inactive classes to language flags.
 *
 * @param lang
 */
function setFlags(lang) {
	if (lang == 'pl') {
		$('#pl-flag').addClass('active');
		$('#uk-flag').addClass('inactive');
	} else {
		$('#pl-flag').addClass('inactive');
		$('#uk-flag').addClass('active');
	}	
}

/**
 * Get lang from json via AJAX.
 */
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

/**
 * Set lang in html element with data-lang attribute.
 */
function setLang() {
	$('[data-lang]').each((i, el) => {
		let key = $(el).attr('data-lang');
		let text = recompose(lang, key);
		if (text != '') $(el).html(text).removeAttr('data-lang');
	})
}

/**
 * Get examples html from lang object.
 *
 * @returns {string}examples_html
 */
function getExamples() {
	let html = "";
	
	for (let example_key in lang['examples']['programs']) {
		let example = lang['examples']['programs'][example_key];
		let code = example['code'].split('\n');
		if(code.length > 16) {
			code = code.slice(0, 16);
			code[code.length-1] = `${code[code.length-1]} ...`;
		}
		code = code.join('\n').replace(/(\r\n|\n|\r)/gm, "<br>");
		html += `
		<div class="col-md-6">
			<div class="card single-example card-example" id="${example_key}"> 
				<div class="card-header card-header-example" style="height: 10%">
					<h11 style="margin: 0">${example['title']}</h11>
				</div>
				<div class="card-body">
					<p>${example['desc']}</p>
					<div class="code">
						<pre>
							<code><div class="code-inner">${code}</div> <div class="copy" data-example="${example_key}"><i class="fa fa-copy"></i> </div></code>
						</pre>
					</div>
					<a href="#" class="example-button button" data-example="${example_key}"> Run </a>
				</div>
			</div>
		</div>`;
	}
		
	html += '</div>';
	
	return html;
}

getLang();
setLang();

$('#commands-content').html(getCommandsDoc());
$('#examples-content').html(getExamples());

/**
 * Change language.
 */
$('.inactive').click(() => {
	let new_lang = $('.inactive').attr('data-lang-type');
	let input_cookie = getCookie('input');
	
	setCookie('lang', new_lang, 15);
	
	if (input_cookie === lang.index.exampleProgram)
		eraseCookie('input');
	
	location.reload();
});

/**
 * Run example button.
 */
$('.example-button').click(function() {
	let key = $(this).attr('data-example');
	setCookie('input', lang['examples']['programs'][key]['code'], 15);
	window.location = "/";
});
