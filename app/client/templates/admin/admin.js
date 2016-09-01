import swal from 'sweetalert';
import HUMPS from 'humps';

//Checks the fields and generates an object represenatative of the user's choices.
function getSubmitPayload(){
    

    let viewMode = $('.singleStation').hasClass('active') ? 'single' : 'multiple';
   
    let primaryStation = $('#primaryStation').val();
    let parameterAlerts = {}
    let proximityStations = [];
    if(viewMode === 'multiple'){
        parameterAlerts = {
            lowAlert: $('#lowAlert').val(),
            midAlert: $('#midAlert').val(),
            unit: $('#paramUnit').val(),
            flippedColors:$('#parameterAlertsFlippedSwitch').prop('checked'),
            enabled: $('#parameterAlertsEnableInput').prop('checked')

        };


        $('.proximityStationCheckbox').each(function(obj){
            if($(this).prop('checked') === true)proximityStations.push($(this).prop('id')); 
        });

       
    }
    //Make sure that the proximity stations contains the primary station.
    if(proximityStations.indexOf(primaryStation) === -1)proximityStations.push(primaryStation);

    //Get the stationParameters
    let stationParameters = [];
    $('.stationParameterCheckbox').each(function(){
        if($(this).prop('checked') === true)stationParameters.push($(this).prop('id'));
    });
    
    //Get data collected from the date slider and process it.
    let sliderData = Session.get('sliderData');
    let stationData = Data.findOne({title: primaryStation});
    let dateIndexes = findDateIndexes(moment(sliderData.from, 'X') , moment(sliderData.to, 'X'),  stationData.data[$('#topPlotDataParameter').val()].times);
    let payload = {
        'profile':{
            'stationViewMode': viewMode,
            'singleStationParameters': stationParameters,
            'primaryStation': primaryStation,
            'proximityStations': proximityStations,
            'refreshInterval': $('#refreshInterval').val(),
            'infoTickerText': $('#infoTickerText').val(),
            'timeZone': $('#timezoneSelect').val(),
            'topPlotDataParameter': $('#topPlotDataParameter').val(),
            'bottomPlotDataParameter': $('#bottomPlotDataParameter').val(),
            'parameterAlerts': parameterAlerts,
            'dateSliderData':{
                from: sliderData.from,
                to:sliderData.to
            },
            'tickerEnabled':$('#tickerEnabledInput').prop('checked'),
            'fromTimeIndex': dateIndexes[0],
            'toTimeIndex': dateIndexes[1],
            'saveDate': new Date()
        }
    };
    return payload;
}

//This function is called when the user changes profiles or reloads the page. It uses the profile to populate all the fields.
function updateInputsWithProfile(userProfile){

    //Update inputs with the user's saved selections.
    $('#primaryStation').val(userProfile.primaryStation);
    $('#stationParameters').val(userProfile.singleStationParameters).change();
    $('#refreshInterval').val(userProfile.refreshInterval);
    $('#topPlotDataParameter').val(userProfile.topPlotDataParameter);
    $('#bottomPlotDataParameter').val(userProfile.bottomPlotDataParameter);
    $('#infoTickerText').val(userProfile.infoTickerText);
    $('#lowAlert').val(userProfile.parameterAlerts.lowAlert);
    $('#midAlert').val(userProfile.parameterAlerts.midAlert);
    $('#paramUnit').val(userProfile.parameterAlerts.unit);
    $('#parameterAlertsEnableInput').prop('checked', userProfile.parameterAlerts.enabled);
    $('#parameterAlertsFlippedSwitch').prop('checked', userProfile.parameterAlerts.flippedColors);
    if(userProfile.parameterAlerts.unit === '' || userProfile.parameterAlerts.unit === undefined){
        $('#paramUnit').val(Data.findOne({title:userProfile.primaryStation}).data[userProfile.topPlotDataParameter].units);
    }else{
        $('#paramUnit').val(userProfile.parameterAlerts.unit);
    }
    $('#tickerEnabledInput').prop('checked', userProfile.tickerEnabled);

    if(userProfile.parameterAlerts.enabled){
        $('.paramterAlertToggle').hide();
    }
    if(userProfile.parameterAlerts.flippedColors === false){
        $('#parameterAlertsNotFlippedSwitch').prop('checked', true);
    }

    //update proximityStations:
    $('.proximityStationCheckbox').prop('checked', false);
    userProfile.proximityStations.forEach(function(obj){
        $('.proximityStationCheckbox[id=\''+ obj +'\']').prop('checked', true);    
    });
    
    //Update stationParameters
    $('.stationParameterCheckbox').prop('checked', false);
    userProfile.singleStationParameters.forEach(function(obj){
        $('.stationParameterCheckbox[id=\'' + obj + '\']').prop('checked', true);    
    });

    //Update the date slider
    updateDateSelectorRange();
    if(userProfile.dateSliderData !== undefined){
        let slider = $('input[type="rangeslide"]').data('ionRangeSlider');
        slider.update({
            from: userProfile.dateSliderData.from,
            to: userProfile.dateSliderData.to
        });
    }
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
            Session.set('DataPreferences', res || []);
        }
    });
}

