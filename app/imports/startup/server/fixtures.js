import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import humps from 'humps';

/* M@Campbell - 05/11/2016
 *
 * We'll want to populate the Stations collection with a new list every
 * time the server restarts.
 */

Meteor.startup(() => {
    try {
        const HUMPS = require('humps');

        // time stuff
        let currentUnix = Math.round(new Date().getTime()/1000);

        // clear out what we had:
        Stations.remove({});

        // go and get the stations, and convert the heathen snake case to
        // glorious camel case.
        let response = HTTP.get(process.env.DATA_FOUNTAIN_URL),
            snakeData = EJSON.fromJSONValue(response.data.stations),
            data = HUMPS.camelizeKeys(snakeData);

        data.forEach((station) => {
            Object.assign(station, {createdAt: currentUnix});
            Stations.insert(station);
        });
    } catch (exception) {
        let error = {
            code: exception.response.statusCode,
            url: process.env.DATA_FOUNTAIN_URL,
            data: exception.response.data
        };

        throw new Meteor.Error('500', `\r\n\tThe server has thrown a 500 error, this is because there was a problem connecting to OceansMap.\r\n\tOceansMap connection responded with:\n\r\t\t ${EJSON.stringify(error)}\n\r\tMake sure the URL is correct, and that data is flowing.\r\n\tIf the problem persists, you'll need to call for help.`);
    }
});
