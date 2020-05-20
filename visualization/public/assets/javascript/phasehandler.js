'use strict';

const elements = [ 'communeSelector', 'filterBox', 'collectedSchools', 'map', 'mainCon', 'relationPhase' ];

const navButtons = [ 'overview', 'filter', 'detail', 'relation', 'presentation' ];

let currentPhase = 3;

updatePhase(currentPhase);

function updatePhase(phase) {
	currentPhase = phase;
	console.log('Entering phase:', phase);
	setView(phase);
	setMenuBar(phase);
}

function setView(phase) {
	hideAll();
	switch (phase) {
		case 0:
			display('communeSelector');
			display('map');
			info.addTo(map);
			break;
		case 1:
			fetchMarkersAndPlaceOnMap();
			info.remove();
			display('filterBox');
			display('collectedSchools');
			display('map');
			break;
		case 2:
			// inBounds = [
			// 	{ NAME: 'Ida Holsts Skole', display: true, COMMUNE: 'Svendborg' },
			// 	{ NAME: 'Nymarkskolen', display: true, COMMUNE: 'Svendborg' },
			// 	{ NAME: 'Kernen', display: true, COMMUNE: 'Svendborg' }
			// ];
			display('mainCon');
			createSchoolList(inBounds);
			setDetailData(inBounds[0].NAME);
			break;
		case 3:
			display('relationPhase');
			break;
	}
}

function setMenuBar(phase) {
	deactiveButtons();
	switch (phase) {
		case 0:
			activeButton('overview');
			break;
		case 1:
			hasBeenButton('overview');
			activeButton('filter');
			break;
		case 2:
			hasBeenButton('overview');
			hasBeenButton('filter');
			activeButton('detail');
			break;
		case 3:
			hasBeenButton('overview');
			hasBeenButton('filter');
			hasBeenButton('detail');
			activeButton('relation');
			break;
		case 4:
			hasBeenButton('overview');
			hasBeenButton('filter');
			hasBeenButton('detail');
			hasBeenButton('relation');
			activeButton('presentation');
			break;
	}
}

function display(id) {
	let element = document.getElementById(id);
	element.classList.remove('hidden');
	element.classList.add('active');
}

function hideAll() {
	for (let e of elements) {
		let element = document.getElementById(e);
		element.classList.remove('active');
		element.classList.add('hidden');
	}
}

function activeButton(id) {
	document.getElementById(id).classList.remove('boxDeactive');
}

function deactiveButton(id) {
	document.getElementById(id).classList.add('boxDeactive');
	document.getElementById(id).classList.remove('boxDone');
}

function hasBeenButton(id) {
	document.getElementById(id).classList.add('boxDone');
	document.getElementById(id).classList.remove('boxDeactive');
}

function deactiveButtons() {
	for (let b of navButtons) {
		deactiveButton(b);
	}
}
