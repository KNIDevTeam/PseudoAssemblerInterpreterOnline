const doc = 
{
	"general": {
		"header": "General info",
		"content": "Pseudoassembler is a programming language of great power. Proficient usage of this tool is an art that very few ever possessed. We hope that following documentation will allow you not only to master but also come to like pseudoassembler (it is possible – believe us)!",
	},
	"memory": {
		"header": "Memory addressing",
		"content": "There are four ways of adressing memory in pseudoassembler. Let us present all of them: <br> <ul><li><b>[label]</b> - Interpreter will work on memory block assigned to given label. If label is associated with array, it points to its first memory block.</li><li><b>[label]([register])</b> - Interpreter will work on memory block whose adress is sum of adress pointed by label and adress stored in register.</li><li><b>[memory adress]</b> - Interpreter will work on memory block with given adress. </li><li><b>[memory adress]([register])</b> - Interpreter will work on memory block whose adress is sum of given adress and adress stored in register.</li></ul><p>All these ways are, ultimately, ways of achieving the same objective - accessing memory block.</p><h4>Example</h4><p>Suppose we declared two arrays VEC1{1, 2} and VEC2{3, 4} (both size of 2 integers).<br>Conveniently, we also prepared registers - REG1{0} and REG2{4}. (Notice that 4 is the size of integer in bytes)<br>Now let's discuss the memory adresses utilised by arrays:<pre>VEC1[0] = 1 | Adress: 0<br>VEC1[1] = 2 | Adress: 4<br>VEC2[0] = 3 | Adress: 8<br>VEC2[1] = 4 | Adress: 12</pre>Following commands once executed will compute sum of values stored in VEC1 and VEC2 and save it in REG1:<pre>A   1, VEC1<br>A   1, VEC1(2)<br>A   1, 8 <br>A   1, 8(2)</pre></p>",
	},
	"rules": {
		"header": "PA Rules",
		"content": "Pseudoassembler is a programming language of great power. Proficient usage of this tool is an art that very few ever possessed. We hope that following documentation will allow you not only to master but also come to like pseudoassembler (it is possible – believe us)!",
	},
	"statusRegister": {
		"header": "StatusRegister",
		"content": "Pseudoassembler is a programming language of great power. Proficient usage of this tool is an art that very few ever possessed. We hope that following documentation will allow you not only to master but also come to like pseudoassembler (it is possible – believe us)!",
	},
	"commands": {
		"header": "Commands",
		"content": {
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
	
	if (doc['commands']['content'].hasOwnProperty(cmd_name) && doc['commands']['content'][cmd_name].hasOwnProperty('short'))
		return prefix + doc['commands']['content'][cmd_name]['short'];
	else
		return prefix + '---';
}

function getCommandDoc(cmd_name) {
	let cmd_info = doc['commands']['content'][cmd_name];
	
	return `
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
	</div>`;
}

function getAllDoc() {
	let html = '';
	
	for (let section_name in doc) {
		html += '<section id="'+section_name+'"><h3>'+doc[section_name]['header']+'</h3><hr>';
		
		if (section_name == 'commands') {
			html += '<section id="commands-info"><div class="accordion" id="accordionCommands">';

			for (let cmd_name in doc[section_name]['content'])
				html += getCommandDoc(cmd_name);
				
			html += '</div></section>';
		} else
			html += '<p>'+doc[section_name]['content']+'</p>';
		
		html += '</section>';
	}
		
	return html;
}

$('#main-doc').html(getAllDoc());
