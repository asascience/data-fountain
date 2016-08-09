import swal from 'sweetalert';
import HUMPS from 'humps';

/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/
Template.Admin.events({
    'submit form': function(event,tmpl){
        event.preventDefault();

        $('#proximityStations').trigger('chosen:updated');

        let parameterAlerts = {
            lowAlert: $('#lowAlert').val(),
            midAlert: $('#midAlert').val(),
            highAlert: $('#highAlert').val()
        };
        let viewMode = $('.singleStation').hasClass('active') ? 'single' : 'multiple'; 


        //Make sure that the proximity stations contains the primary station.
        let primaryStation = $('#primaryStation').val();
        let proximityStations = $('#proximityStations').val();
        if(proximityStations === null){
            proximityStations = primaryStation;
        }else if(proximityStations.indexOf(primaryStation) === -1){
            proximityStations.push(primaryStation);
        }
        
        let payload = {
            "profile.stationViewMode":      viewMode, 
            "profile.singleStationParameters": $('#stationParameters').val(),
            "profile.primaryStation":       primaryStation,
            "profile.proximityStations":    proximityStations,
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
    
    'click .stationDataViewOption'(event, template){
        
        //Change which button is active
        $('.stationDataViewOption').removeClass("active");
        $(event.target).addClass('active');
    
        //Update the inputs
        if($(event.target).hasClass("singleStation")){
            //Get rid of the Proximity Stations, Bar Plot and Line Plot Inputs
            $('.js-select-bottom-parameter').parent().parent().hide();
            $('#proximityStations').parent().parent().hide();
            $('#stationParameters').parent().parent().show();
        }else{
            $('#stationParameters').parent().parent().hide();
            $('.js-select-bottom-parameter').parent().parent().show();
            $('#proximityStations').parent().parent().show();
        }
    },

    'change .js-select-primary'(event, template) {
        Meteor.users.update(Meteor.userId(), {
            $set: {
                "profile.primaryStation": $('#primaryStation').val(),
            }
        });
        
        //Add the primary station to the proximity stations as well.
        let proximityValues = $('#proximityStations').val();
        let primaryStationValue = $('#primaryStation').val();
        if(proximityValues.indexOf(primaryStationValue) === -1) proximityValues.push(primaryStationValue);
        
        $('#proximityStations').val(proximityValues).trigger('change');


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
    'change #proximityStations'(event, template){
        let proximity = $('#proximityStations');
        let primary = $('#primaryStation');
        if(proximity.val() === null){
            console.log('null');
            //If there is no proximity stations, set one to be the primary station.
            proximity.val(primary.val()).trigger('change');    
            swal("Warning", 'You\'ve selected that station as a primary station.', 'warning');
        }

        //If the user removed the primary station from the proximity stations re-add it.
        if(proximity.val().indexOf(primary.val()) === -1){
            console.log(proximity.val());
            console.log(primary.val());                
            console.log('index');
            let proximityStationsVal = proximity.val();
            proximityStationsVal.push(primary.val());
            proximity.val(proximityStationsVal).trigger('change');
            swal("Warning", 'You\'ve selected that station as a primary station.', 'warning');
        }
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
    },
    singleStationParameters(){
        let userPrimaryStation = Meteor.user().profile.primaryStation;
        let keys = Object.keys(Data.findOne({title:userPrimaryStation}).data);

        //Remove 'times' from the keys array.
        var index = keys.indexOf("times");
        if (index !== -1)keys.splice(index, 1);
        return keys;
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
            $('#stationParameters').select2({
                theme:'bootstrap'
            });
        }

        let userProfile = Meteor.user().profile;

        //Update inputs with the user's saved selections.
        $('#primaryStation').val(userProfile.primaryStation);
        $('#proximityStations').val(userProfile.proximityStations).change();
        $('#stationParameters').val(userProfile.singleStationParameters).change();
        $('#dataDuration').val(userProfile.dataDuration);
        $('#refreshInterval').val(userProfile.refreshInterval);
        $('#topPlotDataParameter').val(userProfile.topPlotDataParameter);
        $('#bottomPlotDataParameter').val(userProfile.bottomPlotDataParameter);
        $('#lowAlert').val(userProfile.parameterAlerts.lowAlert);
        $('#midAlert').val(userProfile.parameterAlerts.midAlert);
        $('#highAlert').val(userProfile.parameterAlerts.highAlert);
        $('#paramUnit').val(userProfile.parameterAlerts.unit);

        //Hide inputs for single station view.
        $('#stationParameters').parent().parent().hide();

        //If the user has been in single view mode, go to the input view for that mode.
        if(userProfile.stationViewMode==='single')$('.singleStation').trigger('click');

    }, 500);

});

Template.Admin.onDestroyed(() => {

});
