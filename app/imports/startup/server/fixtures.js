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

        // go and get the stations, and convert the heathen snake case to
        // glorious camel case.
        let response = HTTP.get(Meteor.settings.dataFountainUrl),
            snakeData = EJSON.fromJSONValue(response.data.stations),
            data = HUMPS.camelizeKeys(snakeData);

        // time stuff
        let currentUnix = Math.round(new Date().getTime()/1000);

        // clear out what we had:
        Stations.remove({});

        data.forEach((station) => {
            Object.assign(station, {createdAt: currentUnix});
            Stations.insert(station);
        });
    } catch (exception) {
        if (exception.response) {
            // We've caught an exception in the HTTP response, and can handle it.
            let error = {
                code: exception.response.statusCode,
                url: process.env.DATA_FOUNTAIN_URL,
                data: exception.response.data
            };

            console.log(`\r\n\tThere was a problem connecting to OceansMap.\r\n\tOceansMap connection responded with:\n\r\t\t ${EJSON.stringify(error)}\n\r\tMake sure the URL is correct, and that data is flowing.\r\n\tIf the problem persists, you'll need to call for help. The previous stations will be used if possible.`);

        } else if (exception.errno) {
            // We've caught a connection refused error, and can handle it.
            console.log(`\r\n\tWell this is embarrasing . . . it appears that our servers cannot be reached for some reason.  Please try again later: ${exception}`);

        } else {
            // We have no idea what the problem is, and can't even.
            throw new Meteor.Error('500', `Can't Even: ${exception}`);
        }
    }
});
