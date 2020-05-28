// Now we create a map object and add a layer to it.
var map = new L.Map('map', { zoomControl: false });
var osmUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var osm = new L.TileLayer(osmUrl, { minZoom: 6.9, maxZoom: 18 });
//Adding map, plus zoom of denmark
map.addLayer(osm);
map.setView(new L.LatLng(56.283, 10.491), 6.9);
// Initializing mini map
var osm2 = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 13 });
var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);
var boundArraySecond = [];
var queryArray = [];
var allCommuneObjects = [];
var selectedCommunes = [];
var stylingCommune = [];
var selectedCommunesNames = [];
var nameOfAllCommunes = [];
let boundArray = [];
let selectMultiple = false;
var mapJSON;
var inc = 0;
var lastElement;
var geojson;
var noHighlight = '#EE3377';
var highlight = '#0077BB';
var inBounds = [];
var markers = new L.markerClusterGroup({
	showCoverageOnHover: false
});
var myLayer = new L.LayerGroup().addTo(map);
//var markers = myLayer.addTo(new L.markerClusterGroup());
var schoolIcon = L.icon({
	iconUrl: '/assets/pictures/school.svg',
	iconSize: [ 30, 40 ]
});

fetch('/assets/geojson/kommuner.geojson')
	.then(function(response) {
		if (response.status !== 200) {
			console.log('Looks like there was a problem. Status Code: ' + response.status);
			return;
		}

		response.json().then(function(data) {
			for (var i = 0; i < data.features.length; i++) {
				if (nameOfAllCommunes.includes(data.features[i].properties.KOMNAVN) === false) {
					nameOfAllCommunes.push(data.features[i].properties.KOMNAVN);
				}
			}
			mapJSON = data;
			geojson = L.geoJson(mapJSON, {
				weight: 1.5,
				fillColor: 'white',
				fillOpacity: '0.01',
				color: highlight,
				onEachFeature: onEachFeature
			}).addTo(map);
		});
	})
	.catch(function(err) {
		console.log('Fetch Error :-S', err);
	});

function highlightFeature(e) {
	if (currentPhase === 0) {
		for (var s in geojson._layers) {
			if (e.target.feature.properties.KOMNAVN === geojson._layers[s].feature.properties.KOMNAVN) {
				object = geojson._layers[s];
				object.setStyle({
					weight: 1.5,
					fillColor: highlight,
					fillOpacity: '0.5',
					color: highlight
				});
			}
		}
		var layer = e.target;

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
		info.update(layer.feature.properties);
	}
}

function drawOnMap(input) {
	for (var i in geojson._layers) {
		if (input === geojson._layers[i].feature.properties.KOMNAVN) {
			var object = geojson._layers[i];
			var layer = object;
			layer.setStyle({
				weight: 1.5,
				color: highlight
			});
			selectedCommunes.push(object);
		}
	}
}

function resetHighlight(e) {
	if (currentPhase === 0) {
		if (selectedCommunesNames.includes(e.target.feature.properties.KOMNAVN) === true) {
		} else {
			for (var s in geojson._layers) {
				if (e.target.feature.properties.KOMNAVN === geojson._layers[s].feature.properties.KOMNAVN) {
					var object = geojson._layers[s];
					object.setStyle({
						weight: 1.5,
						fillColor: 'white',
						fillOpacity: '0.01',
						color: highlight
					});
				}
			}
			info.update();
		}
	}
}

function addMarkerToList(list) {
	clearList();
	ul = document.createElement('ul');
	document.getElementById('mapLi').appendChild(ul);
	list.forEach(function(item) {
		let li = document.createElement('li');
		ul.appendChild(li);
		li.innerHTML += item;
	});
}
function addKommunesToList(list) {
	clearKommunes();
	ul = document.createElement('ul');
	ul.classList.add('com-ul');
	document.getElementById('kommunes').appendChild(ul);
	list.forEach(function(item) {
		let li = document.createElement('li');
		li.classList.add('com-li');
		let text = document.createElement('div');
		text.innerHTML = item;
		text.classList.add('com-item');
		let close = document.createElement('div');
		close.classList.add('com-close');
		close.innerHTML = 'x';
		let floxFix = document.createElement('div');
		floxFix.classList.add('fix');
		floxFix.appendChild(text);
		floxFix.appendChild(close);
		li.appendChild(floxFix);
		ul.appendChild(li);
	});
	gsap.fromTo(
		'.fix',
		1,
		{ opacity: 0, backgroundColor: '#2bd82b', borderRadius: '5px', marginBottom: '5px' },
		{ opacity: 1, backgroundColor: '#fafafa', borderRadius: '5px', marginBottom: '5px' }
	);
}
function clearList() {
	$(document.getElementById('mapLi')).empty();
}
function clearKommunes() {
	$(document.getElementById('kommunes')).empty();
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: determineWhatHappensOnClick
	});
}

