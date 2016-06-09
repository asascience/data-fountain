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

});

/*****************************************************************************/
/* OceanPlots: Lifecycle Hooks */
/*****************************************************************************/
Template.OceanPlots.onCreated(() => {

});

Template.OceanPlots.onRendered(() => {
    const TIMER_DELAY = 1000 * Meteor.settings.public.screenRefreshDelaySeconds;

    let data=[];

    let datacolumn1=[];
    let datacolumnfull=[];


    let dataSusquehanna=[];

    let dataAnnapolis=[];

    let dataUpperPotomac=[];


    let dataPatapsco=[];

    let dataGoosesReef=[];

    let categories=[];

    let projectNames = [];
    let listOfProjects = Data.find().fetch();

    _.each(listOfProjects, (obj) => {


        if(obj.id=="df-01")
            {
                projectNames.push(obj.data.gageHeight);
            }
    });



    for(i=0;i<projectNames[0].times.length;i++)
    {
        let  time = (new Date(projectNames[0].times[i].toLocaleString())).getTime();

        data.push({
            x: time,
            y: projectNames[0].values[0][i]
        });

    }


    //column


    let projectNamesColumn = [];
    let listOfProjectscolumn = Data.find().fetch();

    _.each(listOfProjectscolumn, (obj) => {
        if(obj.id=="df-10" || obj.id=="df-06" || obj.id=="df-07" || obj.id=="df-08" || obj.id=="df-05")
            {
                projectNamesColumn.push({label: obj.title, value: obj.id,data:obj.data.seaWaterSalinity});
            }
    });

    for(i=0;i<5;i++){
        for(j=0;j<1;j++){
            categories.push(projectNamesColumn[i].label);
            datacolumn1.push(projectNamesColumn[i].data.values[j][0]);
        }
    }

    for(i=0;i<5;i++)
    {
        let  time = (new Date(projectNames[0].times[i].toLocaleString())).getTime();

        if(projectNamesColumn[i].label=="First Landing")
            {
                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                {
                    dataSusquehanna.push({
                        x: time,
                        y: projectNamesColumn[i].data.values[0][j],
                        title:projectNamesColumn[i].label
                    });
                }
            }else if(projectNamesColumn[i].label=="Stingray Point")
                {
                    for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                    {
                        dataAnnapolis.push({
                            x: time,
                            y: projectNamesColumn[i].data.values[0][j],
                            title:projectNamesColumn[i].label
                        });


                    }

                }else if(projectNamesColumn[i].label=="Potomac")
                    {
                        for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                        {

                            dataUpperPotomac.push({
                                x: time,
                                y: projectNamesColumn[i].data.values[0][j],
                                title:projectNamesColumn[i].label
                            });


                        }
                    }else if(projectNamesColumn[i].label=="Jamestown")
                        {
                            for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                            {
                                dataPatapsco.push({
                                    x: time,
                                    y: projectNamesColumn[i].data.values[0][j],
                                    title:projectNamesColumn[i].label
                                });


                            }
                        }else if(projectNamesColumn[i].label=="Gooses Reef")
                            {
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
                                    dataGoosesReef.push({
                                        x: time,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
    }

    datacolumn1


    //series
    $('#container-series').highcharts({
        credits:{
            enabled: false
        },
        plotOptions: {
            spline: {
                lineWidth: 6,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                }
            }
        },
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {
                    let  j=0;
                    let myPlotLineId = "myPlotLine";
                    let currentIndex = data[0].x;
                    let length=data.length;
                    let lastindex=data[length-1].x;
                    let chart = $('#container-series').highcharts();
                    let l = 30;
                    let xAxis = this.series[0].chart.xAxis[0];
                    let currentindextime=moment.utc(currentIndex).format('MM/DD/YYYY HH:mm A');

                    xAxis.addPlotLine({
                        value: currentIndex,
                        width: 4,
                        color: 'Orange',
                        id: myPlotLineId
                    });

                    let loopIndex = 0;

                    Meteor.setInterval(function () {
                        if (loopIndex > 44){
                            loopIndex = 0;
                        }

                        let plotB = null;
                        _.each(xAxis.plotLinesAndBands, function (plotLineBand) {
                            if (plotLineBand.id === myPlotLineId) {
                                plotB = plotLineBand;
                            }
                        });

                        let newIdx = currentIndex + (loopIndex * 3600000);
                        plotB.svgElem.destroy();
                        plotB.svgElem = undefined;

                        $.extend(plotB.options, {
                            value : newIdx
                        });

                        plotB.render();

                        loopIndex+=1;

                        let columntime=currentIndex;

                        let excelDateString=moment.utc(currentIndex).format('MM/DD/YYYY HH:mm A');;

                        let chartseries = $('#container-column').highcharts();

                        let dataColumn=datacolumn1;
                        let length=dataColumn.length;
                        let xAxisColumn = chartseries.series[0].chart.xAxis[0];
                        let dynamiccategories=[];

                        let dynamicdata=[];



                        dynamiccategories=['Susquehanna', 'Annapolis', 'Upper Potomac', 'Patapsco', 'Gooses Reef'];


                        dynamicdata=[{y:dataSusquehanna[loopIndex].y, color:getColorForVal(dataSusquehanna[loopIndex].y,)},
                            {y:dataAnnapolis[loopIndex].y, color:getColorForVal(dataSusquehanna[loopIndex].y,)},
                        {y:dataUpperPotomac[loopIndex].y, color:getColorForVal(dataUpperPotomac[loopIndex].y,)},
                        {y:dataPatapsco[loopIndex].y, color:getColorForVal(dataPatapsco[loopIndex].y,)},
                        {y:dataGoosesReef[loopIndex].y, color:getColorForVal(dataGoosesReef[loopIndex].y,)}
                        ]


                        chartseries.series[0].chart.xAxis[0].setCategories(dynamiccategories);
                        chartseries.series[0].setData(dynamicdata);

                    }, TIMER_DELAY);

                }
            }
        },
        title: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 60,
            labels: {
                rotation:0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Water Level (ft)'
            },

            plotLines: [{
                value: 1464814800,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            enabled : false,
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
            name : 'Random data',
            data : data
        }]

    });
    //
    //column chart start

    $('#container-column').highcharts({
        credits:{
            enabled: false
        },
        chart: {
            type: 'column',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                }
            }
        },
        title: {
            text: null
        },

        plotOptions: {
        },
        xAxis: {
            categories: categories,
            labels: {
                rotation: 0,
                y: 20,
                style: {
                    color: '#000',
                    font: '14px Verdana, sans-serif',
                },
            }
        },

        yAxis: {
            min: 0,
            max: 30,
            title: {
                text: 'Salinity (PSU)'
            },

        },
        tooltip: {
            enabled: false,
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    (this.x) + '<br/>' +
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
            data: datacolumn1
        }]
    });


});

function getColorForVal(data){
    let color = '#4994D0'
    if (data > 20){
        color = '#990000';
    }else if (data > 13){
        color = '#e5e500';
    }else{

    }
    return color;
}
