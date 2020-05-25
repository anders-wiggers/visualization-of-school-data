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
		}
	} else {
		presentList.push(savedCharts[index]);
	}
	drawSavedCharts();
}

function drawSavedCharts() {
	let contianer = document.getElementById('bodyContainer');
	contianer.innerHTML = '';
	for (let item of presentList) {
		let div = document.createElement('div');
		div.setAttribute('class', 'itemInPresentation');
		div.innerHTML = `<div>${item.name}</div>
        <img src="${item.graph}"/>

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
