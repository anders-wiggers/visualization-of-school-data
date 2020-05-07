fetch('/api/stats/grades').then((res) => {
	res.json().then(function(data) {
		console.log(data[0].mi_tr);
		let dataSet = [
			{ year: -3, value: data[0].mi_tr },
			{ year: -2, value: data[0].mi_tw },
			{ year: -1, value: data[0].mi_on },
			{ year: 0, value: data[0].ze },
			{ year: 1, value: data[0].one },
			{ year: 2, value: data[0].tw },
			{ year: 3, value: data[0].tr },
			{ year: 4, value: data[0].fo },
			{ year: 5, value: data[0].fi },
			{ year: 6, value: data[0].si },
			{ year: 7, value: data[0].se },
			{ year: 8, value: data[0].ei },
			{ year: 9, value: data[0].ni },
			{ year: 10, value: data[0].te },
			{ year: 11, value: data[0].el },
			{ year: 12, value: data[0].twe }
		];

		createSlider(dataSet);
	});
});

// Simple
var data = [ 0, 0.005, 0.01, 0.015, 0.02, 0.025 ];

// Step
var sliderStep = d3
	.sliderBottom()
	.min(d3.min([ 00, 02, 4, 7, 10, 12 ]))
	.max(d3.max([ 00, 02, 4, 7, 10, 12 ]))
	.width(300)
	.ticks(12)
	.step(1)
	.default([ 02, 10 ])
	.fill('#2196f3')
	.on('onchange', (val) => {
		d3.select('p#value-step').text('dickvals: ' + val);
	});

var gStep = d3
	.select('div#slider-step')
	.append('svg')
	.attr('width', 500)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');

gStep.call(sliderStep);

d3.select('p#value-step').text(d3.format('.2%')(sliderStep.value()));

// Fill
var sliderFill = d3
	.sliderBottom()
	.min(d3.min(data))
	.max(d3.max(data))
	.width(300)
	.tickFormat(d3.format('.2%'))
	.ticks(5)
	.default(0.015)
	.fill('#2196f3')
	.on('onchange', (val) => {
		d3.select('p#value-fill').text(d3.format('.2%')(val));
	});

var gFill = d3
	.select('div#slider-fill')
	.append('svg')
	.attr('width', 500)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');

gFill.call(sliderFill);

d3.select('p#value-fill').text(d3.format('.2%')(sliderFill.value()));

// Range
var sliderRange = d3
	.sliderBottom()
	.min(d3.min(data))
	.max(d3.max(data))
	.width(300)
	.tickFormat(d3.format('.2%'))
	.ticks(5)
	.default([ 0.015, 0.02 ])
	.fill('#2196f3')
	.on('onchange', (val) => {
		d3.select('p#value-range').text(val.map(d3.format('.2%')).join('-'));
	});

var gRange = d3
	.select('div#slider-range')
	.append('svg')
	.attr('width', 500)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(sliderRange.value().map(d3.format('.2%')).join('-'));

let curData;

// New York Times
function createSlider(dataSet) {
	var width = 565;
	var height = 120;
	var margin = { top: 20, right: 50, bottom: 50, left: 40 };

	// DATA SET
	var dataNewYorkTimes = d3.range(1, 41).map((d) => ({
		year: d,
		value: 10000 * Math.exp(-(d - 1) / 40)
	}));

	// create svg
	var svg = d3.select('div#slider-new-york-times').append('svg').attr('width', width).attr('height', height);

	var padding = 0.1;

	//
	var xBand = d3
		.scaleBand()
		.domain(dataSet.map((d) => d.year))
		.range([ margin.left, width - margin.right ])
		.padding(padding);

	var xLinear = d3
		.scaleLinear()
		.domain([ d3.min(dataSet, (d) => d.year), d3.max(dataSet, (d) => d.year) ])
		.range([
			margin.left + xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
			width - margin.right - xBand.bandwidth() / 2 - xBand.step() * padding - 0.5
		]);

	var y = d3
		.scaleLinear()
		.domain([ 0, d3.max(dataSet, (d) => d.value) ])
		.nice()
		.range([ height - margin.bottom, margin.top ]);

	var yAxis = (g) =>
		g
			.attr('transform', `translate(${width - margin.right},0)`)
			.call(d3.axisRight(y).tickValues([ 1e4 ]).tickFormat(d3.format('($.2s')))
			.call((g) => g.select('.domain').remove());

	var slider = (g) =>
		g
			.attr('transform', `translate(0,${height - margin.bottom})`)
			.call(
				d3
					.sliderBottom(xLinear)
					.step(1)
					.ticks(12)
					.default([ 2, 10 ])
					.fill('#bad80a')
					.on('onchange', (value) => draw(value))
			);

	var bars = svg.append('g').selectAll('rect').data(dataSet);

	var barsEnter = bars
		.enter()
		.append('rect')
		.attr('x', (d) => xBand(d.year))
		.attr('y', (d) => y(d.value))
		.attr('height', (d) => y(0) - y(d.value))
		.attr('width', xBand.bandwidth());

	svg.append('g').call(yAxis);
	svg.append('g').call(slider);

	var draw = (selected) => {
		curData = selected;
		barsEnter
			.merge(bars)
			.attr('fill', (d) => (d.year < selected[0] || d.year > selected[1] ? '#e0e0e0' : '#bad80a'));
	};

	draw([ 2, 10 ]);
}

document.getElementById('myBtn').addEventListener('click', function() {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/api/stats/grades', true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	sendData = {
		dataArray: curData
	};
	// send the collected data as JSON
	xhr.send(JSON.stringify(sendData));
});
