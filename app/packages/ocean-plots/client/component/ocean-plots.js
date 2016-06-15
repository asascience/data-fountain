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

    var data=[];

    var datacolumn1=[];
    var datacolumnfull=[];


    var dataSusquehanna=[];

    var dataAnnapolis=[];

    var dataUpperPotomac=[];


    var dataPatapsco=[];

    var dataGoosesReef=[];
	
	var dataNorfolk=[];
	
	var dataStingrayPoint=[];
	
	var dataJamestown=[];
	
	var dataFirstLanding=[];
	
	var dataPotomac=[];

    var categories=[];

    var projectNames = [];
    var listOfProjects = Data.find().fetch();

    _.each(listOfProjects, (obj) => {


        if(obj.id=="df-01")
            {
                projectNames.push(obj.data.gageHeight);
            }
    });



    for(i=0;i<projectNames[0].times.length;i++)
    {
        let  time = (new Date(projectNames[0].times[i].toLocaleString())).getTime();
        if (projectNames[0].values[0][i] === 'NaN') {
            console.log(`No data available for date (with british accent) ${projectNames}`);
        } else {
            data.push({
                x: time,
                y: projectNames[0].values[0][i]
            });
        }

    }


    //column

    var projectNamesColumn = [];
    var listOfProjectscolumn = Data.find().fetch();

    _.each(listOfProjectscolumn, (obj) => {
       
                projectNamesColumn.push({label: obj.title, value: obj.id,data:obj.data.seaWaterSalinity});
           
    });

	
    for(i=0;i<10;i++){
        for(j=0;j<1;j++){
            categories.push(projectNamesColumn[i].label);
            datacolumn1.push(projectNamesColumn[i].data.values[j][0]);
        }
    }

    for(i=0;i<10;i++)
    {
        var  time = (new Date(projectNames[0].times[i].toLocaleString())).getTime();

        if(projectNamesColumn[i].label=="Susquehanna")
            {
                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                {
                    dataSusquehanna.push({
                        x: time,
                        y: projectNamesColumn[i].data.values[0][j],
                        title:projectNamesColumn[i].label
                    });
                }
            }else if(projectNamesColumn[i].label=="Annapolis")
                {
                    for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                    {
                        dataAnnapolis.push({
                            x: time,
                            y: projectNamesColumn[i].data.values[0][j],
                            title:projectNamesColumn[i].label
                        });


                    }

                }else if(projectNamesColumn[i].label=="Upper Potomac")
                    {
                        for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                        {

                            dataUpperPotomac.push({
                                x: time,
                                y: projectNamesColumn[i].data.values[0][j],
                                title:projectNamesColumn[i].label
                            });


                        }
                    }else if(projectNamesColumn[i].label=="Patapsco")
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
							
							else if(projectNamesColumn[i].label=="Norfolk")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
                                    dataNorfolk.push({
                                        x: time,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
							
							else if(projectNamesColumn[i].label=="Stingray Point")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
                                   dataStingrayPoint.push({
                                        x: time,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
							else if(projectNamesColumn[i].label=="Jamestown")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
                                   dataJamestown.push({
                                        x: time,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
							else if(projectNamesColumn[i].label== "Potomac")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
                                  dataPotomac.push({
                                        x: time,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
							else if(projectNamesColumn[i].label=="First Landing")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
                                  dataFirstLanding.push({
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
                    var  j=0;
                    var myPlotLineId = "myPlotLine";
                    var currentIndex = data[0].x;
                    var length=data.length;
                    var lastindex=data[length-1].x;
                    var chart = $('#container-series').highcharts();
                    var l = 30;
                    var xAxis = this.series[0].chart.xAxis[0];
                    var currentindextime=moment.utc(currentIndex).format('MM/DD/YYYY HH:mm A');
                    
                    xAxis.addPlotLine({
                        value: currentIndex,
                        width: 4,
                        color: 'Orange',
                        id: myPlotLineId
                    });

                    var loopIndex = 0;

                    Meteor.setInterval(function () {
                        if (loopIndex > 44){
                            loopIndex = 0;
                        }

                        var plotB = null;
                        _.each(xAxis.plotLinesAndBands, function (plotLineBand) {
                            if (plotLineBand.id === myPlotLineId) {
                                plotB = plotLineBand;
                            }
                        });

                        var newIdx = currentIndex + (loopIndex * 3600000);
                        plotB.svgElem.destroy();
                        plotB.svgElem = undefined;

                        $.extend(plotB.options, {
                            value : newIdx
                        });

                        plotB.render();

                        loopIndex+=1;

                        var columntime=currentIndex;

                        var excelDateString=moment.utc(newIdx).format('MM/DD/YYYY HH:mm A');;

                        var chartseries = $('#container-column').highcharts();

                        var dataColumn=datacolumn1;
                        var length=dataColumn.length;
                        var xAxisColumn = chartseries.series[0].chart.xAxis[0];
                        var dynamiccategories=[];

                        var dynamicdata=[];

					


                        dynamiccategories=['Susquehanna', 'Annapolis', 'Upper Potomac', 'Patapsco', 'Gooses Reef','Norfolk','Stingray Point','Jamestown','Potomac','First Landing'];


                        dynamicdata=[{y:dataSusquehanna[loopIndex].y, color:getColorForVal(dataSusquehanna[loopIndex].y,)},
                            {y:dataAnnapolis[loopIndex].y, color:getColorForVal(dataSusquehanna[loopIndex].y,)},
                        {y:dataUpperPotomac[loopIndex].y, color:getColorForVal(dataUpperPotomac[loopIndex].y,)},
                        {y:dataPatapsco[loopIndex].y, color:getColorForVal(dataPatapsco[loopIndex].y,)},
                        {y:dataGoosesReef[loopIndex].y, color:getColorForVal(dataGoosesReef[loopIndex].y,)},
						{y:dataNorfolk[loopIndex].y, color:getColorForVal(dataNorfolk[loopIndex].y,)},
						{y:dataStingrayPoint[loopIndex].y, color:getColorForVal(dataStingrayPoint[loopIndex].y,)},
						{y:dataJamestown[loopIndex].y, color:getColorForVal(dataJamestown[loopIndex].y,)},
						{y:dataPotomac[loopIndex].y, color:getColorForVal(dataPotomac[loopIndex].y,)},
						{y:dataFirstLanding[loopIndex].y, color:getColorForVal(dataFirstLanding[loopIndex].y,)}
						
                        ]


                        chartseries.series[0].chart.xAxis[0].setCategories(dynamiccategories);
                        chartseries.series[0].setData(dynamicdata);
						
                         chart.setTitle({text: "Gooses Reef " + excelDateString});              
                    }, TIMER_DELAY);

					//
					
   
	//
					
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
                text: 'Water Level (ft)',
				style: {
				fontSize: '20px',
                    fontFamily: 'Verdana, sans-serif'
				}
            },
  labels: {
            style: {
               fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
            }
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
            data : data,
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
                text: 'Salinity (PSU)',
				style: {
				fontSize: '20px',
                    fontFamily: 'Verdana, sans-serif'
				}
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
    var color = '#4994D0'
    if (data > 20){
        color = '#990000';
    }else if (data > 13){
        color = '#e5e500';
    }else{

    }
    return color;
}
