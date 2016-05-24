/*****************************************************************************/
/* OceanPlots: Event Handlers */
/*****************************************************************************/
Template.OceanPlots.events({

});

/*****************************************************************************/
/* OceanPlots: Helpers */
/*****************************************************************************/
Template.OceanPlots.helpers({
    topGenresChart() {
        console.log(this);
        var myPlotLineId = "myPlotLine";
        return {
            chart: {
                type: 'spline',

                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        var data=Session.get( "SeriesObject" );
                        var currentIndex = data[0].x;

                        var length=data.length;
                        var lastindex=data[length-1].x;
                        var chart = this;
                        // var l = chart.series[0].points.length;
                        var l = 30;
                        var xAxis = this.series[0].chart.xAxis[0];

                        xAxis.addPlotLine({
                            value: currentIndex,
                            width: 2,
                            color: 'Dark orange',
                            dashStyle: 'dash',
                            id: myPlotLineId
                        });
                        let plot = function () {


                            //console.log(currentIndex);
                            if (currentIndex > l)
                                {
                                    if(currentIndex>=lastindex)
                                        {
                                            currentIndex = data[0].x;

                                            $.each(xAxis.plotLinesAndBands, function () {
                                                if (this.id === myPlotLineId) {
                                                    this.destroy();
                                                }
                                            });
                                            xAxis.addPlotLine({
                                                value:currentIndex,
                                                width: 2,
                                                color: 'Dark orange',
                                                dashStyle: 'dash',
                                                id: myPlotLineId
                                            });
                                        }
                                        else
                                            {
                                                $.each(xAxis.plotLinesAndBands, function () {
                                                    if (this.id === myPlotLineId) {
                                                        this.destroy();
                                                    }
                                                });
                                                xAxis.addPlotLine({
                                                    value: currentIndex=currentIndex+3600000,
                                                        width: 2,
                                                    color: 'Orange',
                                                    //dashStyle: 'dash',
                                                    id: myPlotLineId
                                                });

                                            }

                                }

                                //
                                var columntime=currentIndex;

                                var excelDateString=moment.utc(currentIndex).format('MM/DD/YYYY HH:mm A');;


                                chart.setTitle({text: "Water ELEVATION(feet) " + excelDateString});

                        }
                        setInterval(() => {
                            plot()
                        }, 1000*10);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 10,
                labels: {
                    rotation:90,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function () {

                    Meteor.call( 'getCommentsWithFuture', function( error, response ) {
                        var data=[];
                        if ( error ) {

                            console.log( error );
                        } else {

                            for(i=0;i<response.data.data.gage_height.times.length;i++)
                            {

                                var  time = (new Date(response.data.data.gage_height.times[i].toLocaleString())).getTime();
                                data.push({
                                    x: time+i*1000,
                                    y: response.data.data.gage_height.values[0][i]
                                });
                            }
                            //console.log(data);
                            Session.set( "SeriesObject", data );

                        }

                    });


                    return Session.get( "SeriesObject" );
                }())
            }]
        };
    },
    bottomGenresChart() {
        var columnchart;
        var columntime;
        return {
            chart: {
                type: 'column',

                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {
                        var data=Session.get( "SeriesObjectColumn" );

                        var length=data.length;

                        var chart = this;

                        var l = 30;
                        var xAxis = this.series[0].chart.xAxis[0];

                        var  j=0;
                        let plot = function () {

                            if(j<length)
                                {

                                    var newdata=[];


                                    newdata.push({
                                        x: data[j].x,
                                        y: data[j].y
                                    });

                                    chart.series[0].setData(newdata);
                                    columntime=data[j].x;

                                    var excelDateString=moment.utc(columntime).format('MM/DD/YYYY HH:mm A');;


                                    chart.setTitle({text: "Water ELEVATION(feet) " + excelDateString});


                                    chart.setTitle({text: "Sea Water Salinity " + excelDateString});
                                    j++;

                                }
                                else
                                    {
                                        j=0;
                                    }

                        }
                        plot();
                        setInterval(() => {
                            plot()
                        }, 1000*10);
                    }
                }
            },
            title: {
                text: 'sea_water_salinity '
            },
            xAxis: {
                type: 'datetime',

                labels: {
                    rotation:90,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function () {

                    Meteor.call( 'getCommentsWithFuture', function( error, response ) {
                        var data=[];

                        var datafull=[];


                        if ( error ) {

                            console.log( error );
                        } else {

                            for(i=0;i<1;i++)
                            {

                                var  time = (new Date(response.data.data.sea_water_salinity.times[i].toLocaleString())).getTime();
                                data.push({
                                    x: time+i*1000,
                                    y: response.data.data.sea_water_salinity.values[0][i]
                                });
                            }

                            Session.set( "SeriesObjectColumnN", data );

                            for(i=0;i<response.data.data.sea_water_salinity.times.length;i++)
                            {

                                var  time = (new Date(response.data.data.sea_water_salinity.times[i].toLocaleString())).getTime();
                                datafull.push({
                                    x: time+i*1000,
                                    y: response.data.data.sea_water_salinity.values[0][i]
                                });
                            }

                            Session.set( "SeriesObjectColumn", datafull );

                        }
                        //console.log(datafull);
                    });


                    //console.log(Session.get( "SeriesObjectColumn" ));
                    return Session.get( "SeriesObjectColumnN" );
                }())
            }]
        };


    }
});

/*****************************************************************************/
/* OceanPlots: Lifecycle Hooks */
/*****************************************************************************/
Template.OceanPlots.onCreated(() => {
});

Template.OceanPlots.onRendered(() => {
    let tmplContext = Blaze.TemplateInstance.prototype;
    tmplContext.plotDep = new Tracker.Dependency;
});

Template.OceanPlots.onDestroyed(() => {
});