function determineWhatHappensOnClick(e) {
	if (currentPhase === 0) {
		for (var k in geojson._layers) {
			//Check for duplicates in allCommuneObject array
			if (allCommuneObjects.includes(geojson._layers[k].feature.properties.KOMNAVN) === false) {
				allCommuneObjects.push(geojson._layers[k]);
				//If the mouseOver target has multiple layers, draw them all
				if (e.target.feature.properties.KOMNAVN === geojson._layers[k].feature.properties.KOMNAVN) {
					selectedCommunes.push(geojson._layers[k]);
					object = geojson._layers[k];
					object.setStyle({
						weight: 1.5,
						color: highlight
					});
				}
			}
		}
		if (selectedCommunesNames.includes(e.target.feature.properties.KOMNAVN) === false) {
			selectedCommunesNames.push(e.target.feature.properties.KOMNAVN);
			addKommunesToList(selectedCommunesNames);
		} else {
			for (var k of selectedCommunes) {
				if (k.feature.properties.KOMNAVN === e.target.feature.properties.KOMNAVN) {
					console.log('k' + k.feature.properties.KOMNAVN);
					selectedCommunes = selectedCommunes.filter(function(item) {
						return item.feature.properties.KOMNAVN != k.feature.properties.KOMNAVN;
					});
				}
			}
			selectedCommunesNames.splice(selectedCommunesNames.indexOf(e.target.feature.properties.KOMNAVN), 1);
			addKommunesToList(selectedCommunesNames);
			for (var s in geojson._layers) {
				if (e.target.feature.properties.KOMNAVN === geojson._layers[s].feature.properties.KOMNAVN) {
					object = geojson._layers[s];
					object.setStyle({
						weight: 0.01,
						color: 'white'
					});
					markers.clearLayers();
				}
			}
		}
	}
}

var info = L.control({ position: 'topleft' });

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function(props) {
	this._div.innerHTML =
		'<h4>Select a commune</h4>' +
		(props ? '<b>' + props.KOMNAVN + '</b><br />' : 'You can press any commune on the map');
};

info.addTo(map);

var clearStyles = () => {
	for (var s of allCommuneObjects) {
		if (selectedCommunes.includes(s)) {
			s.setStyle({
				weight: 3,
				fillColor: 'white',
				fillOpacity: '0.01',
				color: highlight
			});
		} else {
			s.setStyle({
				weight: 0.01,
				fillColor: 'white',
				fillOpacity: '0.01',
				color: 'red'
			});
		}
	}
};

var recreateStyles = () => {
	for (var s of allCommuneObjects) {
		if (selectedCommunes.includes(s)) {
			s.setStyle({
				weight: 1.5,
				fillColor: highlight,
				fillOpacity: '0.5',
				color: highlight
			});
		} else {
			s.setStyle({
				weight: 1.5,
				fillColor: 'white',
				fillOpacity: '0.01',
				color: highlight
			});
		}
	}
};

document.getElementById('markerButton').onclick = function(e) {
	clearStyles();
	$('#filter').trigger('click');
};

/* 
document.getElementById('filterClick').onclick = function(e) {
	console.log('previous clicked');
	recreateStyles();
	$('#overview').trigger('click');
}; */

function fetchMarkersAndPlaceOnMap() {
	markers.clearLayers();
	contained = [];
	if (selectedCommunes.length === 0) {
		markers.clearLayers();
		map.setView([ 56.283, 10.491 ], 6.58);
		boundArray = [];
	} else {
		for (var j in selectedCommunes) {
			boundArray.push(selectedCommunes[j]);
			var group = new L.featureGroup(boundArray);
			map.fitBounds(group.getBounds());
		}
		fetch('/api/combine?commune=' + selectedCommunesNames.join('_') + '&year=2019&data=information').then(function(
			response
		) {
			response.json().then(function(data) {
				fullInfoData = data;
				filterData();
			});
		});
	}
}

function fetchAllMarkersAndPlaceOnMap(callback) {
	markers.clearLayers();
	contained = [];
	fetch('/api/combine?commune=&year=2019&data=information').then(function(response) {
		response.json().then(function(data) {
			fullInfoData = data;
			filterData();
			if (callback) callback();
		});
	});
}
