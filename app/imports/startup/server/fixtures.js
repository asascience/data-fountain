import StationWebService from '../../api/StationWebService';

/* M@Campbell - 05/11/2016
 *
 * We'll want to populate the Stations collection with a new list every
 * time the server restarts.
 */

const stationWebService = new StationWebService();

Meteor.startup(() => {
    stationWebService.fetchStations();
    stationWebService.fetchStationsData();
});
