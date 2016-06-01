import { Restivus } from 'meteor/nimble:restivus';

if (Meteor.isServer) {
    let Api = new Restivus({
        useDefaultAtuh: true,
        prettyJson: true
    });

    Api.addCollection(Stations, {
        excludedEndpoints: ['getAll', 'put', 'post', 'delete']
    });
    Api.addCollection(Data, {
        excludedEndpoints: ['getAll', 'put', 'post', 'delete']
    });


    Api.addRoute('data/', {authRequired: false}, {
        get() {
            return Data.find({}).fetch();
        }
    });

    Api.addRoute('data/:id', {authRequired: false}, {
        get() {
            return Data.findOne({id: this.urlParams.id});
        }
    });

    Api.addRoute('stations', {authRequired: false}, {
        get() {
            return Stations.find({}).fetch();
        }
    });

    Api.addRoute('stations/:id', {authRequired: false}, {
        get() {
            return Stations.findOne({id: this.urlParams.id});
        }
    });
}
