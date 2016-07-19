import { Mongo } from 'meteor/mongo';

class UserPreferencesCollection extends Mongo.Collection {
    // If you need to perform any custom actions on the data
    // before it's actually inserted, i.e. add a 'createdAt'
    // this -> UserPreferencesCollection
    // super -> Mongo.Collection
    //
    //  i.e.:
    //  this.find(selector);
    //  super.insert(doc);
    //
    insert(doc, callback) {
        return doc;
    }

    update(selector, callback) {
        return selector;
    }

    remove(selector) {
        return selector;
    }
}

export const UserPreferences = new Mongo.Collection('UserPreferences');


if (Meteor.isClient) {
  UserPreferences.allow({
    insert(userId, doc) {
      return false;
    },

    update(userId, doc, fieldNames, modifier) {
      return false;
    },

    remove(userId, doc) {
      return false;
    }
  });

  UserPreferences.deny({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return true;
    },

    remove(userId, doc) {
      return true;
    }
  });
}
