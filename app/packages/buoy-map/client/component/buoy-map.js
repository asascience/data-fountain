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
    let proximityStations = Meteor.user().profile.proximityStations;
    let stations = Stations.find({'title': {$in: proximityStations}}).fetch(),
        primaryStation = Stations.findOne({title: Meteor.user().profile.primaryStation});


    if(stations.length==0){
        console.log( error );
    }
    else {
        //Map Initialization
        let map = L.map('map').setView([37.9,-76.2574], 7);
        // map.createPane('labels');
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 13,
            attribution: 'Data Fountain',
            id: 'mapbox.streets'
        }).addTo(map);

        //Ading Stations and legend

        let legend=document.getElementById('legendTable');
        for(i=0;i<stations.length;i++)
        {
            let lat=Number(stations[i].lat);//latitude
            let long=Number(stations[i].lon);//longitude
            let stationName = stations[i].title;
            //Adding a point
            let row = legend.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.innerHTML = "<div id='blackcircle' style='height: 20px; width: 20px;'></div>";
            cell2.innerHTML = `<span style="font-size: 26px">${stationName}</span>`;
            L.circle([lat, long], 4500, {
                color: 'black',
                fillColor: 'black',
                fillOpacity: 1
            }).addTo(map);

            //ADding a Label
            let textLatLng = [lat, long+0.2];
            let myTextLabel = L.marker(textLatLng, {
                icon: L.divIcon({
                    className: 'text-labels',
                    html: '<table class=tbl><tr><td>'+stationName+'</td></tr></table>'
                }),
                zIndexOffset: 1000
            }).addTo(map);
        }

        let row = legend.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = "<div id='orangecircle' style='height: 20px; width: 20px;'></div>";
        cell2.innerHTML = `<span style="font-size: 26px">${primaryStation.title}</span>`;
        L.circle([primaryStation.lat, primaryStation.lon], 4500, {
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 1
        }).addTo(map);


        let textLatLng = [primaryStation.lat, primaryStation.lon+0.2];
        let myTextLabel = L.marker(textLatLng, {
            icon: L.divIcon({
                className: 'text-labels',
                html: '<table class=tbl><tr><td>'+primaryStation.title+'</td></tr></table>'
            }),
            zIndexOffset: 1000
        }).addTo(map);

    }
});




Template.BuoyMap.onDestroyed(() => {
});
