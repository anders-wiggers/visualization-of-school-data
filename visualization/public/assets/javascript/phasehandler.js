'use strict';

const elements = [
	'communeSelector',
	'addAllSchools',
	'filterBox',
	'collectedSchools',
	'map',
	'mainCon',
	'relationPhase',
	'presentationPhase',
	'overviewTitle',
	'filteringTitle'
];

const navButtons = [ 'overview', 'filter', 'detail', 'relation', 'presentation' ];
let currentPhase = 0;
var previousPhase;
var updateDepending;
var communeSelectorAnimate = (string) => {
	gsap.set('#communeSelector', { x: '100%' });
	let to = new TimelineMax({})
		.to('#communeSelector', 1, { className: 'active' }, 0)
		.to('#communeSelector', 1, { x: 0, ease: 'power1' }, 0);
};

updatePhase(currentPhase);

function updatePhase(phase) {
	previousPhase = currentPhase;
	currentPhase = phase;
	setView(phase, '');
	if (previousPhase > phase) {
		setView(phase, '-');
	} else if (previousPhase < phase && previousPhase - phase != -3) {
		setView(phase, '');
	} else if (previousPhase - phase === -3) {
		setView(phase, '-');
	}
}

function setView(phase, string) {
	hideAll();
	switch (phase) {
		case 0:
			//display('communeSelector');
			communeSelectorAnimate();
			display('map');
			display('overviewTitle');
			info.addTo(map);
			break;
		case 1:
			//fetch all if non is selected
			if (selectedCommunesNames.length === 0) {
				fetchAllMarkersAndPlaceOnMap();
			} else {
				fetchMarkersAndPlaceOnMap();
			}
			info.remove();
			display('filterBox');
			display('filteringTitle');
			//display('collectedSchools');
			filterAnimate(string);
			display('map');
			break;
		case 2:
			// inBounds = [
			// 	{ NAME: 'Ida Holsts Skole', display: true, COMMUNE: 'Svendborg' },
			// 	{ NAME: 'Nymarkskolen', display: true, COMMUNE: 'Svendborg' },
			// 	{ NAME: 'Kernen', display: true, COMMUNE: 'Svendborg' }
			// ];
			if (manualSelected.length > 0) {
				createSchoolList(manualSelected);
			} else {
				createSchoolList(inBounds);
			}
			// try {
			// 	for (let s of inBounds) {
			// 		if (s.display === true) {
			// 			setDetailData(`${s.NAME}$${s.COMMUNE}`);
			// 			break;
			// 		}
			// 	}
			// } catch (error) {
			// 	// fetchAllMarkersAndPlaceOnMap(() => {
			// 	// 	setDetailData(inBounds[0].NAME);
			// 	// 	createSchoolList(inBounds);
			// 	// 	//display('mainCon');
			// 	// 	detailsAnimate();
			// 	// });
			// }
			//display('mainCon');
			detailsAnimate(string);
			break;
		case 3:
			// relationPhaseList = [
			// 	{ NAME: 'Ida Holsts Skole', display: true, COMMUNE: 'Svendborg' },
			// 	{ NAME: 'Nymarkskolen', display: true, COMMUNE: 'Svendborg' },
			// 	{ NAME: 'Kernen', display: true, COMMUNE: 'Svendborg' }
			// ];
			createRelationPage(relationPhaseList);
			relationAnimate(string);
			break;
		case 4:
			createPresentation(savedCharts);
			presentationAnimate(string);
	}
}

// function setMenuBar(phase) {
// 	deactiveButtons();
// 	switch (phase) {
// 		case 0:
// 			activeButton('overview');
// 			break;
// 		case 1:
// 			hasBeenButton('overview');
// 			activeButton('filter');
// 			break;
// 		case 2:
// 			hasBeenButton('overview');
// 			hasBeenButton('filter');
// 			activeButton('detail');
// 			break;
// 		case 3:
// 			hasBeenButton('overview');
// 			hasBeenButton('filter');
// 			hasBeenButton('detail');
// 			activeButton('relation');
// 			break;
// 		case 4:
// 			hasBeenButton('overview');
// 			hasBeenButton('filter');
// 			hasBeenButton('detail');
// 			hasBeenButton('relation');
// 			activeButton('presentation');
// 			break;
// 	}
// }

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

var filterAnimate = (string) => {
	gsap.set('#collectedSchools, #addAllSchools', { x: '100%' });
	gsap.set('#filterBox', { x: '-100%' });

	let tk = new TimelineMax({})
		.to('#filterBox ,#collectedSchools, #addAllSchools', 1, { className: 'active' }, 0)
		.to('#collectedSchools, #filterBox, #addAllSchools', 1, { x: 0, ease: 'power1' }, 0);
};

var detailsAnimate = (string) => {
	gsap.set('#mainCon', { x: `${string}` + '100%' });
	//gsap.set(element, { scaleX: '0' });
	let tl = new TimelineMax({})
		.to('#mainCon', 1.1, { className: 'active' }, 0)
		//.to(element, 1.1, { scaleX: 1, transformOrigin: 'right', ease: 'power1' }, 0);
		.to('#mainCon', 1.1, { x: 0, ease: 'power1' }, 0);
};

var relationAnimate = (string) => {
	gsap.set('#relationPhase', { x: `${string}` + '100%' });
	//gsap.set(element, { scaleX: '0' });
	let tr = new TimelineMax({})
		.to('#relationPhase', 1.1, { className: 'active' }, 0)
		//.to(element, 1.1, { scaleX: 1, transformOrigin: 'right', ease: 'power1' }, 0);
		.to('#relationPhase', 1.1, { x: 0, ease: 'power1' }, 0);
};

function presentationAnimate(string) {
	gsap.set('#presentationPhase', { scaleX: '0', scaleY: '0' });
	//gsap.set(element, { scaleX: '0' });
	let tr = new TimelineMax({})
		.to('#presentationPhase', 1.1, { className: 'active' }, 0)
		//.to(element, 1.1, { scaleX: 1, transformOrigin: 'right', ease: 'power1' }, 0);
		.to(
			'#presentationPhase',
			1.1,
			{ scaleX: '1', scaleY: '1', transformOrigin: 'bottom center', ease: 'power1' },
			0
		);
}

function nextPhase() {
	switch (currentPhase) {
		case 0:
			$('#filter').trigger('click');
			break;
		case 1:
			$('#details').trigger('click');
			break;
		case 2:
			$('#relate').trigger('click');
			break;
		case 3:
			$('#presentation').trigger('click');
			break;
		case 4:
	}
}

function prevPhase() {
	let nextBtn = document.getElementById('nextBtn');
	nextBtn.classList.remove('deaBtn');
	switch (currentPhase) {
		case 0:
			break;
		case 1:
			$('#overview').trigger('click');
			break;
		case 2:
			$('#filter').trigger('click');
			break;
		case 3:
			$('#details').trigger('click');
			break;
		case 4:
			$('#relation').trigger('click');
			break;
	}
}

window.onbeforeunload = function() {
	return 'Are you sure you want to leave?';
};
