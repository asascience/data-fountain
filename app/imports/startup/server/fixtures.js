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
});
