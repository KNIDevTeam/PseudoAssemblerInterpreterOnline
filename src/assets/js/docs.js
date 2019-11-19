const doc = 
{
	"commands": {
		"DC": {
			"short": "Komenda inicjalizuje zmienną",
		},
		"DS": {
			"short": "Komenda inicjalizuje zmienną",
		},
		"AR": {
			"short": "Komenda dodaje do rejestru wartość zmiennej",
		},
	
	}
};

function refreshTooltip() {
	$('.command-name').off();
	$('.command-name').tooltip({html: true});
}

function getShortDoc(cmd_name) {
	let prefix = cmd_name + ": ";
	
	if (doc['commands'].hasOwnProperty(cmd_name) && doc['commands'][cmd_name].hasOwnProperty('short'))
		return prefix + doc['commands'][cmd_name]['short'];
	else
		return prefix + '---';
}
