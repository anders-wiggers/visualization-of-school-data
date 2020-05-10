// Now we create a map object and add a layer to it.
var map = L.map('map').setView([ 56.283, 10.491 ], 6.58); // initializes the map, sets zoom & coordinates
var osmLayer = L.tileLayer(
	'https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=523123eab9074addb51cc220ddc9df2d',
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}
).addTo(map);
var mapJSON;
fetch('kommuner.geojson')
	.then(function(response) {
		if (response.status !== 200) {
			console.log('Looks like there was a problem. Status Code: ' + response.status);
			return;
		}

		response.json().then(function(data) {
			console.log(data);
			mapJSON = data;
			console.log(mapJSON);
			geojson = L.geoJson(mapJSON, {
				weight: 0.01,
				color: 'white',
				dashArray: '',
				fillOpacity: 0.01,
				onEachFeature: onEachFeature
			}).addTo(map);
		});
	})
	.catch(function(err) {
		console.log('Fetch Error :-S', err);
	});
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '71e390',
		dashArray: '',
		fillOpacity: 0.2
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
	fetch('/api/combine?commune=' + e.target.feature.properties.KOMNAVN + '&year=2018&data=information').then(function(
		response
	) {
		response.json().then(function(data) {
			console.log(data);
			var i;
			for (i = 0; i < data.length; i++) {
				try {
					let latitude = parseFloat(data[i].latitude);
					let longitude = parseFloat(data[i].longitude);

					let popInfo =
						'<b>Information</b><br>School: ' +
						data[i].NAME +
						'<br>Adress: ' +
						data[i].address +
						'<br>Mail: ' +
						data[i].mail +
						'<br>Phone number: ' +
						data[i].phone +
						"<br><a href='data[i].website'>" +
						data[i].website +
						'</a>';
					L.marker([ latitude, longitude ]).bindPopup(popInfo).openPopup().addTo(map);
				} catch (err) {
					console.log(err);
				}
			}
		});
	});
}
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

var info = L.control();

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function(props) {
	this._div.innerHTML =
		'<h4>Vælg kommune</h4>' +
		(props ? '<b>' + props.KOMNAVN + '</b><br />' + ' Kommune ID: ' + props.KOMKODE : 'Tryk på en kommune brah');
};

info.addTo(map);
