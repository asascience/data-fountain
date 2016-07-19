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

        let parameterAlerts = {
            lowAlert: $('#lowAlert').val(),
            midAlert: $('#midAlert').val(),
            highAlert: $('#highAlert').val()
        };

        let payload = {
            "profile.primaryStation":       $('#primaryStation').val(),
            "profile.proximityStations":    $('#proximityStations').val(),
            "profile.dataDuration":         $('#dataDuration').val(),
            "profile.refreshInterval":      $('#refreshInterval').val(),
            // "profile.temperatureUnit":   $(element).val(),
            "profile.infoTickerText":       $('#infoTickerText').val(),
            "profile.timeZone":             $('#timezoneSelect').val(),
            'profile.topPlotDataParameter': $('#topPlotDataParameter').val(),
            'profile.bottomPlotDataParameter': $('#bottomPlotDataParameter').val(),
            'profile.parameterAlerts': parameterAlerts
        };

        let result = Meteor.users.update(Meteor.userId(), {
            $set: payload
        }, {multi: true});


        if (result === 1) {
            Meteor.call('server/addUserPreference', payload);

            swal({
                title: 'Saved!',
                text: 'Your settings have been saved, go to the Data Fountain? To get back here, press Ctrl-D.',
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

        $('.js-top-plot-param').trigger('change');
    },

    'change .js-top-plot-param'(event, template) {
        Meteor.setTimeout(() => {
            Meteor.users.update(Meteor.userId(), {
                $set: {
                    "profile.topPlotDataParameter": $('#topPlotDataParameter').val(),
                }
            });
        }, 500);
    },

    'change .js-select-bottom-parameter'(event, template) {
        let parameter = $('#bottomPlotDataParameter').val();
        let dataSet = Data.findOne({title: Meteor.user().profile.primaryStation}, {fields: {data: 1}});
        let unit = dataSet.data[parameter].units;
        $('#paramUnit').val(unit);

        Meteor.users.update(Meteor.userId(), {
            $set: {
                'profile.bottomPlotDataParameter': parameter,
                'profile.parameterAlerts.unit': unit
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
        return Meteor.user().profile.refreshInterval || 2;
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
    Meteor.setTimeout(() => {
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
        $('#lowAlert').val(userProfile.parameterAlerts.lowAlert);
        $('#midAlert').val(userProfile.parameterAlerts.midAlert);
        $('#highAlert').val(userProfile.parameterAlerts.highAlert);
        $('#paramUnit').val(userProfile.parameterAlerts.unit);
    }, 500);

});

Template.Admin.onDestroyed(() => {

});
