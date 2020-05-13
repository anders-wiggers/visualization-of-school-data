'use strict';

var fullInfoData = [];
var selectedCommunes = [];
var avarageGrade = [];
let filterButton = document.getElementById('filterBtn');
let filterBox = document.getElementById('filterBox');

//Global status
var gradeStatus = false;
var studentStatus = false;

filterButton.addEventListener('click', () => {
	if (filterBox.getAttribute('class') === 'visible') {
		filterBox.setAttribute('class', 'hidden');
	} else {
		filterBox.setAttribute('class', 'visible');
	}
});

let meanGradeBtn = document.getElementById('grades');

meanGradeBtn.addEventListener('click', () => {
	if (!gradeStatus) {
		meanGradeBtn.setAttribute('class', 'activeFilter');

		document.getElementById('slider-grades').setAttribute('class', 'delayedShow');

		gradeStatus = !gradeStatus;

		let commune = selectedCommunes[0];
		fetch(`api/combine?commune=${commune}&year=2019&data=information:grades`).then((res) => {
			res.json().then((data) => {
				avarageGrade = data;
				filterData();
			});
		});
	} else {
		meanGradeBtn.setAttribute('class', 'deactiveFilter');
		document.getElementById('slider-grades').setAttribute('class', 'hidden');
		for (let s of fullInfoData) {
			addMarker(s);
		}

		gradeStatus = !gradeStatus;
	}
});

let studentBtn = document.getElementById('students');

studentBtn.addEventListener('click', () => {
	if (!studentStatus) {
		studentBtn.setAttribute('class', 'activeFilter');

		document.getElementById('slider-students').setAttribute('class', 'delayedShow');

		studentStatus = !studentStatus;
	} else {
		studentBtn.setAttribute('class', 'deactiveFilter');
		document.getElementById('slider-students').setAttribute('class', 'hidden');

		studentStatus = !studentStatus;
	}
});

function filterData() {
	if (gradeStatus) {
		let SchoolsToShow = [];
		let AllSchools = inBounds;
		let na = [];
		let min = filteringParameters.grades[0];
		let max = filteringParameters.grades[1];
		for (let s of avarageGrade) {
			if (s.mean > min && s.mean < max) {
				SchoolsToShow.push(s);
			}
		}
		markers.clearLayers();
		for (let s of SchoolsToShow) {
			addMarker(s);
		}

		for (let s of AllSchools) {
		}
	}
	if (studentStatus) {
		console.log('filter students');
	}
}

function addMarker(s) {
	let latitude = parseFloat(s.latitude);
	let longitude = parseFloat(s.longitude);
	try {
		let popInfo =
			'<b>Information</b><br>School: ' +
			s.NAME +
			'<br>Adress: ' +
			s.address +
			'<br>Mail: ' +
			s.mail +
			'<br>Phone number: ' +
			s.phone +
			"<br><a href='data[i].website'>" +
			s.website +
			'</a>';
		let marker = L.marker([ latitude, longitude ], { icon: schoolIcon, title: s.NAME })
			.bindPopup(popInfo)
			.openPopup();
		markers.addLayer(marker);
		map.addLayer(markers);
	} catch (err) {}
}
