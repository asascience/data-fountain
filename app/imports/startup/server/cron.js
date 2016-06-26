import StationWebService from '../../api/StationWebService';

const stationWebService = new StationWebService();

SyncedCron.add({
    name: `Fetch data for all the stations ${Meteor.settings.refreshTheData}`,
    schedule(parser) {
        return parser.text(Meteor.settings.refreshTheData);
    },
    job() {
        let stations = Stations.find({}).fetch();
        if (stations.length === 0) {
            stationWebService.fetchStations();
        }

        stationWebService.fetchStationsData();
    }
});

SyncedCron.add({
    name: `Fetch the forcast ${Meteor.settings.refreshTheData}`,
    schedule(parser) {
        return parser.text(Meteor.settings.refreshTheData);
    },
    job() {
        stationWebService.fetchWeatherForecast();
    }
});
SyncedCron.start();
