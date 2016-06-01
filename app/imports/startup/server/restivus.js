import { Restivus } from 'meteor/nimble:restivus';

if (Meteor.isServer) {
    let Api = new Restivus({
        useDefaultAtuh: true,
        prettyJson: true
    });

    Api.addCollection(Stations);
    Api.addCollection(Data);
}
