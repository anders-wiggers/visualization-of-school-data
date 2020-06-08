'use strict';
let presentList = [];

function createPresentation(list) {
	//init the phase
	createSavedChartList(list);
}

function createSavedChartList(list) {
	let div = document.getElementById('finishedCharts');
	div.innerHTML = '';
	let ul = document.createElement('ul');
	ul.classList.add('com-ul');
	div.appendChild(ul);
	list.forEach((item) => {
		let li = document.createElement('li');
		li.classList.add('com-li');
		let text = document.createElement('div');
		text.innerHTML = item.name;
		text.classList.add('school-item');
		let icon = document.createElement('img');
		icon.setAttribute('src', item.graph);
		icon.classList.add('school-icon');
		let floxFix = document.createElement('div');
		floxFix.classList.add('school-list');
		floxFix.classList.add('clickable');
		floxFix.setAttribute('onclick', `addToPresentationPage('${item.name}')`);
		floxFix.setAttribute('id', item.name);
		floxFix.appendChild(icon);
		floxFix.appendChild(text);
		li.appendChild(floxFix);
		ul.appendChild(li);
	});
}

function addToPresentationPage(item) {
	let index = savedCharts.findIndex((i) => i.name === item);

	if (presentList.includes(savedCharts[index])) {
		index = presentList.findIndex((i) => i.name === item);
		if (index > -1) {
			presentList.splice(index, 1);
			document.getElementById(item).classList.remove('pressed');
		}
	} else {
		presentList.push(savedCharts[index]);
		document.getElementById(item).classList.add('pressed');
	}
	drawSavedCharts();
}

function drawSavedCharts() {
	let contianer = document.getElementById('bodyContainer');
	contianer.innerHTML = '';
	for (let item of presentList) {
		let div = document.createElement('div');
		div.setAttribute('class', 'itemInPresentation');
		console.log(item);
		div.innerHTML = `<div><h3>${item.name}</h3></div>
		<div class="d-flex align-items-center">
		<div class="p-2">${capitalizeFirstLetter(item.yAxis)}</div>
        <img class="p-2" style="width: calc(100% - 150px)"src="${item.graph}"/>
		</div>
		<div>${capitalizeFirstLetter(item.xAxis)}</div>
        <div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text">Annotation</span>
  </div>
  <textarea class="form-control" aria-label="With textarea" onchange="updateAnnotation('${item.name}',this)">${item.annotation}</textarea>
</div>`;
		contianer.appendChild(div);
	}
}

function updateAnnotation(input, e) {
	let index = savedCharts.findIndex((i) => i.name === input);
	savedCharts[index].annotation = e.value;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

async function downloadPDF() {
	var doc = new jsPDF();

	// html2canvas(document.querySelector('#bodyContainer'), {
	// 	onrendered: function(canvas) {
	// 		doc.addImage(canvas, 'JPEG', 15, 0);
	// 		doc.save('a4.pdf');
	// 	}
	// });

	let breakPage = 0;
	let corx = 20;
	for (let item of presentList) {
		doc.text(item.name, 20, corx);
		doc.text(item.yAxis, 15, 50 + corx, null, 90);
		doc.text(item.xAxis, 80, 80 + corx);
		doc.addImage(item.graph, 'PNG', 20, corx + 10, 140, 60);
		doc.text(item.annotation, 20, 85 + corx);

		breakPage++;
		if (breakPage === 2) {
			doc.addPage();
			breakPage = 0;
			corx = 20;
		} else {
			corx += 100;
		}
	}
	doc.save('a4.pdf');
}