function updateDateSelectorRange(){ 
    let topPlotDataParameter = $('#topPlotDataParameter').val();
    let primaryStation = $('#primaryStation').val();
    if(topPlotDataParameter !== null && primaryStation != null){
        let timeRange = Data.findOne({'title': primaryStation}, {fields: {'data': 1}});
        let slider = $('input[type="rangeslide"]').data('ionRangeSlider');

        slider.update({
        min: moment(timeRange.data[topPlotDataParameter].times[0]).format('X'),
        max: moment(timeRange.data[topPlotDataParameter].times[timeRange.data[topPlotDataParameter].times.length-1]).format('X')
        });
    }else{
        slider.update({
            min: moment().subtract(7, 'days').format('X'),
            max: moment().format('X')
        })
    }
}

//Find the index of the startDate and end date in the date array (if not possible the closest indexes will be returned)
//Start and End dates must be moment objects.
function findDateIndexes(startDate, endDate, dateArray){
    let startIndex, endIndex;
    for(let i = 0; i < dateArray.length; i++){
        let currentArrayDate = moment(dateArray[i]);
        
        if(startDate.isSame(currentArrayDate) || startDate.isAfter(currentArrayDate)){
            startIndex = i; 
        }
        if(endDate.isSame(currentArrayDate) || endDate.isBefore(currentArrayDate)){
            endIndex = i;
            break;
        } 
    }
    return [startIndex, endIndex];
}
function camelToRegular(string) {
    return string.replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => { return str.toUpperCase(); })
}
/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/
Template.Admin.events({
    'submit form': function(event,tmpl){
        event.preventDefault();

        $('#proximityStations').trigger('chosen:updated');

        //Get the payload and make a deep copy so the two don't interact.
        let originalPayload = getSubmitPayload();
        let payload =Object.assign({}, originalPayload);

        //Remove the last auto generated preference.
        Meteor.call('server/getUserPreferences', function(err, res){
            if(err){
                console.log(err);
            }else{
                res.forEach(function(obj){
                    if(obj.profile.autoGenerated === true){
                        Meteor.call('server/removeUserPreference', obj._id);
                        
                        //Remove preference from the session.
                        let preferences = Session.get('DataPreferences');
                        preferences.forEach(function(sessionObj, index){
                            if(sessionObj._id  === obj.id){
                                preferences.splice(index, 1);
                            }
                        });
                        Session.set('DataPreferences', preferences);
                    }
                });
            }
        });
        
        payload.profile['preferenceName'] = 'Last Preference';
        payload.profile['autoGenerated'] = true;
        Meteor.call('server/addUserPreference', payload, function(err, res){
            //Update Session
            let prefs = Session.get('DataPreferences');
            prefs.push(payload);
            Session.set('DataPreferences', prefs);
        });

        Meteor.users.update(Meteor.userId(), {
            $set: originalPayload
        }, {multi: true}, function(err, res){
            if(err){
                console.log(err);
            }else{
                Router.go('/');
            }
        });
    },

    'click .stationDataViewOption'(event, template){

        //Change which button is active
        $('.stationDataViewOption').removeClass('active');
        $(event.target).addClass('active');
        //Update the inputs
        if($(event.target).hasClass('singleStation')){
            //Get rid of the Proximity Stations, Bar Plot and Line Plot Inputs
            $('.js-select-bottom-parameter').parent().parent().hide();
            $('#proximityStations').hide();
            $('#singleStationParameters').show();
            $('.parameterAlertsDiv').hide();
        }else{
            $('#singleStationParameters').hide();
            $('.js-select-bottom-parameter').parent().parent().show();
            $('#proximityStations').show();
            $('.parameterAlertsDiv').show();
        }
    },

    'click .preferenceSelectionButton'(event, template){
        let preferenceId = $(event.target).data('preference-id');
        let clickedPreference;
        Session.get('DataPreferences').forEach(function(obj){
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
            console.log('Could not load preference');
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
        }else if(preferenceName === null || preferenceName === ''){
            swal('Warning', 'You must provide a name for the saved preferences.', 'warning');
        }else{

            //Add the name of the preferences to the payload.
            let payload = getSubmitPayload();

            payload.profile['preferenceName'] = preferenceName

            Meteor.call('server/addUserPreference', payload, function(err, res){
                if(err){
                    console.log('Error encountered while attempting to call server/addUserPreference. Error: ' +err);
                }else{

                    //Update the Session
                    let dataPrefs = Session.get('DataPreferences');
                    dataPrefs.push(payload);
                    Session.set('DataPreferences', dataPrefs);

                    //Update the user.
                    Meteor.users.update(Meteor.userId(), {
                        $set:payload
                    }, function(err, res){
                    });

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
                    Session.set('CurrentPreference', payload);
                    //fetchUserPreferences();
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
                'profile.primaryStation': $('#primaryStation').val(),
            }
        });

        //Add the primary station to the proximity stations as well.
        let primaryStationValue = $('#primaryStation').val();
        $('.proximityStationCheckbox[id=\'' + primaryStationValue + '\']').attr('checked', true); 
        
        $('.js-top-plot-param').trigger('change');
    },
    'click .proximityStationCheckbox'(event, template){
        //Don't allow the user to remove the primary station from the proximity stations.
        if($(event.target).attr('id') === $('#primaryStation').val()){
            $(event.target).prop('checked', true);
            swal('Warning', 'You\'ve selected that station as a primary station.', 'warning');
        }
    },
    'change .js-top-plot-param'(event, template) {
        Meteor.setTimeout(() => {
            try {
                let topPlotDataParameter = $('#topPlotDataParameter').val();
                Meteor.users.update(Meteor.userId(), {
                    $set: {
                        'profile.topPlotDataParameter': topPlotDataParameter,
                    }
                });
                updateDateSelectorRange();

                //Make sure that all enabled poximity stations have the data parameter selected.
                let foundData = Data.find({['data.' + topPlotDataParameter]:{$exists:true}}).fetch();
                if(foundData.length < Data.count){
                    $('.proximityStationCheckbox').each(function(obj){
                        let proximityTitle = $(obj).prop('id')
                        let stationFoundInList = false;
                        foundData.forEach(function(data){
                            if(data.title === proximityTitle)stationFoundInList = true;    
                        });
                        if(stationFoundInList === false){
                            $(obj).prop('disabled', true);    
                        }
                    });    
                }
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
    },
    'change #parameterAlertsEnableInput'(event, template){
        if($(event.target).prop('checked') === true){
            $('.parameterAlertToggle').show();
        }else{
            $('.parameterAlertToggle').hide();
        }
    }
});

/*****************************************************************************/
/* Admin: Helpers */
/*****************************************************************************/
Template.Admin.helpers({
    stationsList: function(){
        try {

            let listOfStations = Stations.find({}).fetch(),
                stationNames = [];

            _.each(listOfStations, (obj) => {
                stationNames.push(obj.title);
            });
            return stationNames.sort();
        } catch(e) {
            console.log(e);
        }
    },
    singleStationParameters(){
        let userPrimaryStation = Meteor.user().profile.primaryStation;
        if(userPrimaryStation === null || userPrimaryStation === ''){
            return [];
        }

        let keys = Object.keys(Data.findOne({title:userPrimaryStation}).data);

        //Remove 'times' from the keys array.
        var index = keys.indexOf('times');
        if (index !== -1)keys.splice(index, 1);
        keys.sort();

        let parameterList = [];
        keys.forEach(function(obj){
            parameterList.push({'name' : obj, 'uiName': camelToRegular(obj)});
        });
        return parameterList;
    },
    dataParams() {
        try {
            if (Meteor.user() && Meteor.user().profile.primaryStation) {
                let dataSource = Data.findOne({title: Meteor.user().profile.primaryStation}),
                    parameterNames = Object.keys(dataSource.data);

                let timesIndex = parameterNames.indexOf('times');
                if (timesIndex > -1) parameterNames.splice(timesIndex, 1);
                parameterNames.sort();
                let dataParams = [];
                parameterNames.forEach(function(obj){
                    let object = {'name' : obj, 'uiName': camelToRegular(obj)};
                    dataParams.push(object);
                });
                return dataParams;
            }
        } catch (exception) {
            console.log(exception);
        }
    },
    currentPreferenceName(){
        try{
            return Meteor.user().profile.preferenceName || Session.get('CurrentPreference').profile.preferenceName;
        }catch(err){
            return undefined;
        }
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
    }
});

/*****************************************************************************/
/* Admin: Lifecycle Hooks */
/*****************************************************************************/
Template.Admin.onCreated(function() {
    fetchUserPreferences();
});

Template.Admin.onRendered(function() {
    let $slider = $('input[type="rangeslide"]');

    let saveTimeRange = ((sliderData) => {
        //Update the session with the slider data. We will save it on submit.
        Session.set('sliderData', {
            'from' : sliderData.from,
            'to' : sliderData.to
        });
    });

    Meteor.setTimeout(() => {
        //Make sure that the date range represents the available data
        $slider.ionRangeSlider({
            type: 'datetime',
            prettify: function (num) {
                return moment(num, 'X').format('LL');
            },
            onStart: saveTimeRange,
            onUpdate: saveTimeRange,
            onFinish: saveTimeRange

        });
        $('#parameterAlertsTooltip').popover({placement:'bottom'});
        updateDateSelectorRange();

        //Hide inputs for single station view.
        $('#singleStationParameters').hide();
        updateInputsWithProfile(Meteor.user().profile);
    }, 500);
});

Template.Admin.onDestroyed(() => {
    //Get rid of helper functions
    // getSubmitPayload = undefined;
    // updateInputsWithProfile = undefined;
    // fetchUserPreference = undefined;
});
