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
            'profile.parameterAlerts': parameterAlerts,
            'profile.saveDate': new Date()
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

    // TODO: Finish the button, and work out the payload.
    'click .js-save-prefs'(event, template) {
        try {
            Meteor.call('server/addUserPreference', payload);
        } catch(e) {
            console.log(e);
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
            try {
                let primaryStation = $('#primaryStation').val();
                let topPlotDataParameter = $('#topPlotDataParameter').val();
                Meteor.users.update(Meteor.userId(), {
                    $set: {
                        "profile.topPlotDataParameter": topPlotDataParameter,
                    }
                });

                let timeRange = Data.findOne({'title': primaryStation}, {fields: {'data': 1}});
                let data = { timeRange: {min: timeRange.data.times[0], max: timeRange.data.times[timeRange.data.times.length-1]}};

                let slider = $('input[type="rangeslide"]').data('ionRangeSlider');
                slider.update({
                    min: moment(timeRange.data[topPlotDataParameter].times[0]).format('X'),
                    max: moment(timeRange.data[topPlotDataParameter].times[timeRange.data[topPlotDataParameter].times.length-1]).format('X'),
                });

            } catch(e) {
                console.log(e);
            }
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
            if (Meteor.user().profile.bottomPlotDataParameter) {
                let filterByParameter = HUMPS.decamelize(Meteor.user().profile.bottomPlotDataParameter);

                let listOfStations = Stations.find({}).fetch(),
                    stationNames = [];

                _.each(listOfStations, (obj) => {
                    stationNames.push(obj.title);
                });

                return stationNames;
            }
        } catch(e) {
            console.log(e);
        }
    },
    dataParams() {
        try {
            if (Meteor.user() && Meteor.user().profile.primaryStation) {
                let dataSource = Data.findOne({title: Meteor.user().profile.primaryStation}),
                    dataParams = Object.keys(dataSource.data);

                let timesIndex = dataParams.indexOf('times');
                if (timesIndex > -1) dataParams.splice(timesIndex, 1);

                return dataParams;
            }
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
        if (!Meteor.user().profile.refreshInterval)
            return 2;
        return Meteor.user().profile.refreshInterval;
    },
    infoTickerText() {
        return Meteor.user().profile.infoTickerText;
    }
});

/*****************************************************************************/
/* Admin: Lifecycle Hooks */
/*****************************************************************************/
Template.Admin.onCreated(function() {
    let data = {};
    data.timeRange = {
        min: +moment().subtract(1, "years").format("X"),
        max: +moment().format("X")
    };
    Session.set('data', data);
});

Template.Admin.onRendered(function() {
    let data = Session.get('data');
    let $slider = $('input[type="rangeslide"]');

    let saveTimeRange = ((data) => {
        Meteor.users.update(Meteor.userId(), {
            $set: {
                'profile.dataStart': data.fromNumber,
                'profile.dataEnd': data.toNumber

            }
        });
    });

    Meteor.setTimeout(() => {
        $slider.ionRangeSlider({
            type: 'datetime',
            min: data.timeRange.min,
            max: data.timeRange.max,
            prettify: function (num) {
                return moment(num, "X").format("LL");
            },
            onFinish: saveTimeRange

        });

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
