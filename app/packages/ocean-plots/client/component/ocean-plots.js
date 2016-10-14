import Highcharts from 'highcharts';
import camelToRegular from '../ocean-plots';
/*****************************************************************************/
/* OceanPlots: Event Handlers */
/*****************************************************************************/
Template.OceanPlots.events({
});

/*****************************************************************************/
/* OceanPlots: Lifecycle Hooks */
/*****************************************************************************/
Template.OceanPlots.helpers({
    timeInterval() {
        try {
            let reactiveTime = new ReactiveVar();
            Tracker.autorun(() => {
                reactiveTime.set(moment(Session.get('globalTimer')).format("HH:00 MM/DD/YYYY"));
            });
            return reactiveTime.get();
        } catch (exception) {
            console.log(exception);
        }
    },
    topPlot() {
        try {
            let userProfile = Meteor.user().profile
            let primaryStation = userProfile.primaryStation,
                topPlotDataParameter = userProfile.topPlotDataParameter,
                primaryStationData = Data.findOne({title: primaryStation},
                                                  {fields: {data: 1, title: 1}}),
                plotDisplayName = camelToRegular(topPlotDataParameter);
            if (!primaryStationData.data) throw `No Data available for ${primaryStation}`;
            if (!primaryStationData.data.times) throw `No Time for ${primaryStation}`;

            let times = primaryStationData.data[topPlotDataParameter].times,
                plotData = primaryStationData.data[topPlotDataParameter].values,
                units = primaryStationData.data[topPlotDataParameter].units;


            // Update the times to only include the range between the to and from time selected with the date slider.
            //times = times.splice(times.length - Meteor.user().profile.dataDuration -1, times.length);
            times = times.slice(userProfile.fromTimeIndex, userProfile.toTimeIndex);
            let dataSet = times.map((data, index) => {
                //Adjust the index so that only values from the date range selected are included.
                let adjustedIndex = index + userProfile.fromTimeIndex;


                return [moment(times[index]).unix()*1000, (plotData[adjustedIndex] === 'NaN' || typeof(plotData[adjustedIndex]) === 'undefined') ? null : plotData[adjustedIndex]];
            });

            Meteor.defer(() => {
                try {
                    Highcharts.chart('topPlot', {
                        animation: Highcharts.svg, // don't animate in old IE
                        credits:{
                            enabled: false
                        },
                        title: {
                            text: null
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: `${plotDisplayName} (${units})`,
                                style: {
                                    fontSize: '.9vw',
                                    fontFamily: 'Verdana, sans-serif',
                                    fontWeight: 'bold'
                                }
                            },
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 80,
                            labels: {
                                style: {
                                    fontSize: '.9vw',
                                    fontFamily: 'Verdana, sans-serif',
                                    fontWeight: 'bold'
                                }
                            },
                            title: {
                                text: null
                            }
                        },
                        plotOptions: {
                            spline: {
                                lineWidth: 6,
                                stats: {
                                    hover: {
                                        lineWidth: 5
                                    }
                                },
                                marker: {
                                    enabled: false
                                }
                            }
                        },
                        series: [{
                            data: dataSet,
                            type: 'spline',
                        }]
                    });
                } catch(exception) {
                    console.log(exception);
                }
            });
        } catch(exception) {
            console.log(exception);
        }
    },
    bottomPlot() {
        try{
            let userProfile = Meteor.user().profile;
            let proximityStations = userProfile.proximityStations,
                primaryStation =  userProfile.primaryStation;
                proximityStationsData = Data.find({'title': {$in: proximityStations}}, {fields: {data: 1, title: 1}}).fetch(),
                bottomPlotDataParameter = userProfile.bottomPlotDataParameter,
                primaryStationData = Data.findOne({title: primaryStation},
                                                  {fields: {title: 1, data: 1}}),
                plotDisplayName = camelToRegular(bottomPlotDataParameter);

                //Get the first date to display data for.
                let firstTime = primaryStationData.data[userProfile.topPlotDataParameter].times[userProfile.fromTimeIndex];

                let dataSet = [],
                    axisLabels = [],
                    times = primaryStationData.data.times,
                    units = primaryStationData.data[bottomPlotDataParameter].units;


                for (let i=0; i<proximityStations.length-1;i++) {
                    dataSet.push(undefined);
                    axisLabels.push(undefined);
                }

                //This loop makes sure that each station being graphed has the same data length by trimming/adding empty values
                proximityStationsData.forEach((item, index) => {
                    let originalIndex = proximityStations.indexOf(item.title);

                    let itemData = item.data[bottomPlotDataParameter];

                    //If the station has no data return an appropriately sized array of empty values.
                    if(itemData === null || itemData === undefined){
                        let emptyValues = [];
                        for(let i=0; i < (userProfile.toTimeIndex - userProfile.fromTimeIndex); i++){
                            emptyValues.push("");
                        }
                        itemData = emptyValues;
                    }else{
                        //If needed prepend values to the data to fit the length.
                        let startIndex = item.data[bottomPlotDataParameter].times.indexOf(firstTime);
                        if(startIndex === -1){
                            let itemDataFirstTime = itemData.times[0];
                            let noDataCount = primaryStationData.data[userProfile.topPlotDataParameter].times.indexOf(itemDataFirstTime)-userProfile.fromTimeIndex;
                            let emptyValues = []
                            for(let i=0; i < noDataCount; i++){
                                //TODO: create an appropriate value for having no data.
                                emptyValues.push("");
                            }
                            itemData = emptyValues.concat(itemData.values.slice(0, userProfile.toTimeIndex-noDataCount));
                        }else{
                            //In this case the data set fills the entire range and we just need to slice it.
                            itemData = itemData.values.slice(startIndex, startIndex + (userProfile.toTimeIndex - userProfile.fromTimeIndex));
                        }
                    }
                    dataSet[originalIndex] = itemData;
                    axisLabels[originalIndex] = item.title;
                });

                let flattenArray = [].concat(...dataSet);
                // get the min and max values from a multidimensional array
                if (flattenArray.length !== 0) {
                    let maxValue = flattenArray.reduce((max, array) => {
                        return max >= array ? max : array;
                    }, -Infinity);

                    let minValue = flattenArray.reduce((min, array) => {
                        return min <= array ? min : array;
                    });

                    // transpose the multidimensional array
                    let plotData = dataSet[0].map((datum, index) => {
                        return dataSet.map((row) => {
                            return row[index];
                        });
                    });
                    let ticker;
                    Tracker.nonreactive(() => {
                        ticker = Session.get('globalTicker');
                    });

                    //Flip the color bars if needed.

                    let colorZones = [{
                        value: userProfile.parameterAlerts.lowAlert,
                        color: 'red'
                    }, {
                        value: userProfile.parameterAlerts.midAlert,
                        color: 'yellow'
                    },
                    {
                        color: 'green'
                    },
                    {
                        color:'green'
                    }];

                    if(userProfile.parameterAlerts.flippedColors === true){
                        colorZones[0].color = 'green';
                        colorZones[1].color = 'yellow';
                        colorZones[2].color = 'red';

                    }
                    //I wasted a stupid amount of time debugging after removing this.
                    //This line allows the chart to reference the plotData while animating.
                    //Don't remove it.
                    Template.instance().plotData = plotData;
                    Meteor.defer(() => {
                        try {
                            Highcharts.chart('bottomPlot', {
                                chart: {
                                    type: 'column',
                                    animation: Highcharts.svg, // don't animate in old IE
                                },
                                legend: {
                                    enabled: false
                                },
                                exporting: {
                                    enabled: false
                                },
                                title: {
                                    text: null
                                },
                                credits:{
                                    enabled: false
                                },
                                series: [{
                                    name: null,
                                    data: plotData[ticker],
                                    animation: {
                                        duration: 1000
                                    },
                                    dataLabels: {
                                        enabled: true,
                                        color: '#F58220',
                                        align: 'center',
                                        format: '{point.y:.1f}', // one decimal
                                        y: -2, // 10 pixels down from the top
                                        x: 2,
                                        style: {
                                            fontSize: '0.9vw',
                                            fontFamily: 'Verdana, sans-serif',
                                            border: 'none',
                                            textShadow: false,
                                        }
                                    },
                                }],
                                xAxis: {
                                    categories: axisLabels,
                                    labels: {
                                        style: {
                                            fontSize: '0.9vw',
                                            fontFamily: 'Verdana, sans-serif',
                                            border: 'none',
                                            textShadow: false,
                                            fontWeight: 'bold'
                                        }
                                    },
                                },
                                yAxis: {
                                    title: {
                                        text: `${plotDisplayName} (${units})`,
                                        style: {
                                            fontSize: '0.9vw',
                                            fontFamily: 'Verdana, sans-serif',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    min: minValue,
                                    max: maxValue + ((maxValue - minValue) * 0.2)
                                },
                                plotOptions: {
                                    column: {
                                        zones: colorZones
                                    }
                                }
                            });
                        } catch(e) {
                            console.log(e);
                        }
                    });
                }
        } catch(e) {
            console.log(e);
        }
    },
    singleBottomPlot(){
        try {
        let userProfile = Meteor.user().profile;
        let stationName = userProfile.primaryStation;
        let stationParameters = userProfile.singleStationParameters;

        let dataLength = userProfile.toTimeIndex - userProfile.fromTimeIndex;

        let stationData = Data.findOne({'title':stationName}).data;
        let firstTime = stationData[userProfile.topPlotDataParameter].times[userProfile.fromTimeIndex];
        //Make sure that the data starts at the same time.
        stationParameters.forEach(function(parameter){
            let currentData = stationData[parameter];
            let indexOfFirstTime = currentData.times.indexOf(firstTime);

            if(indexOfFirstTime === -1){
                //If the data doesnt have times as far back as the user selected.
                //Find the index of the oldest time of the current data in the
                //time series selected and add empty values upto that point
                let currentDataFirstTime = currentData.times[0];
                let noDataCount = stationData[userProfile.topPlotDataParameter].times.indexOf(currentDataFirstTime)-userProfile.fromTimeIndex;
                let emptyValues = []
                for(let i=0; i < noDataCount; i++){
                    //TODO: create an appropriate value for having no data.
                    emptyValues.push("");
                }
                stationData[parameter].values = emptyValues.concat(currentData.values.slice(0, userProfile.toTimeIndex-noDataCount));
            }else{
                stationData[parameter].values = currentData.values.slice(indexOfFirstTime, indexOfFirstTime + (userProfile.toTimeIndex - userProfile.fromTimeIndex));
            }
        })

        stationParamsDisplayName = stationParameters.map((item) => {
            return camelToRegular(item);
        });
        let remappedStationData = [];
        //This expresses the data as a percentage of the max value.
        for(var i = 0; i < stationParameters.length; i++){
            let currentData = stationData[stationParameters[i]].values;
            let max = Math.max.apply(Math, currentData);
            let min = Math.min.apply(Math, currentData);
            let dif = (max-min);
            let remappedData = currentData.map(function(val){
                return (val - min)/dif * (100);
            });
            remappedStationData[stationParameters[i]] = {};
            remappedStationData[stationParameters[i]].values = remappedData;
        }
        //This will be a multidimensional array. Each index will contain an array that contains the timeseries for each station parameter.
        let plotData = [];

        //Populate the array so that the nth element is an array of the nth elements of the stationData arrays.
        for(var i = 0; i < remappedStationData[stationParameters[0]].values.length; i++){
            let subPlotData = [];
            for(var j = 0; j < stationParameters.length; j++){

                //Set up a label to be displayed with the actual value
                //(the bar will be the remapped form, the labels will be actual values) and units.
                let sensorData = remappedStationData[stationParameters[j]];
                let numericString
                let currentValue = stationData[stationParameters[j]].values[i];
                if(currentValue === undefined || currentValue === null || typeof(currentValue) === 'string'){
                    //TODO: create an appropriate value for having no data.
                    numericString = "NaN"
                }else{
                    numericString = (stationData[stationParameters[j]].values[i]).toFixed(1) + " " + stationData[stationParameters[j]].units
                }
                let dataPoint = {
                    y:sensorData.values[i],
                    name: numericString
                }
                subPlotData.push(dataPoint);
            }
            plotData.push(subPlotData);
        }

        let ticker;
        Tracker.nonreactive(() => {
            ticker = Session.get('globalTicker');
        });
        Template.instance().plotData = plotData;

        Meteor.defer(() => {
            try {
                Highcharts.chart('bottomPlot', {
                    chart: {
                        type: 'column',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginTop:30
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    credits:{
                        enabled: false
                    },
                    series: [{
                        name: null,
                        data: plotData[ticker],
                        animation: {
                            duration: 1000
                        },
                        dataLabels: {
                            enabled: true,
                            color: '#F58220',
                            align: 'center',
                            format: '{point.name}', // one decimal
                            inside: false,
                            crop: false,
                            overflow:'none',
                            y: -2, // 10 pixels down from the top
                            x: 2,
                            style: {
                                fontSize: '0.9vw',
                                fontFamily: 'Verdana, sans-serif',
                                border: 'none',
                                textShadow: false,
                            }
                        },
                    }],
                    xAxis: {
                        categories: stationParamsDisplayName,
                        labels: {
                            style: {
                                fontSize: '0.9vw',
                                fontFamily: 'Verdana, sans-serif',
                                border: 'none',
                                textShadow: false,
                                fontWeight: 'bold'
                            }
                        },
                    },
                    yAxis: {
                        labels:{
                            enabled: false
                        },
                        min:0,
                        max:100
                    },
                    plotOptions: {
                        column: {
                            zones: [{
                                color: 'green'
                            }],
                        }
                    }
                });
            } catch(exception) {
                console.log(exception);
            }
        });
        }
        catch (e) {
            console.log(e);
        }
    },
    singleStationMode(){
        return Meteor.user().profile.stationViewMode === "single";
    },
    primaryStation() {
        return Meteor.user().profile.primaryStation;
    },
    proximityStations() {
        return Meteor.user().profile.proximityStations;
    }
});

/*****************************************************************************/
/* OceanPlots: Lifecycle Hooks */
/*****************************************************************************/
Template.OceanPlots.onCreated(function() {
});
Template.OceanPlots.onRendered(function() {
    let _this = Blaze.Template.instance();

    Meteor.defer(() => {

        let topPlot = $('#topPlot').highcharts();
        let bottomPlot = $('#bottomPlot').highcharts();
        let globalTimer = (new Date(Session.get('globalTimer'))).getTime();
        let plotLineId = 'plotLineId';
        Meteor.setTimeout(() => {
            topPlot.xAxis[0].addPlotLine({
                value: globalTimer,
                width: 4,
                color: 'Orange',
                id: plotLineId
            });

            Tracker.autorun(() => {
                try {
                    let globalTimer = (new Date(Session.get('globalTimer'))).getTime(),
                        plotB;

                    if (topPlot.xAxis && topPlot.xAxis.length > 0) {
                        _.each(topPlot.xAxis[0].plotLinesAndBands,(plotLineBand) => {
                            if (plotLineBand.id === plotLineId) {
                                plotB = plotLineBand;
                            }
                        });

                        Object.assign(plotB.options, {
                            value : globalTimer,
                        });
                        plotB.render();
                    } else {
                        throw new Meteor.Error('throw');
                    }

                    let ticker = Session.get('globalTicker');
                    if(bottomPlot && bottomPlot.series) {
                        bottomPlot.series[0].setData( _this.plotData[ticker]);
                    }

                } catch(e) {
                    topPlot = $('#topPlot').highcharts();
                    topPlot.xAxis[0].addPlotLine({
                        value: globalTimer,
                        width: 4,
                        color: 'Orange',
                        id: plotLineId
                    });

                    bottomPlot = $('#bottomPlot').highcharts();
                    bottomPlot.redraw();
                    console.log(e);
                }
            });
        }, 2000);
    });
});
