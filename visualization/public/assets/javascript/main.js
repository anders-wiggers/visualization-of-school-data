'use strict';

var fullInfoData = [];
var selectedCommunesNames = [];
var avarageGrade = [];
var studentsAverage = [];
var absenceAverage = [];
let filterButton = document.getElementById('filterBtn');
let filterBox = document.getElementById('filterBox');

//Global status
var gradeStatus = false;
var studentStatus = false;
var absenceStatus = false;

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
		filterData();
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
		filterData();
	}
});

/*
* ABSENCE NUMBERS BUTTON
*/
let absenceBtn = document.getElementById('absence');

absenceBtn.addEventListener('click', () => {
	if (!absenceStatus) {
		absenceBtn.setAttribute('class', 'activeFilter');

		document.getElementById('slider-absence').setAttribute('class', 'delayedShow');

		absenceStatus = !absenceStatus;

		fetch(
			`api/combine?commune=${selectedCommunesNames.join('_')}&year=2019&data=information:absence`
		).then((res) => {
			res.json().then((data) => {
				absenceAverage = data;
				filterData();
			});
		});
	} else {
		absenceBtn.setAttribute('class', 'deactiveFilter');
		document.getElementById('slider-absence').setAttribute('class', 'hidden');
		absenceStatus = !absenceStatus;
		filterData();
	}
});

function filterData() {
	let temp = [ ...fullInfoData ];
	temp.map((item) => (item.display = true));
	markers.clearLayers();

	if (gradeStatus) {
		for (let item of temp) {
			item.display = !item.display;
		}
		let min = filteringParameters.grades[0];
		let max = filteringParameters.grades[1];
		for (let s of avarageGrade) {
			let index = temp.findIndex((i) => i.NAME === s.NAME);

			if (s.mean > min && s.mean < max) {
				//remove all school that doesnt fit from temp
				if (index > 0) {
					temp[index].display = true;
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
					temp[index].display = false;
				}
			} else {
				if (index > 0) {
					if (temp[index].display === true) temp[index].display = true;
				} else {
					temp[index].display = false;
				}
			}
		}
	}
	if (absenceStatus) {
		console.log(temp);
		for (let item of temp) {
			item.display = !item.display;
		}
		let min = filteringParameters.absence[0];
		let max = filteringParameters.absence[1];
		for (let s of absenceAverage) {
			let index = temp.findIndex((i) => i.NAME === s.NAME);

			if (temp[index].display === true) {
				temp[index].display = false;
				continue;
			}

			if (s.mean * 100 > min && s.mean * 100 < max) {
				//remove all school that doesnt fit from temp
				if (index > 0) {
					temp[index].display = true;
					temp[index].e = true;
				}
			}
		}
		for (let item of temp) {
			if (item.e === false) {
				item.display = false;
			} else {
				item.e = !item.e;
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
