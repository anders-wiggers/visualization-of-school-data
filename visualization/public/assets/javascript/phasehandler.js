'use strict';

const elements = [
	'communeSelector',
	'filterBox',
	'collectedSchools',
	'map',
	'mainCon',
	'relationPhase',
	'presentationPhase'
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
			try {
				setDetailData(inBounds[0].NAME);
			} catch (error) {
				fetchAllMarkersAndPlaceOnMap(() => {
					setDetailData(inBounds[0].NAME);
					createSchoolList(inBounds);
					//display('mainCon');
					detailsAnimate();
				});
			}
			createSchoolList(inBounds);
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
			savedCharts = [
				{
					name: 'Neatly done chart of grandkids school',
					xAxis: 'year',
					yAxis: 'absence',
					annotation: '',
					graph:
						'data:image/png;base64,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'
				},
				{
					name: 'asd',
					xAxis: 'year',
					yAxis: 'grades',
					annotation: '',
					graph:
						'data:image/png;base64,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'
				}
			];
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
	gsap.set('#collectedSchools', { x: '100%' });
	gsap.set('#filterBox', { x: '-100%' });

	let tk = new TimelineMax({})
		.to('#filterBox ,#collectedSchools', 1, { className: 'active' }, 0)
		.to('#collectedSchools, #filterBox', 1, { x: 0, ease: 'power1' }, 0);
};

var detailsAnimate = (string) => {
	gsap.set('#mainCon', { x: `${string}` + '100%' });
	//gsap.set(element, { scaleX: '0' });
	let tl = new TimelineMax({})
		.to('#mainCon', 1.1, { className: 'row active' }, 0)
		//.to(element, 1.1, { scaleX: 1, transformOrigin: 'right', ease: 'power1' }, 0);
		.to('#mainCon', 1.1, { x: 0, ease: 'power1' }, 0);
};

var relationAnimate = (string) => {
	gsap.set('#relationPhase', { x: `${string}` + '100%' });
	//gsap.set(element, { scaleX: '0' });
	let tr = new TimelineMax({})
		.to('#relationPhase', 1.1, { className: 'row active' }, 0)
		//.to(element, 1.1, { scaleX: 1, transformOrigin: 'right', ease: 'power1' }, 0);
		.to('#relationPhase', 1.1, { x: 0, ease: 'power1' }, 0);
};

function presentationAnimate(string) {
	gsap.set('#presentationPhase', { scaleX: '0', scaleY: '0' });
	//gsap.set(element, { scaleX: '0' });
	let tr = new TimelineMax({})
		.to('#presentationPhase', 1.1, { className: 'row active' }, 0)
		//.to(element, 1.1, { scaleX: 1, transformOrigin: 'right', ease: 'power1' }, 0);
		.to(
			'#presentationPhase',
			1.1,
			{ scaleX: '1', scaleY: '1', transformOrigin: 'bottom center', ease: 'power1' },
			0
		);
}
