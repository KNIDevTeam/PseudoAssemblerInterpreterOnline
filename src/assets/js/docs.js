const doc = 
{
	"general": "Pseudoassembler is a programming language of great power. Proficient usage of this tool is an art that very few ever possessed. We hope that following documentation will allow you not only to master but also come to like pseudoassembler (it is possible – believe us)!",
	"commands": {
		"DR": {
			"short": "Memory adressing",
			"long": "There are four ways of adressing memory in pseudoassembler. Let us present all of them: <br> <ul><li>[label]</li><li>[label]([register])</li><li>[memory adress]</li><li>[memory adress]([register])</li></ul>All these ways are, ultimately, ways of achieving the same objective - accessing memory block.",
			"params": "[label] - Interpreter will work on memory block assigned to given label. If label is associated with array, it points to its first memory block.<br>[label]([register]) - Interpreter will work on memory block whose adress is sum of adress pointed by label and adress stored in register.<br>[memory adress]([register]) - Interpreter will work on memory block with given adress.<br>[memory adress]([register]) - Interpreter will work on memory block whose adress is given adress and adress stored in register.<br>",
			"examples": "Suppose we declared two arrays VEC1{1, 2} and VEC2{3, 4} (both size of 2 integers).<br>Conveniently, we also prepared registers - REG1{0} and REG2{4}. (Notice that 4 is the size of integer in bytes)<br>Now let's discuss the memory adresses utilised by arrays:<br>VEC1[0] = 1 | Adress: 0<br>VEC1[1] = 2 | Adress: 4<br>VEC2[0] = 3 | Adress: 8<br>VEC2[1] = 4 | Adress: 12<br><br>Following commands once executed will compute sum of values stored in VEC1 and VEC2 and save it in REG1:<br>A   1, VEC1<br>A   1, VEC1(2)<br>A   1, 8 <br>A   1, 8(2)<br>",
		},
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

function hideTooltips() {
	$('.command-name').tooltip('hide');	
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
