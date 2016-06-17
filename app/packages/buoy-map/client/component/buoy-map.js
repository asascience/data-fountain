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

var Stats=Stations.find({}).fetch() ;

  if(Stats.length==0){
    console.log( error );
  }
  else {
  	//Map Initialization
  		var map = L.map('map').setView([37.9,-76.2574], 7);
  		// map.createPane('labels');
  		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
			maxZoom: 13,
			attribution: 'Data Fountain',
			id: 'mapbox.streets'
		}).addTo(map);

  	//Ading Stations and legend

		var legend=document.getElementById('legendTable');
  	     for(i=0;i<Stats.length;i++)
  	    // for(i=4;i>=0;i--)
           {
         			var lat=Number(Stats[i].lat);//latitude
         			var long=Number(Stats[i].lon);//longitude
         			var station_name=Stats[i].title;
         			//Adding a point
         			if(i==4)
         			{
						var row = legend.insertRow();
					    var cell1 = row.insertCell(0);
					    var cell2 = row.insertCell(1);
					    cell1.innerHTML = "<div id='orangecircle' style='height: 20px; width: 20px;'></div>";
					    cell2.innerHTML = `<span style="font-size: 20px">${station_name}</span>`;
         				L.circle([lat, long], 4500, {
						color: 'orange',
						fillColor: 'orange',
						fillOpacity: 1
						}).addTo(map);
         			}
         			else
         			{
						var row = legend.insertRow();
					    var cell1 = row.insertCell(0);
					    var cell2 = row.insertCell(1);
					    cell1.innerHTML = "<div id='blackcircle' style='height: 20px; width: 20px;'></div>";
					    cell2.innerHTML = `<span style="font-size: 22px">${station_name}</span>`;
						L.circle([lat, long], 4500, {
						color: 'black',
						fillColor: 'black',
						fillOpacity: 1
						}).addTo(map);
					}

					//ADding a Label
					 var textLatLng = [lat, long+0.2];
       				 var myTextLabel = L.marker(textLatLng, {
         			 icon: L.divIcon({
             		 className: 'text-labels',
              		 html: '<table class=tbl><tr><td>'+station_name+'</td></tr></table>'
           			 }),
           			 zIndexOffset: 1000
       				 }).addTo(map);
			}

		}
});




Template.BuoyMap.onDestroyed(() => {
});
