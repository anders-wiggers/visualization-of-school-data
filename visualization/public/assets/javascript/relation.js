'use strict';
let charType = 'line';
let myChart;
let graphSchool = [];
let xAxis = [ 'ida', 'nymark', 'tes' ];
let yAxis = [ 20, 30, 40 ];
let dataToInsert = [];
let xAxisColor = [];

let xAxisOptions = [];
let yAxisOptions = [];

let graphYears = [ 2013, 2014, 2015, 2016, 2017, 2018, 2019 ];

function createRelationPage(list) {
	changeX();
	changeY();
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

	createChartData();

	// fetchDataPoints(() => {
	// 	drawChart();
	// });
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
			datasets: dataToInsert
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

// function fetchDataPoints() {
// 	for (let index in graphSchool) {
// 		fetch(
// 			`api/school?year=2019&school=${graphSchool[index].NAME}&commune=${graphSchool[index].COMMUNE}`
// 		).then((res) => {
// 			res.json().then((data) => {
// 				let stats = [];
// 				for (let d in data[0]) {
// 					let fetchMap = data[0];
// 					// if (fetchMap[d] !== null) {
// 					if (d === 'COMMUNE' || d === 'INFORMATION' || d === 'REGION') continue;
// 					stats.push(d);
// 					// }
// 				}
// 				graphSchool[index].stats = stats;
// 				$('#graphY').empty();
// 				$('#graphX').empty();
// 				for (let value of graphSchool[index].stats) {
// 					$('#graphY').append(`<option value=${value}>${value}</option>`);
// 					$('#graphX').append(`<option value=${value}>${value}</option>`);
// 				}
// 			});
// 		});
// 	}
// }

function changeX() {
	let x = document.getElementById('graphX').value;
	xAxis = [];

	switch (x) {
		case 'year':
			xAxis = graphYears;
			break;
		case 'grade':
			break;
	}

	drawChart();
}

function changeY() {
	let y = document.getElementById('graphY').value;
	let chartData;
	switch (y) {
		case 'year':
			let chartData = [ 2013, 2014, 2015, 2016, 2017, 2018, 2019 ];
			break;
		case 'grade':
			break;
	}

	createChartData();
}

function createChartData() {
	dataToInsert = [];

	processArray(graphSchool);
	// for (let school of graphSchool) {
	// 	let y = document.getElementById('graphY').value;
	// 	let chartData;
	// 	switch (y) {
	// 		case 'year':
	// 			chartData = graphYears;
	// 			break;
	// 		case 'grade':
	// 			fetch(`api/combine?data=grades&school=${school.NAME}&commune=${school.COMMUNE}`).then()
	// 			chartData = [ 123, 32, 21 ];
	// 			break;
	// 	}

	// 	let d = {
	// 		label: school.NAME,
	// 		data: chartData,
	// 		backgroundColor: `#${school.color}`,
	// 		borderWidth: 1
	// 	};

	// 	dataToInsert.push(d);
	// }
	drawChart();
}

let simpleArray = [];

async function processArray(array) {
	// map array to promises
	simpleArray = [];

	for (let u of array) {
		const res = await fetch(`api/combine?school=${u.NAME}&commune=${u.COMMUNE}&year=2019`);
		const data = await res.json();
		simpleArray.push(data);
	}

	// let promises = array.map((u) =>
	// 	fetch(`api/combine?school=${u.NAME}&commune=${u.COMMUNE}&year=2019`).then((res) => {
	// 		simpleArray.push(1);
	// 	})
	// );
	// await console.log(Promise.all(promises));
	// // wait until all promises are resolved
	// await Promise.all(promises);
	console.log('Done');

	for (let item of simpleArray) {
		console.log(item);
		let d = {
			label: 'test',
			data: chartData,
			backgroundColor: `#${school.color}`,
			borderWidth: 1
		};
		dataToInsert.push[d];
	}
}
