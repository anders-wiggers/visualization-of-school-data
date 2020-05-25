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

let yAxisValue;
let xAxisValue;

let savedCharts = [];

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
	let pal = palette('tol', relationPhaseList.length);
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
	xAxisValue = x;

	switch (x) {
		case 'year':
			charType = 'line';
			break;
		default:
			charType = 'scatter';
			break;
	}

	createChartData();
}

function changeY() {
	let y = document.getElementById('graphY').value;
	yAxisValue = y;

	createChartData();
}

function createChartData() {
	dataToInsert = [];

	if (xAxisValue === 'year') {
		xAxis = graphYears;
		processArray(graphSchool, yAxisValue);
	} else {
		xAxis = [];
		processScatter(graphSchool, xAxisValue, yAxisValue);
	}

	drawChart();
}

let simpleArray = [];

async function processArray(array, type) {
	// map array to promises
	simpleArray = [];

	simpleArray = [];
	let dataToGetY = 'mean';
	try {
		let aa = type.split('*');
		type = aa[0];
		dataToGetY = aa[1];
	} catch (error) {}

	if (type === 'year') {
		for (let u of array) {
			let data = [];

			for (let d of graphYears) {
				data.push({ mean: d });
			}

			data.color = u.color;
			data.name = u.NAME;

			simpleArray.push(data);
		}
	} else {
		for (let u of array) {
			const res = await fetch(`api/combine?school=${u.NAME}&commune=${u.COMMUNE}&data=${type}`);
			let data = await res.json();
			data.color = u.color;
			data.name = u.NAME;
			simpleArray.push(data);
		}
	}
	for (let item of simpleArray) {
		let chartData = [];
		for (let a of item) {
			chartData.push(correctlyRound(a[dataToGetY]));
		}
		let d = {
			label: item.name,
			fill: false,
			data: chartData,
			borderColor: `#${item.color}`,
			borderWidth: 4
		};
		dataToInsert.push(d);
	}
	drawChart();
}

async function processScatter(array, typeX, typeY) {
	// map array to promises
	simpleArray = [];
	let dataToGetX = 'mean';
	let dataToGetY = 'mean';

	try {
		let aa = typeX.split('*');
		typeX = aa[0];
		dataToGetX = aa[1];
	} catch (error) {}
	try {
		let aa = typeY.split('*');
		typeY = aa[0];
		dataToGetY = aa[1];
	} catch (error) {}

	for (let u of array) {
		try {
			let input = {};
			const res = await fetch(`api/combine?school=${u.NAME}&commune=${u.COMMUNE}&data=${typeX}&year=2019`);
			let dataXAxis = await res.json();
			input.x = correctlyRound(dataXAxis[0][dataToGetX]);
			const res1 = await fetch(`api/combine?school=${u.NAME}&commune=${u.COMMUNE}&data=${typeY}&year=2019`);
			let dataYAxis = await res1.json();
			input.y = correctlyRound(dataYAxis[0][dataToGetY]);

			input.color = u.color;
			input.name = u.NAME;
			simpleArray.push(input);
		} catch (error) {}
	}

	for (let item of simpleArray) {
		let d = {
			label: item.name,
			fill: false,
			data: [ { x: item.x, y: item.y } ],
			borderColor: `#${item.color}`,
			borderWidth: 4
		};
		dataToInsert.push(d);
	}
	drawChart();
}

function correctlyRound(input) {
	if (!input) {
		return null;
	}

	if (1 > input) {
		input = input * 100;
	}
	input = Math.round(input * 100) / 100;

	return input;
}

function saveChart() {
	if (document.getElementById('graphName').value === '') {
		alert('Please enter a graph name');
	} else {
		let chart = {
			name: document.getElementById('graphName').value,
			xAxis: xAxisValue,
			yAxis: yAxisValue,
			graph: myChart.toBase64Image()
		};
		savedCharts.push(chart);
		//clear items

		//Add to List
		createSavedChartList(savedCharts);

		// console.log(myChart.toBase64Image());
	}
}

function createSavedChartList(list) {
	let div = document.getElementById('savedGraphs');
	div.innerHTML = '';
	let ul = document.createElement('ul');
	ul.classList.add('com-ul');
	div.appendChild(ul);
	list.forEach((item) => {
		let li = document.createElement('li');
		li.classList.add('com-li');
		let text = document.createElement('div');
		text.innerHTML = item.name;
		text.classList.add('school-item');
		let icon = document.createElement('img');
		icon.setAttribute('src', item.graph);
		icon.classList.add('school-icon');
		let floxFix = document.createElement('div');
		floxFix.classList.add('school-list');
		floxFix.classList.add('clickable');
		floxFix.appendChild(icon);
		floxFix.appendChild(text);
		li.appendChild(floxFix);
		ul.appendChild(li);
	});
}
