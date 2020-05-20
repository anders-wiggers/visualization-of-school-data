'use strict';
let charType = 'line';
let myChart;
let graphSchool = [];

function createRelationPage(list) {
	let div = document.getElementById('selectedSchoolListCon');
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
			floxFix.setAttribute('onclick', `addToGraph("${item.NAME}")`);
			floxFix.classList.add('school-list');
			floxFix.classList.add('clickable');
			floxFix.setAttribute('id', `${item.NAME.replace(/\s/g, '')}-${item.COMMUNE.replace(/\s/g, '')}`);
			floxFix.appendChild(icon);
			floxFix.appendChild(text);
			li.appendChild(floxFix);
			ul.appendChild(li);
		}
	});
}

function changeType() {
	charType = document.getElementById('graphTyper').value;
	drawChart();
}

function addToGraph(id) {
	let index = relationPhaseList.findIndex((i) => i.NAME === id);
	let school = relationPhaseList[index];
	if (graphSchool.includes(relationPhaseList[index])) {
		index = graphSchool.findIndex((i) => i.NAME === id);
		if (index > -1) {
			graphSchool.splice(index, 1);
		}
		updateButton(school, false);
	} else {
		school.color = getRandomColor()[index];
		updateButton(school, true);
		graphSchool.push(school);
	}
}

function updateButton(school, isOn) {
	let btn = document.getElementById(`${school.NAME.replace(/\s/g, '')}-${school.COMMUNE.replace(/\s/g, '')}`);
	if (isOn) btn.setAttribute('style', `background-color:#${school.color}`);
	else btn.removeAttribute('style');
}

function drawChart() {
	let ctx = document.getElementById('myChart').getContext('2d');
	try {
		myChart.destroy();
	} catch (e) {}
	myChart = new Chart(ctx, {
		type: charType,
		data: {
			labels: [ 'Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange' ],
			datasets: [
				{
					label: '# of Votes',
					data: [ 12, 19, 3, 5, 2, 3 ],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true
						}
					}
				]
			}
		}
	});
}

function getRandomColor() {
	let pal = palette('tol-rainbow', relationPhaseList.length);
	return pal;
}
