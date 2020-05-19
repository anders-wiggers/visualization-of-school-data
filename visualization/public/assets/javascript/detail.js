'use strict';
let selectedSchool;
let year = 2019;

function createSchoolList(list) {
	let div = document.getElementById('selectedList');
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
			floxFix.setAttribute('onclick', `setDetailData("${item.NAME}")`);
			floxFix.classList.add('school-con');
			floxFix.classList.add('clickable');
			floxFix.appendChild(icon);
			floxFix.appendChild(text);
			li.appendChild(floxFix);
			ul.appendChild(li);
		}
	});
}
function setDetailData(school) {
	$('.collapse').collapse('hide');
	let missing = 'Data not provided';
	let index = inBounds.findIndex((i) => i.NAME === school);
	let schoolDataSet = inBounds[index];

	let nameBox = document.getElementById('schoolName');
	let totalStudents = document.getElementById('totalStudents');
	let gradeBtn = document.getElementById('gradeBtn');
	let absenceBtn = document.getElementById('absenceBtn');

	let mail = document.getElementById('mail');
	let phone = document.getElementById('phone');
	let website = document.getElementById('website');
	let adress = document.getElementById('address');

	selectedSchool = school;
	nameBox.innerHTML = schoolDataSet.NAME;
	mail.innerHTML = schoolDataSet.mail;
	phone.innerHTML = schoolDataSet.phone;
	website.innerHTML = schoolDataSet.website;
	adress.innerHTML = schoolDataSet.address;

	fetch(
		`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=grades&commune=${schoolDataSet.COMMUNE}`
	).then((res) => {
		res.json().then((data) => {
			try {
				gradeBtn.classList.remove('hidden');
				document.getElementById('avgrade').innerHTML = 'Average Grade: ';
				gradeBtn.innerHTML = Math.round((data[0].mean + Number.EPSILON) * 100) / 100;
				document.getElementById('bmean').innerHTML = Math.round((data[0].male + Number.EPSILON) * 100) / 100;
				document.getElementById('gmean').innerHTML = Math.round((data[0].female + Number.EPSILON) * 100) / 100;
				document.getElementById('over').innerHTML =
					Math.round((data[0].students_with_2 + Number.EPSILON) * 100) / 100 * 100 + '%';
			} catch (error) {
				gradeBtn.classList.add('hidden');
				document.getElementById('avgrade').innerHTML = 'Average Grade: ' + missing;
			}
		});
	});

	fetch(
		`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=students&commune=${schoolDataSet.COMMUNE}`
	).then((res) => {
		res.json().then((data) => {
			try {
				totalStudents.innerHTML = data[0].total_students;
				if (data[0].classratio !== null) document.getElementById('students2').innerHTML = data[0].classratio;
				else {
					document.getElementById('students2').innerHTML = missing;
				}
			} catch (error) {
				totalStudents.innerHTML = missing;
				document.getElementById('students2').innerHTML = missing;
			}
		});
	});

	fetch(
		`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=absence&commune=${schoolDataSet.COMMUNE}`
	).then((res) => {
		res.json().then((data) => {
			try {
				absenceBtn.classList.remove('hidden');
				document.getElementById('abs').innerHTML = 'Absence: ';
				absenceBtn.innerHTML = Math.round((data[0].mean + Number.EPSILON) * 10000) / 100 + '%';
				fetch(
					`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=absence>tenth_grade&commune=${schoolDataSet.COMMUNE}`
				).then((res) => {
					res.json().then((data) => {
						try {
							document.getElementById('tenthGrade').innerHTML =
								Math.round((data[0].mean + Number.EPSILON) * 10000) / 100 + '%';
						} catch (err) {
							document.getElementById('tenthGrade').innerHTML = missing;
						}
					});
				});
				fetch(
					`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=absence>grad_school&commune=${schoolDataSet.COMMUNE}`
				).then((res) => {
					res.json().then((data) => {
						try {
							document.getElementById('gradschool').innerHTML =
								Math.round((data[0].mean + Number.EPSILON) * 10000) / 100 + '%';
						} catch (err) {
							document.getElementById('gradschool').innerHTML = missing;
						}
					});
				});
				fetch(
					`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=absence>middle_school&commune=${schoolDataSet.COMMUNE}`
				).then((res) => {
					res.json().then((data) => {
						try {
							document.getElementById('middleschool').innerHTML =
								Math.round((data[0].mean + Number.EPSILON) * 10000) / 100 + '%';
						} catch (err) {
							document.getElementById('middleschool').innerHTML = missing;
						}
					});
				});
				fetch(
					`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=absence>preb_school&commune=${schoolDataSet.COMMUNE}`
				).then((res) => {
					res.json().then((data) => {
						try {
							document.getElementById('kinderschool').innerHTML =
								Math.round((data[0].mean + Number.EPSILON) * 10000) / 100 + '%';
						} catch (err) {
							document.getElementById('kinderschool').innerHTML = missing;
						}
					});
				});
			} catch (error) {
				absenceBtn.classList.add('hidden');
				document.getElementById('abs').innerHTML = 'Absence: ' + missing;
			}
		});
	});

	fetch(
		`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=well_being&commune=${schoolDataSet.COMMUNE}`
	).then((res) => {
		res.json().then((data) => {
			try {
				document.getElementById('wbLabel').innerHTML = round(data[0].mean, 2);
			} catch (error) {
				document.getElementById('wbLabel').innerHTML = missing;
			}
		});
	});

	fetch(
		`api/combine?school=${schoolDataSet.NAME}&year=${year}&data=planned_hours&commune=${schoolDataSet.COMMUNE}`
	).then((res) => {
		res.json().then((data) => {
			let d = data[0];
			delete d.NAME;
			delete d.YEAR;
			delete d.COMMUNE;
			delete d.id;
			let tableRef = document.getElementById('planned_hours').getElementsByTagName('tbody')[0];
			$('#planned_hours tbody tr').remove();
			for (let point in d) {
				if (d[point] === null) continue;

				// Insert a row in the table at the last row
				let newRow = tableRef.insertRow();

				// Insert a cell in the row at index 0
				let g = newRow.insertCell(0);
				let h = newRow.insertCell(0);

				// Append a text node to the cell
				let text = point.replace('_', ' ');
				text = text.charAt(0).toUpperCase() + text.slice(1);
				let hours = document.createTextNode(text);
				let grade = document.createTextNode(d[point]);

				g.appendChild(grade);
				h.appendChild(hours);
			}
		});
	});
}

function addSelected() {
	relationPhaseList.push(selectedSchool);
}

function updateYear() {
	year = document.getElementById('year').value;
	setDetailData(selectedSchool);
}

function round(number, decial) {
	let n = Math.pow(10, decial);
	return Math.round((number + Number.EPSILON) * n) / 100 + '%';
}
