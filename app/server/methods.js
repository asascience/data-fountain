import { UserPreferences } from '/imports/startup/lib/collections/user-preferences.js';
/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/
Meteor.methods({
    'server/addUserPreference': function(doc) {
        let docId = UserPreferences.insert({profile: {}, owner: this.userId});
        console.log(docId, this.userId);
        return UserPreferences.update(docId, {$set: doc});
    },
    'server/removeUserPreference': function(docId) {
        if (typeof(docId) === String) {
            return UserPreferences.remove(docId);
        };
    }
});
