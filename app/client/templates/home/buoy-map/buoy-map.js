/*****************************************************************************/
/* BuoyMap: Event Handlers */
/*****************************************************************************/
Template.BuoyMap.events({	
});

/*****************************************************************************/
/* BuoyMap: Helpers */
/*****************************************************************************/
Template.BuoyMap.helpers({
});

/*****************************************************************************/
/* BuoyMap: Lifecycle Hooks */
/*****************************************************************************/
Template.BuoyMap.onCreated(() => {   
});

Template.BuoyMap.onRendered(() => {	
	var map = L.map('map').setView([37.5672, -76.2574], 6);
	
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
			maxZoom: 13,
			attribution: 'Data Fountain',
			id: 'mapbox.streets'
		}).addTo(map);
		
		L.circle([38.5563, -76.4147], 500, {
			color: 'red',
			fillColor: 'red',
			fillOpacity: 1
		}).addTo(map).bindPopup("Goose Reef");
		
		L.circle([36.8455, -76.298], 500, {
			color: 'black',
			fillColor: 'black',
			fillOpacity: 1
		}).addTo(map).bindPopup("Norfolk");
		
		L.circle([36.9631, -76.4475], 500, {
			color: 'black',
			fillColor: 'black',
			fillOpacity: 1
		}).addTo(map).bindPopup("Annapolis");
		
		L.circle([37.5672, -76.2574], 500, {
			color: 'black',
			fillColor: 'black',
			fillOpacity: 1
		}).addTo(map).bindPopup("Stingray Point");

		
		L.circle([39.5404, -76.0736], 500, {
			color: 'black',
			fillColor: 'black',
			fillOpacity: 1
		}).addTo(map).bindPopup("Susquehanna");	
		
		
		
		
});

Template.BuoyMap.onDestroyed(() => {
});
