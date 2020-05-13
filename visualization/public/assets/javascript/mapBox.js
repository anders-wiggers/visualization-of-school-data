// Now we create a map object and add a layer to it.
var map = new L.Map('map');
var osmUrl = 'https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=523123eab9074addb51cc220ddc9df2d';
var osm = new L.TileLayer(osmUrl, { minZoom: 5, maxZoom: 18 });

map.addLayer(osm);
map.setView(new L.LatLng(56.283, 10.491), 6.58);

var osm2 = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 13 });
var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

var mapJSON;
var inBounds = [];
var myLayer = new L.LayerGroup().addTo(map);
var markers = myLayer.addTo(new L.markerClusterGroup());
var schoolIcon = L.icon({
	iconUrl: '/assets/pictures/monuments.png',
	iconSize: [ 30, 40 ]
});

fetch('/assets/geojson/kommuner.geojson')
	.then(function(response) {
		if (response.status !== 200) {
			console.log('Looks like there was a problem. Status Code: ' + response.status);
			return;
		}

		response.json().then(function(data) {
			mapJSON = data;
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
		weight: 1,
		color: 'red'
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
	selectedCommunes.push(e.target.feature.properties.KOMNAVN);
	markers.clearLayers();
	contained = [];
	map.fitBounds(e.target.getBounds());
	fetch('/api/combine?commune=' + e.target.feature.properties.KOMNAVN + '&year=2019&data=information').then(function(
		response
	) {
		response.json().then(function(data) {
			fullInfoData = data;
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
					let marker = L.marker([ latitude, longitude ], { icon: schoolIcon, title: data[i].NAME })
						.bindPopup(popInfo)
						.openPopup();
					markers.addLayer(marker);
					this.map.addLayer(markers);
				} catch (err) {
					console.log(err);
				}
			}
			map.on('moveend', function() {
				inBounds = [];
				var bounds = map.getBounds();
				myLayer.eachLayer(function(marker) {
					if (bounds.contains(marker.getLatLng())) {
						inBounds.push(marker.options.title);
					}
				});
				addMarkerToList(inBounds);
			});
		});
	});
}

function addMarkerToList(list) {
	clearList();
	ul = document.createElement('ul');
	document.getElementById('mapLi').appendChild(ul);
	list.forEach(function(item) {
		let li = document.createElement('li');
		console.log(list.length);
		ul.appendChild(li);
		li.innerHTML += item;
	});
}

function clearList() {
	$(document.getElementById('mapLi')).empty();
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
