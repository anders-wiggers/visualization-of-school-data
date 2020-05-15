'use strict';

if (!filteringParameters) {
	var filteringParameters = [];
}

function filter() {
	const name = document.currentScript.getAttribute('name');
	const api = document.currentScript.getAttribute('api');
	const title = document.currentScript.getAttribute('title');
	let gColor = document.currentScript.getAttribute('gcolor');
	let gIndex = document.currentScript.getAttribute('gindex');
	let gStep = document.currentScript.getAttribute('gstep');
	let gTick = document.currentScript.getAttribute('gtick');
	let gDefault = document.currentScript.getAttribute('gdefault');
	let version = parseInt(document.currentScript.getAttribute('version'));

	if (!gDefault) {
		gDefault = [ 2, 10 ];
	} else {
		gDefault = gDefault.split`,`.map((x) => +x);
	}

	if (!gColor) {
		gColor = '#bad80a';
	}
	if (!version) {
		version = 2;
	}

	if (!gIndex) {
		gIndex = 0;
	}
	if (!gStep) {
		gStep = 1;
	}
	if (!gTick) {
		gTick = 2;
	}

	var curData = gDefault;
	filteringParameters[name] = curData;

	fetch(api).then((res) => {
		res.json().then(function(data) {
			data = data[0];
			let dataSet = [];

			if (version === 1) {
				let counter = gIndex;
				for (let d in data) {
					if (d === 'id') continue;
					dataSet.push({
						year: counter,
						value: data[d]
					});
					counter++;
				}
			}
			if (version === 2) {
				let valArray = [];
				for (let d in data) {
					let values;
					if (d === 'id') continue;
					if (d[0] === '_') {
						values = d.substr(1);
					} else {
						values = d.substr(1);
						values = `-${values}`;
					}
					valArray.push(parseInt(values));
				}
				valArray.sort(function(a, b) {
					return a - b;
				});
				for (let val of valArray) {
					let fetchVal = '';
					if (val < 0) {
						fetchVal = `m${val}`;
					} else {
						fetchVal = `_${val}`;
					}
					dataSet.push({
						year: val,
						value: data[fetchVal]
					});
				}
			}
			createElements(name);
			createSlider(dataSet);
		});
	});

	function createElements(div) {
		let outer = document.getElementById(div);
		let h2 = document.createElement('h2');
		h2.setAttribute('class', 'filterH2');
		h2.innerText = title;

		let innerDiv = document.createElement('div');
		innerDiv.setAttribute('class', 'row align-items-center');

		let widgetDiv = document.createElement('div');
		widgetDiv.setAttribute('class', 'col-sm');
		widgetDiv.setAttribute('id', 'col-sm');
		let slider = document.createElement('div');
		slider.setAttribute('id', `slider-${name}`);
		slider.setAttribute('class', `hidden`);

		let button = document.createElement('button');
		button.innerText = `Submit ${name}-data`;
		button.setAttribute('id', `button-${name}`);

		outer.appendChild(h2);
		widgetDiv.appendChild(slider);
		innerDiv.appendChild(widgetDiv);

		outer.appendChild(innerDiv);

		outer.appendChild(button);

		document.getElementById(`button-${name}`).addEventListener('click', function() {
			let xhr = new XMLHttpRequest();
			xhr.open('POST', api, true);
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			let sendData = {
				dataArray: curData
			};
			// send the collected data as JSON
			xhr.send(JSON.stringify(sendData));
		});
	}

	// Scented Widgets for meanGrade
	function createSlider(dataSet) {
		var width = 300;
		var height = 100;
		var margin = { top: 20, right: 50, bottom: 50, left: 40 };

		// create svg
		var svg = d3.select(`div#slider-${name}`).append('svg').attr('width', width).attr('height', height);

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
						.step(gStep)
						.ticks(gTick)
						.default(gDefault)
						.fill(gColor)
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
			filteringParameters[name] = curData;
			try {
				filterData();
			} catch (error) {}

			barsEnter
				.merge(bars)
				.attr('fill', (d) => (d.year < selected[0] || d.year > selected[1] ? '#e0e0e0' : '#bad80a'));
		};

		draw(gDefault);
	}
}

filter();
