'use strict';

var fullInfoData = [];
var selectedCommunesNames = [];
var avarageGrade = [];
var studentsAverage = [];
var absenceAverage = [];
var wbAverage = [];
var competenceAverage = [];
let filterButton = document.getElementById('filterBtn');
let filterBox = document.getElementById('filterBox');
var relationPhaseList = [];

//Global status
var gradeStatus = false;
var studentStatus = false;
var absenceStatus = false;
var wellbeingStatus = false;
var competenceStatus = false;

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

/*
* WELL BEING BUTTON
*/
let wbBtn = document.getElementById('well_being');

wbBtn.addEventListener('click', () => {
	if (!wellbeingStatus) {
		wbBtn.setAttribute('class', 'activeFilter');

		document.getElementById(`slider-well_being`).setAttribute('class', 'delayedShow');

		wellbeingStatus = !wellbeingStatus;

		fetch(
			`api/combine?commune=${selectedCommunesNames.join('_')}&year=2019&data=information:well_being`
		).then((res) => {
			res.json().then((data) => {
				wbAverage = data;
				filterData();
			});
		});
	} else {
		wbBtn.setAttribute('class', 'deactiveFilter');
		document.getElementById(`slider-well_being`).setAttribute('class', 'hidden');
		wellbeingStatus = !wellbeingStatus;
		filterData();
	}
});

/*
* COMPETENCE BUTTON
*/
let competenceBtn = document.getElementById('competence');

competenceBtn.addEventListener('click', () => {
	if (!competenceStatus) {
		competenceBtn.setAttribute('class', 'activeFilter');

		document.getElementById(`slider-competence`).setAttribute('class', 'delayedShow');

		competenceStatus = !competenceStatus;

		fetch(
			`api/combine?commune=${selectedCommunesNames.join('_')}&year=2019&data=information:competence_coverage`
		).then((res) => {
			res.json().then((data) => {
				competenceAverage = data;
				filterData();
			});
		});
	} else {
		competenceBtn.setAttribute('class', 'deactiveFilter');
		document.getElementById(`slider-competence`).setAttribute('class', 'hidden');
		competenceStatus = !competenceStatus;
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
		for (let item of temp) {
			item.display = !item.display;
		}
		let min = filteringParameters.students[0];
		let max = filteringParameters.students[1];
		for (let s of studentsAverage) {
			let index = temp.findIndex((i) => i.NAME === s.NAME);

			if (temp[index].display === true) {
				temp[index].display = false;
				continue;
			}

			if (s.classratio > min && s.classratio < max) {
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
	if (absenceStatus) {
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
	if (wellbeingStatus) {
		for (let item of temp) {
			item.display = !item.display;
		}
		let min = filteringParameters.well_being[0];
		let max = filteringParameters.well_being[1];
		for (let s of wbAverage) {
			let index = temp.findIndex((i) => i.NAME === s.NAME);

			if (temp[index].display === true) {
				temp[index].display = false;
				continue;
			}

			if (s.mean > min && s.mean < max) {
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

	if (competenceStatus) {
		for (let item of temp) {
			item.display = !item.display;
		}
		let min = filteringParameters.competence[0];
		let max = filteringParameters.competence[1];
		for (let s of competenceAverage) {
			let index = temp.findIndex((i) => i.NAME === s.NAME);

			if (temp[index].display === true) {
				temp[index].display = false;
				continue;
			}

			if (s.COMPETENCE_COVERAGE * 100 > min && s.COMPETENCE_COVERAGE * 100 < max) {
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
	//inBounds = [ ...temp ];
	addSchoolToList(temp);
	updateMakers(temp);
}

function updateMakers(arr) {
	for (let s of arr) {
		if (s.display) {
			addMarker(s);
		}
	}
}

function addSchoolToList(list) {
	let div = document.getElementById('schoolContainer');
	div.innerHTML = '';
	let ul = document.createElement('ul');
	ul.classList.add('com-ul');
	div.appendChild(ul);
	list.forEach(function(item) {
		if (item.display) {
			let li = document.createElement('li');
			li.classList.add('com-li');
			let text = document.createElement('div');
			text.innerHTML = item.NAME;
			text.classList.add('school-item');
			let icon = document.createElement('img');
			icon.setAttribute('src', 'assets/pictures/school.svg');
			icon.classList.add('school-icon');
			let floxFix = document.createElement('div');
			floxFix.classList.add('school-con');
			floxFix.appendChild(icon);
			floxFix.appendChild(text);
			li.appendChild(floxFix);
			ul.appendChild(li);
		}
	});
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
