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
            let primaryStation = Meteor.user().profile.primaryStation,
                topPlotDataParameter = Meteor.user().profile.topPlotDataParameter,
                primaryStationData = Data.findOne({title: primaryStation},
                                                  {fields: {data: 1, title: 1}}),
                plotDisplayName = camelToRegular(topPlotDataParameter);

            if (!primaryStationData.data) throw `No Data available for ${primaryStation}`;
            if (!primaryStationData.data.times) throw `No Time for ${primaryStation}`;

            let times = primaryStationData.data.times,
                plotData = primaryStationData.data[topPlotDataParameter].values,
                units = primaryStationData.data[topPlotDataParameter].units;

            // normalize the range so we're only using available times for the requested duratiobn.,
            times = times.splice(times.length - Meteor.user().profile.dataDuration -1, times.length);

            let dataSet = times.map((data, index) => {
                return [moment(times[index]).unix()*1000, (plotData[index] === 'NaN' || typeof(plotData[index]) === 'undefined') ? null : plotData[index]];
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
        try {
            let proximityStations = Meteor.user().profile.proximityStations,
                primaryStation =  Meteor.user().profile.primaryStation;
                proximityStationsData = Data.find({'title': {$in: proximityStations}}, {fields: {data: 1, title: 1}}).fetch(),
                bottomPlotDataParameter = Meteor.user().profile.bottomPlotDataParameter,
                primaryStationData = Data.findOne({title: primaryStation},
                                                  {fields: {title: 1, data: 1}}),
                plotDisplayName = camelToRegular(bottomPlotDataParameter);

                let dataSet = [],
                    axisLabels = [],
                    times = primaryStationData.data.times,
                    units = primaryStationData.data[bottomPlotDataParameter].units;


                for (let i=0; i<proximityStations.length-1;i++) {
                    dataSet.push(undefined);
                    axisLabels.push(undefined);
                }

                proximityStationsData.forEach((item, index) => {
                    let originalIndex = proximityStations.indexOf(item.title);
                    dataSet[originalIndex] = item.data[bottomPlotDataParameter].values;
                    axisLabels[originalIndex] = item.title;
                });

                let flattenArray = [].concat(...dataSet);
                // get the min and max values from a multidimensional array
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
                                name: 'Random data',
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
                                    zones: [{
                                        value: Meteor.user().profile.parameterAlerts.lowAlert,
                                        color: 'red'
                                    }, {
                                        value: Meteor.user().profile.parameterAlerts.midAlert,
                                        color: 'yellow'
                                    },
                                    {
                                        value: Meteor.user().profile.parameterAlerts.highAlert,
                                        color: 'green'
                                    },
                                    {
                                        color: 'green'
                                    }],
                                }
                            }
                        });
                    } catch(exception) {
                        console.log(exception);
                    }
                });
        } catch(exception) {
            console.log(exception);
        }
    },
    singleBottomPlot(){
        let stationName = Meteor.user().profile.primaryStation;
        let stationParameters = Meteor.user().profile.singleStationParameters;

        let stationData = Data.find({'title':stationName}).fetch()[0].data;
        
        for(var i = 0; i < stationParameters.length; i++){
            let currentData = stationData[stationParameters[i]].values;
            let max = Math.max.apply(Math, currentData);
            let min = Math.min.apply(Math, currentData);
            let dif = (max-min);
            
            let remappedData = currentData.map(function(val){
                return (val - min)/dif * (100);
            });
            stationData[stationParameters[i]].values = remappedData;
        }

        //This will be a multidimensional array. Each index will contain an array that contains the timeseries for each station parameter.
        let plotData = [];
        
        //Populate the array so that the nth element is an array of the nth elements of the stationData arrays.
        for(var i = 0; i < stationData[stationParameters[0]].values.length; i++){
            let subPlotData = [];
            for(var j = 0; j < stationParameters.length; j++){
                subPlotData.push(stationData[stationParameters[j]].values[i]);    
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
                        name: 'Random data',
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
                        categories: stationParameters,
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
                            //text: `${plotDisplayName} (${units})`,
                            style: {
                                fontSize: '0.9vw',
                                fontFamily: 'Verdana, sans-serif',
                                fontWeight: 'bold'
                            }
                        },
                        min: 0,
                        max: 100
                    },
                    plotOptions: {
                        column: {
                            zones: [{
                                value: Meteor.user().profile.parameterAlerts.lowAlert,
                                color: 'red'
                            }, {
                                value: Meteor.user().profile.parameterAlerts.midAlert,
                                color: 'yellow'
                            },
                            {
                                value: Meteor.user().profile.parameterAlerts.highAlert,
                                color: 'green'
                            },
                            {
                                color: 'green'
                            }],
                        }
                    }
                });
            } catch(exception) {
                console.log(exception);
            }
        });
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
    try {
        let _this = Blaze.Template.instance();

        Meteor.defer(() => {
            let topPlot = $('#topPlot').highcharts();
            let bottomPlot = $('#bottomPlot').highcharts();
            let globalTimer = (new Date(Session.get('globalTimer'))).getTime();
            let plotLineId = 'plotLineId';
            Meteor.setTimeout(() => {
                try {
                    topPlot.xAxis[0].addPlotLine({
                        value: globalTimer,
                        width: 4,
                        color: 'Orange',
                        id: plotLineId
                    });

                    Tracker.autorun(() => {
                        try {
                            let globalTimer = (new Date(Session.get('globalTimer'))).getTime();
                            _.each(topPlot.xAxis[0].plotLinesAndBands,(plotLineBand) => {
                                if (plotLineBand.id === plotLineId) {
                                    plotB = plotLineBand;
                                }
                            });

                            Object.assign(plotB.options, {
                                value : globalTimer,
                            });
                            plotB.render();
                        } catch(exception) {
                            /*Meteor.setTimeout(() => {
                                document.location.reload(true);
                            }, 2000);*/
                        }
                    });

                    Tracker.autorun(() => {
                        try {
                            let ticker = Session.get('globalTicker');
                            bottomPlot.series[0].setData( _this.plotData[ticker]);
                        } catch(exception) {
                           // Meteor.setTimeout(() => {
                             //   document.location.reload(true);
                            //}, 2000);
                        }
                    });
                } catch(exception) {
                    // Meteor.setTimeout(() => {
                    //     document.location.reload(true);
                    // }, 2000);
                }
            }, 2000);
        });
    } catch(exception) {
        console.log(exception);
        // Meteor.setTimeout(() => {
        //     document.location.reload(true);
        // }, 2000);
    }
});
