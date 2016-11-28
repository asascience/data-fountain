import swal from 'sweetalert';
import HUMPS from 'humps';

export default function generateCSV(userOptions){
    try {
        //Get the user inputs (Meteor.user().profile might not be updated).
        let userProfile = userOptions;

        let station = userProfile.primaryStation;
        let topPlotParameter = userProfile.bottomPlotDataParameter;
        let stationData = Data.findOne({title:station});
        let dataArray;

        //Get the selected start and end date.
        let startDate = stationData.data[topPlotParameter].times[userProfile.fromTimeIndex];
        let endDate = stationData.data[topPlotParameter].times[userProfile.toTimeIndex];

        let csvString = '';

        //The single station version will create a csv file listing the data for each sensor
        //on the station (selected in singleStationParameters).
        if(userProfile.stationViewMode === "single"){
            let stationParameters = userProfile.singleStationParameters;

            let headerString = 'dateTime,';

            //Initialize the data with the dates for every entry.
            dataArray=[stationData.data.times.slice(userProfile.fromTimeIndex, userProfile.toTimeIndex)];

            //Iterate over stationParameters, a list of the parameters for a single station to generate our csv header
            //and to add values to the date array.
            stationParameters.forEach(function(obj){
                headerString += obj + '(' + stationData.data[obj].units + '),';

                //This function takes the start and end date for the data and returns the index of the data
                //that within those times for each paramter. We will then slice off the excess from the array.
                let indexes = findDateIndexes(moment(startDate), moment(endDate), stationData.data[obj].times);
                let valuesSlice = stationData.data[obj].values.slice(indexes[0], indexes[1]);
                dataArray.push(valuesSlice);
            });

            //Add the header to csv.
            csvString += headerString + '\n';

        }else{
            //This is the multiple station case. Here we will create a csv file that lists one parameter,
            //the top plot parameter across a range of stations (the proximity stations).
            let proximityStations = userProfile.proximityStations;
            let headerString = 'dateTime,';
            dataArray=[stationData.data.times.slice(userProfile.fromTimeIndex, userProfile.toTimeIndex)];

            //Simalar to the single station case, iterates over the two dimensional data array and takes
            //the nth index of every nested array and adds it to a new line in the csv.
            proximityStations.forEach(function(obj){
                headerString += obj;
                let currentStation = Data.findOne({title:obj});
                headerString += '(' + currentStation.data[topPlotParameter].units + ')'
                let slicedData = []

                //Deal with the case that a station doesn't contain the parameter alltogether.
                if(currentStation.data[topPlotParameter] === undefined){
                    for(var i = 0; i < dataArray.length; i++){
                        slicedData.push('null');
                    }
                }else{
                    let indexes = findDateIndexes(moment(startDate), moment(endDate), currentStation.data[topPlotParameter].times);
                    slicedData = currentStation.data[topPlotParameter].values.slice(indexes[0], indexes[1]);
                }
                dataArray.push(slicedData);
            });
            csvString += headerString + '\n';
        }

        //At this point the dataArray will be a two dimensional array. An array of parameter data arrays.
        //We will iterate this array and on the nth line write the nth index of each array.
        dataArray[0].forEach(function(element, index){
            let partialString = '';
            dataArray.forEach(function(obj){

                //It's ok for the parameter data to be missing some values. Change the output to "null" if it is.
                let value = obj[index];
                if(value === undefined){
                    value = "null";
                }
                partialString += value + ','
            });
            partialString += "\n";
            csvString+=partialString;
        });
        return csvString;
    } catch(e) {
        console.log(e);
    }
}

