/*****************************************************************************/
/* OceanPlots: Event Handlers */
/*****************************************************************************/
Template.OceanPlots.events({
	
});

/*****************************************************************************/
/* OceanPlots: Helpers */
/*****************************************************************************/
Template.OceanPlots.helpers({
});

/*****************************************************************************/
/* OceanPlots: Lifecycle Hooks */
/*****************************************************************************/
Template.OceanPlots.onCreated(() => {
	
		
});

Template.OceanPlots.onRendered(() => {
	
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
              console.log(data);
	             Session.set( "SeriesObject", data );
	
  }
 
});


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
             console.log(datafull);
	             Session.set( "SeriesObjectColumn", datafull );
	
  }
 
});
	
	
	   builtSeries();
	   
	   builtcolumn();
});

Template.OceanPlots.onDestroyed(() => {
});







function builtSeries() {
     
    $('#container-series').highcharts({
       		    chart: {
                type: 'spline',
				
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                      load: function () {
						   var  j=0;
						   var myPlotLineId = "myPlotLine";
						  var data=Session.get( "SeriesObject" );
console.log(Session.get( "SeriesObject" ));
var currentIndex = data[0].x;


console.log(data.length);
var length=data.length;
var lastindex=data[length-1].x;
                var chart = this;
                // var l = chart.series[0].points.length;
                var l = 30;
                var xAxis = this.series[0].chart.xAxis[0];
				
				//console.log(currentIndex);
				//console.log(lastindex);
                xAxis.addPlotLine({
                    value: currentIndex,
                    width: 2,
                    color: 'Dark orange',
                    dashStyle: 'dash',                   
                    id: myPlotLineId
                });    
                setInterval(function () {
					
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

					var chartseries = $('#container-column').highcharts();
				 chartseries.setTitle({text: "Sea Water Salinity " + excelDateString});
				 console.log(chartseries.xAxis[0]);
				 //
				 
				 
				 
				 //
				var dataColumn=Session.get( "SeriesObjectColumn" );
				var length=dataColumn.length;
                console.log(length);
                var xAxisColumn = chartseries.series[0].chart.xAxis[0];
				
				   if(j<length)
					{
					
					var newdata=[];
					
					 newdata.push({
                            x: dataColumn[j].x,
                            y: dataColumn[j].y
                        });
					chartseries.series[0].setData(newdata);
		             columntime=dataColumn[j].x;
					 
var excelDateString=moment.utc(columntime).format('MM/DD/YYYY HH:mm A');;
j++;
						
					}
					else
					{
						j=0;
					}
				 
					
                }, 1000);
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
    	 return Session.get( "SeriesObject" );
                }())
            }]
    });
}

//built column

function builtcolumn() {
	
	$('#container-column').highcharts({
	  chart: {
                type: 'column',
				
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                      load: function () {
						  var data=Session.get( "SeriesObjectColumn" );
						console.log(length);
var length=data.length;

                var chart = this;
              
                var l = 30;
                var xAxis = this.series[0].chart.xAxis[0];
			
			var  j=0;
       
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
    	 return Session.get( "SeriesObjectColumnN" );
                }())
            }]
    });
}




