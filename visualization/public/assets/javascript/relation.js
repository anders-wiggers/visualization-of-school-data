'use strict';
let charType = 'line';
let myChart;
let graphSchool = [];
let xAxis = [ 'ida', 'nymark', 'tes' ];
let yAxis = [ 20, 30, 40 ];
let xAxisColor = [];

let xAxisOptions = [];
let yAxisOptions = [];

function createRelationPage(list) {
	xAxisColor = getRandomColor();
	drawChart();
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
		school.color = xAxisColor[index];
		updateButton(school, true);
		graphSchool.push(school);
	}
	fetchDataPoints(() => {
		drawChart();
	});
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
			labels: xAxis,
			datasets: [
				{
					label: '# of Votes',
					data: yAxis,
					backgroundColor: xAxisColor,
					borderWidth: 1
				}
			]
		},
		options: {
			responsive: true,
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

function chooseDataType() {}

function fetchDataPoints() {
	for (let index in graphSchool) {
		console.log(index);
		fetch(
			`api/school?year=2019&school=${graphSchool[index].NAME}&commune=${graphSchool[index].COMMUNE}`
		).then((res) => {
			res.json().then((data) => {
				console.log(data);
				for (let d in data[0]) {
					console.log(d);
				}
			});
		});
	}
	// fetch(`api/school?year=2019&school=${school}&commune=${commune}`);
}