//Checks the fields and generates an object representative of the user's choices.
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
            'singleStationParameters': (Meteor.user().profile.stationViewMode === 'single') ? stationParameters : getDataParamList(),
            'primaryStation': primaryStation,
            'proximityStations': proximityStations,
            'refreshInterval': $('#refreshInterval').val(),
            'infoTickerText': $('#infoTickerText').val(),
            'timeZone': $('#timezoneSelect').val(),
            'topPlotDataParameter': $('#topPlotDataParameter').val(),
            'bottomPlotDataParameter': $('#bottomPlotDataParameter').val(),
            'keepUpdated': $('#chkKeepUpdated').prop('checked'),
            'cycleStationParams': $('#chkCycleParams').prop('checked'),
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
    $('#chkKeepUpdated').attr('checked', userProfile.keepUpdated);
    $('#chkCycleParams').attr('checked', userProfile.cycleStationParams);
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

    if(userProfile.parameterAlerts.enabled === false){
        $('.parameterAlertToggle').hide();
        $('#midAlert').prop('disabled', true);
        $('#lowAlert').prop('disabled', true);
    }else{
        $('.parameterAlertToggle').show();
        $('#midAlert').prop('disabled', false);
        $('#lowAlert').prop('disabled', false);
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

    if(userProfile.cycleStationParams) {
        $('#singleStationParameters').show();
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
    let slider = $('input[type="rangeslide"]').data('ionRangeSlider');

    if(topPlotDataParameter !== null && primaryStation !== null){
        let timeRange = Data.findOne({'title': primaryStation}, {fields: {'data': 1}});

        if(timeRange.data[topPlotDataParameter] && timeRange.data[topPlotDataParameter].times !== null && Array.isArray(timeRange.data[topPlotDataParameter].times)){
            let minDate = moment(timeRange.data[topPlotDataParameter].times[0]).format('X');
            let maxDate = moment(timeRange.data[topPlotDataParameter].times[timeRange.data[topPlotDataParameter].times.length-1]).format('X');
            slider.update({
                min: minDate,
                max: maxDate
            });
        }else{
            slider.update({
                min: moment().subtract(7, 'days').format('X'),
                max: moment().format('X')
            })
        }
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

let getDataParams = (function () {
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
});

let getDataParamList = (() => {
    let dataParamList = [];
    $('.stationParameterCheckbox').each(function(){
        if($(this).prop('checked') === true) {
            dataParamList.push($(this).prop('id'));
        }
    });

    return dataParamList;
});

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
                $('.panel-body').css('opacity', 0);
                $('.spinner').css('opacity', 1);
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
            if (!Meteor.user().profile.cycleStationParams) {
                $('#singleStationParameters').hide();
            }
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


            $('#midAlert').prop('disabled', false);
            $('#lowAlert').prop('disabled', false);
        }else{
            $('.parameterAlertToggle').hide();
            $('#midAlert').prop('disabled', true);
            $('#lowAlert').prop('disabled', true);
        }
    },
    'click #getCsvButton'(event, template){
        try {
            let isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

            if (isSafari) {
                swal('Browser Not Supported', "Sorry, downloading this data is currently not supported in safari.  Please try with any other browser", 'warning');
            } else {
                let profile = getSubmitPayload().profile;
                let csvString = generateCSV(profile);

                //This initiates a download of the csv file.
                let blob = new Blob([csvString]);
                let a = window.document.createElement('a');
                a.href = window.URL.createObjectURL(blob, {type: 'text/plain'});

                //This is the name of the file
                let fileName = 'data.csv';
                if(profile.stationViewMode === 'single'){
                    fileName = profile.primaryStation + '.csv'
                }else if(profile.stationViewMode === 'multiple'){
                    fileName = profile.bottomPlotDataParameter + '.csv';
                }
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch(e) {
            console.log(e);
        }
    },
    'change #regionSelection'(event, template){
        let updateValue = $('#regionSelection').val();
        Meteor.users.update(Meteor.userId(), {
            $set: {
                'profile.stationRegion': updateValue
            }
        });
    },
    'change #chkCycleParams'(e,t) {
        if ($(e.target).prop('checked') === true) {
            $('#singleStationParameters').show();
            Meteor.users.update(Meteor.userId(), {
                $set: {
                    'profile.cycleStationParams': true,
                    'profile.singleStationParameters': getDataParamList()
                }
            });
        } else {
            $('#singleStationParameters').hide();
            Meteor.users.update(Meteor.userId(), {
                $set: {
                    'profile.cycleStationParams': false
                }
            });
        }
    }
});

/*****************************************************************************/
/* Admin: Helpers */
/*****************************************************************************/
Template.Admin.helpers({
    stationsList(){
        try {
            //Create a mongo query that finds the data entries for offshore stations if the offshore option has been selected (in).
            //Otherwise find all the others (nin)
            let query;
            if(Meteor.user().profile.stationRegion === "Offshore"){
                query = {title:{$in:[]}};
            }else{
                query = {title:{$nin:[]}};
            }

            let listOfStations = Stations.find({}, {
                sort: {lat: -1}
            }).fetch(),
                stationNames = [];

            let bottomPlotParameter = $('#bottomPlotDataParameter').val();
            _.each(listOfStations, (obj) => {
                let enabled = true;
                if(bottomPlotParameter !== null && bottomPlotParameter !== ''){
                    let queryString = 'data.' + bottomPlotParameter;
                    let bottomPlotData = Data.findOne({title:obj.title, [queryString]:{$exists:true}});
                    if(bottomPlotData === undefined || bottomPlotData.data[bottomPlotParameter].values === undefined || Array.isArray(bottomPlotData.data[bottomPlotParameter].times)===false){
                        enabled = false;
                    }
                }
                let object = {'title': obj.title, 'enabled': enabled};
                stationNames.push(object);
            });
            return stationNames;
        } catch(e) {
            console.log(e);
        }
    },
    singleStationParameters(){
        try {
            let userPrimaryStation = (Meteor.user()) ? Meteor.user().profile.primaryStation : null;
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
        } catch(e) {
            console.log(e);
        }
    },
    dataParams() {
        return getDataParams();
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
        return (Meteor.user()) ? Meteor.user().profile.topPlotDataParameter : null;
    },
    bottomPlotDataParameter() {
        return (Meteor.user()) ? Meteor.user().profile.bottomPlotDataParameter : null;
    },
    primaryStation() {
        return (Meteor.user()) ? Meteor.user().profile.primaryStation : null;
    },
    proximityStations() {
        return (Meteor.user()) ? Meteor.user().profile.proximityStations : null;
    },
    dataDuration() {
        return (Meteor.user()) ? Meteor.user().profile.dataDuration : null;
    },
    refreshInterval() {
        try {
            if (Meteor.user() && !Meteor.user().profile.refreshInterval) {
                return 2;
            }
            return (Meteor.user()) ? Meteor.user().profile.refreshInterval: null;
        } catch(e) {
            console.log(e);
        }
    },
    infoTickerText() {
        return (Meteor.user()) ? Meteor.user().profile.infoTickerText: null;
    },
    keepUpdated() {
        return (Meteor.user() && Meteor.user().profile.keepUpdated === 'om') ? "checked" : null;
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
        $('#tickerMarqueeTooltip').popover({placement:'right'});
        updateDateSelectorRange();

        //Hide inputs for single station view.
        $('#singleStationParameters').hide();
        updateInputsWithProfile(Meteor.user().profile);
    }, 500);

    Meteor.setTimeout(() => {
        $('.panel-body').css('opacity', 1);
        $('.spinner').css('opacity', 0);
    }, 600);
});

Template.Admin.onDestroyed(() => {
    //Get rid of helper functions
    //getSubmitPayload = undefined;
    //updateInputsWithProfile = undefined;
    //fetchUserPreference = undefined;
});
