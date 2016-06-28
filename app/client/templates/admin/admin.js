import swal from 'sweetalert';
import HUMPS from 'humps';

/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/
Template.Admin.events({
    'submit form': function(event,tmpl){
        event.preventDefault();

        let proximityStations = [];
        $('#proximityStations').trigger('chosen:updated');

        let result = Meteor.users.update(Meteor.userId(), {
            $set: {
                "profile.primaryStation":       $('#primaryStation').val(),
                "profile.proximityStations":    $('#proximityStations').val(),
                "profile.dataDuration":         $('#dataDuration').val(),
                "profile.refreshInterval":      $('#refreshInterval').val(),
                // "profile.temperatureUnit":   $(element).val(),
                "profile.infoTickerText":       $('#infoTickerText').val(),
                "profile.timeZone":             $('#timezoneSelect').val(),
                'profile.topPlotDataParameter': $('#topPlotDataParameter').val(),
                'profile.bottomPlotDataParameter': $('#bottomPlotDataParameter').val()
            }
        }, {multi: true});

        if (result === 1) {
            swal({
                title: 'Saved!',
                text: 'Your settings have been saved, go to the Data Fountain?',
                type: 'success',
                showCancelButton: true,
                confirmButtonText: 'Yes, please!',
                cancelButtonText: 'No thanks.',
                closeOnConfirm: true
            }, () => {
                Router.go('/');
            });
        }
    },

    'change .js-select-primary'(event, template) {
        Meteor.users.update(Meteor.userId(), {
            $set: {
                "profile.primaryStation": $('#primaryStation').val(),
            }
        });
    },

    'change .js-select-bottom-parameter'(event, template) {
        Meteor.users.update(Meteor.userId(), {
            $set: {
                'profile.bottomPlotDataParameter': $('#bottomPlotDataParameter').val()
            }
        });
    }
});

/*****************************************************************************/
/* Admin: Helpers */
/*****************************************************************************/
Template.Admin.helpers({
    primaryStationOptions: function(){
        let listOfStations = Stations.find().fetch(),
            stationNames = [];

        _.each(listOfStations, (obj) => {
            stationNames.push(obj.title);
        });

        return stationNames;
    },
    proximityStationOptions: function(){
        try {
            let filterByParameter = HUMPS.decamelize(Meteor.user().profile.bottomPlotDataParameter);

            let listOfStations = Stations.find({}).fetch(),
                stationNames = [];

            _.each(listOfStations, (obj) => {
                stationNames.push(obj.title);
            });

            return stationNames;
        } catch(e) {
            console.log(e);
        }
    },
    dataParams() {
        try {
            let dataSource = Data.findOne({title: Meteor.user().profile.primaryStation}),
                dataParams = Object.keys(dataSource.data);

            let timesIndex = dataParams.indexOf('times');
            if (timesIndex > -1) dataParams.splice(timesIndex, 1);

            return dataParams;
        } catch (exception) {
            console.log(exception);
        }
    },
    topPlotDataParameter() {
        return Meteor.user().profile.topPlotDataParameter;
    },
    bottomPlotDataParameter() {
        return Meteor.user().profile.bottomPlotDataParameter;
    },
    primaryStation() {
        return Meteor.user().profile.primaryStation;
    },
    proximityStations() {
        return Meteor.user().profile.proximityStations;
    },
    dataDuration() {
        return Meteor.user().profile.dataDuration;
    },
    refreshInterval() {
        return Meteor.user().profile.refreshInterval;
    },
    infoTickerText() {
        return Meteor.user().profile.infoTickerText;
    }
});

/*****************************************************************************/
/* Admin: Lifecycle Hooks */
/*****************************************************************************/
Template.Admin.onCreated(() => {

});

Template.Admin.onRendered(() => {
    if ( $.fn.select2 ) {
        $('#proximityStations').select2({
            theme: 'bootstrap'
        });
    }

    let userProfile = Meteor.user().profile;

    $('#primaryStation').val(userProfile.primaryStation);
    $('#proximityStations').val(userProfile.proximityStations).change();
    $('#dataDuration').val(userProfile.dataDuration);
    $('#refreshInterval').val(userProfile.refreshInterval);
    $('#topPlotDataParameter').val(userProfile.topPlotDataParameter);
    $('#bottomPlotDataParameter').val(userProfile.bottomPlotDataParameter);

});

Template.Admin.onDestroyed(() => {

});
