import swal from 'sweetalert';
import HUMPS from 'humps';

//

//Checks the fields and generates an object represenatative of the user's choices.
function getSubmitPayload(){

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
    return payload;
}


function updateInputsWithProfile(userProfile){
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


    //If the user has been in single view mode, go to the input view for that mode.
    if(userProfile.stationViewMode==='single'){
        $('.singleStation').trigger('click');
    }else{
        $('.multipleStation').trigger('click');
    }
}


function fetchUserPreferences(){
    //fetch the user preferences from the server for use in the template.
    Meteor.call('server/getUserPreferences', function(error, res){
        if(error){
            console.log(error);
        }else{
            Session.set('DataPreferences', res);
        }
    });
}

/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/
Template.Admin.events({
    'submit form': function(event,tmpl){
        event.preventDefault();

        $('#proximityStations').trigger('chosen:updated');

        let payload = getSubmitPayload();

        Meteor.users.update(Meteor.userId(), {
            $set: payload
        }, {multi: true}, function(err, res){
            if(err){
                console.log(err);
            }else{
                //Show a success Message.
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
        });
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

    'click .preferenceSelectionButton'(event, template){
        let preferenceId = $(event.target).data('preference-id');
        let clickedPreference;
        Session.get("DataPreferences").forEach(function(obj){
            if(obj._id === preferenceId){
                clickedPreference = obj;
            }
        });
        if(clickedPreference !== null){
            //Update the current selected preference session variable to use in the ui.
            Session.set('CurrentPreference', clickedPreference);
            updateInputsWithProfile(clickedPreference.profile);
            Meteor.users.update(Meteor.userId(), {
                $set: {'profile': clickedPreference.profile}
            }, {multi: true});
        }else{
            console.log("Could not load preference");
        }
    },

    'click #savePreferenceButton'(event, template){

        let preferenceName = $('#savePreferenceInput').val();

        //Make sure that the name is not a duplicate.
        let preferenceList = Session.get('DataPreferences');
        let duplicateName = false;
        if(preferenceList !== null){
            for(let i = 0; i < preferenceList.length; i++){
                if(preferenceList[i].profile.preferenceName === preferenceName){
                    duplicateName = true;
                    break;
                }
            }
        }

        if(duplicateName === true){
            //Show a warning for duplicate name.
            swal('Warning', 'The preference name provided has already been used.');
        }else if(preferenceName === null || preferenceName === ""){
            swal('Warning', 'You must provide a name for the saved preferences.', 'warning');
        }else{

            //Add the name of the preferences to the payload.
            let payload = getSubmitPayload();

            payload['profile.preferenceName'] = preferenceName

            Meteor.call('server/addUserPreference', payload, function(err, res){
                if(err){
                    console.log("Error encountered while attempting to call server/addUserPreference");
                }else{
                    //Hide the modal
                    $('#savePreferenceModal').modal('hide');
                    //Remove the last preference name from the input.
                    $('#savePreferenceInput').val('');
                    //Show a success alert
                    swal({
                        title: 'Saved!',
                        text: 'Your preferences have been saved.',
                        type: 'success',
                        confirmButtonText: 'OK',
                        closeOnConfirm: true
                    });

                    //Update the preferences so that the new option apears on the load preferences modal.
                    fetchUserPreferences();
                }
            });
        }
    },
    'click .preferenceDeletionButton'(event, template){
        $('.preferenceDeletionButton').each(function(obj){
            $(obj).data('selected', false);
        });
        $(event.target).data('selected', true);
    },
    'click #preferencesDeleteButton'(event, template){
        let deletionButtons = $('.preferenceDeletionButton');
        let selectedButton = undefined;
        if(deletionButtons !== null){
            for(let i = 0; i < deletionButtons.length; i++){
                if($(deletionButtons[i]).data('selected') === true){
                    selectedButton = $(deletionButtons[i]);
                }
            }
        }
        //If no button was selected, tell the user that they need to select one.
        if(selectedButton === undefined){
            swal('Warning', 'Please select a preference to delete.', 'warning');
        }else{
            //Use the id attribute of the button to delete the preference from the db.
            console.log(selectedButton.data('preference-id'));
            Meteor.call('server/removeUserPreference', selectedButton.data('preference-id'), function(err, res){
                if(err){
                    console.log(err);
                }else{
                    //Hide the modal
                    $('#preferencesDeletionModal').modal('hide');

                    //Update the user preferences
                    fetchUserPreferences();

                    //Show a success alert.
                    swal({
                        title: 'Deleted!',
                        text: 'Your preference has been deleted',
                        type: 'success',
                        confirmButtonText: 'OK',
                        closeOnConfirm: true
                    });
                }
            });
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
    'change #proximityStations'(event, template){
        let proximity = $('#proximityStations');
        let primary = $('#primaryStation');
        if(proximity.val() === null){
            //If there is no proximity stations, set one to be the primary station.
            proximity.val(primary.val()).trigger('change');
            swal("Warning", 'You\'ve selected that station as a primary station.', 'warning');
        }

        //If the user removed the primary station from the proximity stations re-add it.
        if(proximity.val().indexOf(primary.val()) === -1){
            console.log(proximity.val());
            console.log(primary.val());
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
    currentPreferenceName(){
        return Meteor.user().profile.preferenceName || Session.get('CurrentPreference').profile.preferenceName;
    },
    dataPreferences(){
        return Session.get('DataPreferences');
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
Template.Admin.onCreated(function() {
    let data = {};
    data.timeRange = {
        min: +moment().subtract(1, "years").format("X"),
        max: +moment().format("X")
    };
    Session.set('data', data);
    fetchUserPreferences();
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
            $('#stationParameters').select2({
                theme:'bootstrap'
            });
        }

        updateInputsWithProfile(Meteor.user().profile);


        //Hide inputs for single station view.
        $('#stationParameters').parent().parent().hide();


    }, 500);

});

Template.Admin.onDestroyed(() => {
    //Get rid of helper functions
    // getSubmitPayload = undefined;
    // updateInputsWithProfile = undefined;
    // fetchUserPreference = undefined;
});
