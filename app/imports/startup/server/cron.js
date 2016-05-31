import StationWebService from '../../api/StationWebService';

const stationWebService = new StationWebService();

SyncedCron.add({
    name: `Fetch data for all the stations ${Meteor.settings.refreshTheData}`,
    schedule(parser) {
        return parser.text(Meteor.settings.refreshTheData);
    },
    job() {
        stationWebService.getStations();
        stationWebService.getStationsData();
    }
});
SyncedCron.start();
