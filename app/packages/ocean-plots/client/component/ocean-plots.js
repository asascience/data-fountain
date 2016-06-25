import Highcharts from 'highcharts';
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
            let primaryStation = Meteor.user().profile.primaryStation;
            let topPlotDataParameter = Meteor.user().profile.topPlotDataParameter;
            let primaryStationData = Data.findOne({title: primaryStation},
                                                  {fields: {data: 1, title: 1}});

            if (!primaryStationData.data) throw `No Data available for ${primaryStation}`;
            if (!primaryStationData.data.times) throw `No Time for ${primaryStation}`;

            // Look into turning the values data from an array of array, to just one array.
            let times = primaryStationData.data.times,
                plotData = primaryStationData.data[topPlotDataParameter].values[0],
                units = primaryStationData.data[topPlotDataParameter].units;

            let dataSet = times.map((data, index) => {
                return [moment(times[index]).unix()*1000, (plotData[index] === 'NaN') ? null : plotData[index]];
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
                                text: `${topPlotDataParameter} (${units})`,
                                style: {
                                    fontSize: '20px',
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
                                    fontSize: '16px',
                                    fontFamily: 'Verdana, sans-serif',
                                    fontWeight: 'bold'
                                }
                            },
                            title: {
                                text: null
                            }
                        },
                        series: [{
                            data: dataSet,
                            type: 'area',
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
                                                  {fields: {title: 1, data: 1}});

                let dataSet = [],
                    axisLabels = [],
                    times = primaryStationData.data.times,
                    units = primaryStationData.data[bottomPlotDataParameter].units;

                proximityStationsData.forEach((item, index) => {
                    dataSet.push(item.data[bottomPlotDataParameter].values[0]);
                    axisLabels.push(item.title);
                });

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
                                        fontSize: '20px',
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
                                        fontSize: '20px',
                                        fontFamily: 'Verdana, sans-serif',
                                        border: 'none',
                                        textShadow: false,
                                        fontWeight: 'bold'
                                    }
                                },
                            },
                            yAxis: {
                                title: {
                                    text: `${bottomPlotDataParameter} (${units})`,
                                    style: {
                                        fontSize: '20px',
                                        fontFamily: 'Verdana, sans-serif',
                                        fontWeight: 'bold'
                                    }
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
Template.OceanPlots.onCreated(() => {
});

Template.OceanPlots.onRendered(() => {
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
                            console.log(exception);
                        }
                    });

                    Tracker.autorun(() => {
                        try {
                            let ticker = Session.get('globalTicker');
                            bottomPlot.series[0].setData( _this.plotData[ticker]);
                        } catch(exception) {
                            console.log(exception);
                        }
                    });
                } catch(exception) {
                    console.log(exception);
                }
            }, 2000);
        });
    } catch(exception) {
        console.log(exception);
    }
});
