/*****************************************************************************/
/* BuoyMap: Event Handlers */
/*****************************************************************************/
Template.BuoyMap.events({
    /*'click #legendTable tr'(event, target){

        //When the legend is clicked, update the user's primary station to the one clicked.

        let stationName = $(event.target).text() || $(event.target).find('span').text();
        Meteor.users.update(Meteor.userId(), {
        $set: {'profile.primaryStation': stationName}
        }, {multi:true});
        }*/
});

/*****************************************************************************/
/* BuoyMap: Helpers */
/*****************************************************************************/
Template.BuoyMap.helpers({
    imageName(){
        return Meteor.user().profile.primaryStation.replace(/\s/g,'');
    }
});

/*****************************************************************************/
/* BuoyMap: Lifecycle Hooks */
/*****************************************************************************/
Template.BuoyMap.onCreated(function(){
});

Template.BuoyMap.onRendered(function(){
    try {
        let proximityStations = Meteor.user().profile.proximityStations;
        let stations = Stations.find({'title': {$in: proximityStations}}).fetch(),
            primaryStation = Stations.findOne({title: Meteor.user().profile.primaryStation});



        //Map Initialization
        let map = L.map('map').setView([primaryStation.lat,primaryStation.lon], 8);
        // map.createPane('labels');
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
            maxZoom: 13,
            attribution: 'Data Fountain',
            id: 'mapbox.streets'
        }).addTo(map);


        for(i=0;i<stations.length;i++)
        {
            let lat=Number(stations[i].lat);//latitude
            let long=Number(stations[i].lon);//longitude
            let stationName = stations[i].title;
            if (stationName !== primaryStation.title) {
                //Adding a point
                L.circle([lat, long], 4500, {
                    color: 'black',
                    fillColor: 'black',
                    fillOpacity: 1
                }).addTo(map);

                //Adding a Label
                let textLatLng = [lat, long+0.2];
                let myTextLabel = L.marker(textLatLng, {
                    icon: L.divIcon({
                        className: 'text-labels',
                        html: '<table class=tbl><tr><td>'+stationName+'</td></tr></table>'
                    }),
                    zIndexOffset: 1000
                }).addTo(map);
            } else {
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
        }


    } catch(exception) {
        console.log(exception);
    }
});




Template.BuoyMap.onDestroyed(function(){
});
