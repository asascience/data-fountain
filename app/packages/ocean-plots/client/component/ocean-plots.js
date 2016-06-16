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


        if(obj.id=="df-05")
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
			
			if(projectNamesColumn[i].data!=undefined)
			{
				categories.push(projectNamesColumn[i].label);
            datacolumn1.push(projectNamesColumn[i].data.values[j][0]);
			}
			
            
        }
    }

	
    for(i=0;i<10;i++)
    {
		if(projectNames[0].times[i]!=undefined)
		{
		
		
     

        if(projectNamesColumn[i].label=="Susquehanna")
            {
                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                {
					
					var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                    dataSusquehanna.push({
						
                        x: updatedtime,
                        y: projectNamesColumn[i].data.values[0][j],
                        title:projectNamesColumn[i].label
                    });
					
					
                }
            }else if(projectNamesColumn[i].label=="Annapolis")
                {
                    for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                    {
						var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                        dataAnnapolis.push({
                           x: updatedtime,
                            y: projectNamesColumn[i].data.values[0][j],
                            title:projectNamesColumn[i].label
                        });


                    }

                }else if(projectNamesColumn[i].label=="Upper Potomac")
                    {
                        for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                        {
                             var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                            dataUpperPotomac.push({
                                x: updatedtime,
                                y: projectNamesColumn[i].data.values[0][j],
                                title:projectNamesColumn[i].label
                            });


                        }
                    }else if(projectNamesColumn[i].label=="Patapsco")
                        {
                            for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                            {
								var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                                dataPatapsco.push({
                                    x: updatedtime,
                                    y: projectNamesColumn[i].data.values[0][j],
                                    title:projectNamesColumn[i].label
                                });


                            }
                        }else if(projectNamesColumn[i].label=="Gooses Reef")
                            {
								if(projectNamesColumn[i].data!=undefined)
								{
									
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
									var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                                    dataGoosesReef.push({
                                         x: updatedtime,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
							}
                            }
							
							else if(projectNamesColumn[i].label=="Norfolk")
                            {
								if(projectNamesColumn[i].data!=undefined)
								{
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
									var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                                    dataNorfolk.push({
                                         x: updatedtime,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
								}
                            }
							
							else if(projectNamesColumn[i].label=="Stingray Point")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
									var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                                   dataStingrayPoint.push({
                                       x: updatedtime,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
							else if(projectNamesColumn[i].label=="Jamestown")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
									var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                                   dataJamestown.push({
                                       x: updatedtime,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
							else if(projectNamesColumn[i].label== "Potomac")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
									var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                                  dataPotomac.push({
                                       x: updatedtime,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
							else if(projectNamesColumn[i].label=="First Landing")
                            {
								
                                for(j=0;j<projectNamesColumn[i].data.times.length;j++)
                                {
									var updatedtime=(new Date(projectNamesColumn[i].data.times[j].toLocaleString())).getTime();
                                  dataFirstLanding.push({
                                         x: updatedtime,
                                        y: projectNamesColumn[i].data.values[0][j],
                                        title:projectNamesColumn[i].label
                                    });
                                }
                            }
	}
    }

    datacolumn1
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
                   
	   var loopIndex = 0;
	  
	  
	   var  j=0;
                    var myPlotLineId = "myPlotLine";
					
					
                   
					
					
					 let  currenttime = (new Date(Session.get('globalTimer'))).getTime();
					var currentIndex=currenttime;
					
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

			
					Meteor.autorun(() => {
      
              
						 let  currenttimenew = (new Date(Session.get('globalTimer'))).getTime();
					var currentIndexnew=currenttimenew;
                        
                        var plotB = null;
                        _.each(xAxis.plotLinesAndBands, function (plotLineBand) {
                            if (plotLineBand.id === myPlotLineId) {
                                plotB = plotLineBand;
                            }
                        });

                        var newIdx = currentIndexnew;
                       /*   plotB.svgElem.destroy();
                        plotB.svgElem = undefined;  */

                        $.extend(plotB.options, {
                            value : newIdx
                        });

                        plotB.render();

                        var columntime=currentIndex;

                        var excelDateString=moment.utc(newIdx).format('MM/DD/YYYY HH:mm A');;

                        var chartseries = $('#container-column').highcharts();

                        var dataColumn=datacolumn1;
                        var length=dataColumn.length;
                       
                        var dynamiccategories=[];

                        var dynamicdata=[];
						
						var findy="";

						dynamiccategories=categories;
						
						
						
						for (k=0;k<dynamiccategories.length;k++)
						{
							if(dynamiccategories[k]=='Susquehanna')
							{
							   	
							 
							  
								for(i=0;i<dataSusquehanna.length;i++)
								{
									
									if(parseInt(dataSusquehanna[i].x)==parseInt(currentIndexnew))
									{ 
								
								    
										
										findy=dataSusquehanna[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
									
									
							}
							
							
							if(dynamiccategories[k]=='Annapolis')
							{
								
								for(i=0;i<dataAnnapolis.length;i++)
								{
									
									if(parseInt(dataAnnapolis[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataAnnapolis[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
						
							}
							if(dynamiccategories[k]=='Upper Potomac')
							{
								
								
								for(i=0;i<dataUpperPotomac.length;i++)
								{
									
									if(parseInt(dataUpperPotomac[i].x)==parseInt(currentIndexnew))
									{ 
								 
										
										findy=dataUpperPotomac[i].y;
										
										
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
							
							}
							if(dynamiccategories[k]=='Patapsco')
							{
								for(i=0;i<dataPatapsco.length;i++)
								{
									
									if(parseInt(dataPatapsco[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataPatapsco[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
								
						
							}
							if(dynamiccategories[k]=='Gooses Reef')
							{
								
								for(i=0;i<dataGoosesReef.length;i++)
								{
									
									if(parseInt(dataGoosesReef[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataGoosesReef[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
							
							}
							if(dynamiccategories[k]=='Norfolk')
							{
								
								for(i=0;i<dataNorfolk.length;i++)
								{
									
									if(parseInt(dataNorfolk[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataNorfolk[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
							
							}
							if(dynamiccategories[k]=='Stingray Point')
							{
								
								for(i=0;i<dataStingrayPoint.length;i++)
								{
									
									if(parseInt(dataStingrayPoint[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataStingrayPoint[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
								
							
							}
							if(dynamiccategories[k]=='Jamestown')
							{
								
								for(i=0;i<dataJamestown.length;i++)
								{
									
									if(parseInt(dataJamestown[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataJamestown[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
								
							
							}
							if(dynamiccategories[k]=='Potomac')
							{
								
								for(i=0;i<dataPotomac.length;i++)
								{
									
									if(parseInt(dataPotomac[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataPotomac[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
							
							}
							if(dynamiccategories[k]=='First Landing')
							{
								
								for(i=0;i<dataFirstLanding.length;i++)
								{
									
									if(parseInt(dataFirstLanding[i].x)==parseInt(currentIndexnew))
									{ 
								
										
										findy=dataFirstLanding[i].y;
									}
								}
						
								
							dynamicdata.push({
                                        y:findy,
                                        color: getColorForVal(findy)
                                    });
							
							}
						}


                        $('#container-column').highcharts().series[0].chart.xAxis[0].setCategories(dynamiccategories);
                        $('#container-column').highcharts().series[0].setData(dynamicdata);
						
						
						
                         chart.setTitle({text: "Gooses Reef " + excelDateString});   
					
					
					
		
		
    });

					
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

