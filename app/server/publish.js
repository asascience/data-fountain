import { UserPreferences } from '/imports/startup/lib/collections/user-preferences.js';

Meteor.publish('Stations', function() {
    return Stations.find({});
});

Meteor.publish('Data', function() {
    return Data.find({});
});

Meteor.publish('Weather', function() {
    return Weather.find({});
});

Meteor.publish('UserPreferences', function() {
    return UserPreferences.find({ owner: this.userId });
});
