'use strict';

var fullInfoData = [];
var selectedCommunesNames = [];
var avarageGrade = [];
var studentsAverage = [];
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

/*
* MEAN GRADE BUTTON
*/
let meanGradeBtn = document.getElementById('grades');

meanGradeBtn.addEventListener('click', () => {
	if (!gradeStatus) {
		meanGradeBtn.setAttribute('class', 'activeFilter');

		document.getElementById('slider-grades').setAttribute('class', 'delayedShow');

		gradeStatus = !gradeStatus;

		//let commune = selectedCommunesNames[0];
		fetch(
			`api/combine?commune=${selectedCommunesNames.join('_')}&year=2019&data=information:grades`
		).then((res) => {
			res.json().then((data) => {
				avarageGrade = data;
				filterData();
			});
		});
	} else {
		meanGradeBtn.setAttribute('class', 'deactiveFilter');
		document.getElementById('slider-grades').setAttribute('class', 'hidden');

		gradeStatus = !gradeStatus;
	}
});

/*
* STUDENT NUMBERS BUTTON
*/
let studentBtn = document.getElementById('students');

studentBtn.addEventListener('click', () => {
	if (!studentStatus) {
		studentBtn.setAttribute('class', 'activeFilter');

		document.getElementById('slider-students').setAttribute('class', 'delayedShow');

		studentStatus = !studentStatus;

		fetch(
			`api/combine?commune=${selectedCommunesNames.join('_')}&year=2019&data=information:students`
		).then((res) => {
			res.json().then((data) => {
				studentsAverage = data;
				filterData();
			});
		});
	} else {
		studentBtn.setAttribute('class', 'deactiveFilter');
		document.getElementById('slider-students').setAttribute('class', 'hidden');

		studentStatus = !studentStatus;
	}
});

function filterData() {
	let temp = [ ...fullInfoData ];
	markers.clearLayers();

	if (gradeStatus) {
		let min = filteringParameters.grades[0];
		let max = filteringParameters.grades[1];
		for (let s of avarageGrade) {
			let index = temp.findIndex((i) => i.NAME === s.NAME);

			if (s.mean < min || s.mean > max) {
				//remove all school that doesnt fit from temp
				if (index > 0) {
					temp.splice(index, 1);
				}
			} else {
				if (index > 0) {
					temp[index].display = true;
				} else {
					temp[index].display = false;
				}
			}
		}
	}
	if (studentStatus) {
		let min = filteringParameters.students[0];
		let max = filteringParameters.students[1];
		for (let s of studentsAverage) {
			let index = temp.findIndex((i) => i.NAME === s.NAME);

			if (s.classratio < min || s.classratio > max) {
				//remove all school that doesnt fit from temp
				if (index > 0) {
					temp.splice(index, 1);
				}
			} else {
				if (index > 0) {
					temp[index].display = true;
				} else {
					temp[index].display = false;
				}
			}
		}
	}

	updateMakers(temp);
}

function updateMakers(arr) {
	for (let s of arr) {
		if (s.display) addMarker(s);
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
