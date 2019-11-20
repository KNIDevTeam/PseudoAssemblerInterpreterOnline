const doc = 
{
	"general": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus euismod nulla dolor, viverra pulvinar turpis cursus ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam justo nunc, iaculis vel odio non, aliquam ullamcorper diam. Curabitur sit amet lectus mattis, aliquet magna in, consectetur sapien. Aenean vel bibendum tortor, vel porta massa. Sed lacus velit, semper sed dui id, aliquet faucibus ante. Morbi commodo aliquam metus in pulvinar. Quisque ullamcorper egestas mauris, finibus eleifend tortor scelerisque at. Curabitur vehicula turpis in tellus lobortis mollis.",
	"commands": {
		"DC": {
			"short": "Komenda inicjalizuje zmienną",
			"long": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus euismod nulla dolor, viverra pulvinar turpis cursus ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam justo nunc, iaculis vel odio non, aliquam ullamcorper diam. Curabitur sit amet lectus mattis, aliquet magna in, consectetur sapien. Aenean vel bibendum tortor, vel porta massa. Sed lacus velit, semper sed dui id, aliquet faucibus ante.",
			"params": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			"examples": "Example ezzzz",
		},
		"DS": {
			"short": "Komenda inicjalizuje zmienną",
			"long": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus euismod nulla dolor, viverra pulvinar turpis cursus ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam justo nunc, iaculis vel odio non, aliquam ullamcorper diam. Curabitur sit amet lectus mattis, aliquet magna in, consectetur sapien. Aenean vel bibendum tortor, vel porta massa. Sed lacus velit, semper sed dui id, aliquet faucibus ante.",
			"params": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			"examples": "Example ezzzz",
		},
		"AR": {
			"short": "Komenda dodaje do rejestru wartość zmiennej",
			"long": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus euismod nulla dolor, viverra pulvinar turpis cursus ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam justo nunc, iaculis vel odio non, aliquam ullamcorper diam. Curabitur sit amet lectus mattis, aliquet magna in, consectetur sapien. Aenean vel bibendum tortor, vel porta massa. Sed lacus velit, semper sed dui id, aliquet faucibus ante.",
			"params": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			"examples": "Example ezzzz",
		},
		"SR": {
			"short": "Komenda odejmuje od rejestru wartość zmiennej",
			"long": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus euismod nulla dolor, viverra pulvinar turpis cursus ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam justo nunc, iaculis vel odio non, aliquam ullamcorper diam. Curabitur sit amet lectus mattis, aliquet magna in, consectetur sapien. Aenean vel bibendum tortor, vel porta massa. Sed lacus velit, semper sed dui id, aliquet faucibus ante.",
			"params": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			"examples": "Example ezzzz",
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

function getCommandDoc(cmd_name) {
	return `
	<div class="card"> 
		<div class="card-header" id="heading`+cmd_name+`"> 
			<h2 class="mb-0"> 
				<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse`+cmd_name+`" aria-expanded="false" aria-controls="collapse`+cmd_name+`">`+cmd_name+`: `+doc['commands'][cmd_name]['short']+`</button> 
			</h2> 
		</div> 
		<div id="collapse`+cmd_name+`" class="collapse" aria-labelledby="heading`+cmd_name+`" data-parent="#accordionCommands"> 
			<div class="card-body">
				<p>`+doc['commands'][cmd_name]['long']+`</p>
				<hr>
				<p>`+doc['commands'][cmd_name]['params']+`</p>
				<hr>
				<p>`+doc['commands'][cmd_name]['examples']+`</p>
			</div>
		</div> 
	</div>`;
}

function getAllDoc() {
	let html = '<section id="general-info"><p>'+doc['general']+'</p></section>';
	html += '<section id="commands-info"><div class="accordion" id="accordionCommands">';

	for (let cmd_name in doc['commands'])
		html += getCommandDoc(cmd_name);
		
	html += '</div></section>';
		
	return html;
}

$('#main-doc').html(getAllDoc());
