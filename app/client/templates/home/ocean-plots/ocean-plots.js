/*****************************************************************************/
/* OceanPlots: Event Handlers */
/*****************************************************************************/
Template.OceanPlots.events({

});



/*****************************************************************************/
/* OceanPlots: Lifecycle Hooks */
/*****************************************************************************/
Template.OceanPlots.onCreated(() => {


});

Template.OceanPlots.onRendered(() => {

    var data=[];

    var datacolumn1=[];
    var datacolumnfull=[];


    var dataSusquehanna=[];

    var dataAnnapolis=[];

    var dataUpperPotomac=[];


    var dataPatapsco=[];

    var dataGoosesReef=[];

    var categories=[];

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
        var  time = (new Date(projectNames[0].times[i].toLocaleString())).getTime();

        data.push({
            x: time,
            y: projectNames[0].values[0][i]
        });

    }


    //column


    let projectNamesColumn = [];
    let listOfProjectscolumn = Data.find().fetch();

    //console.log(listOfProjectscolumn);
    _.each(listOfProjectscolumn, (obj) => {

        if(obj.id=="df-10" || obj.id=="df-06" || obj.id=="df-07" || obj.id=="df-08" || obj.id=="df-05")
            {
                projectNamesColumn.push({label: obj.title, value: obj.id,data:obj.data.seaWaterSalinity});
            }
    });


    //

    /* //console.log(projectNamesColumn);

    //console.log(projectNamesColumn.length);
    */

    ////console.log(projectNamesColumn);

    for(i=0;i<5;i++)
    {
        //var  time = (new Date(projectNames[0].times[i].toLocaleString())).getTime();
        ////console.log(projectNamesColumn[i].data.times.length);

        for(j=0;j<1;j++)
        {
            /*  datacolumn1.push({
x: projectNamesColumn[i].label,
y: projectNamesColumn[i].data.values[0][j]
}); */

        categories.push(projectNamesColumn[i].label);

        datacolumn1.push(projectNamesColumn[i].data.values[j][0]);
        }


}

for(i=0;i<5;i++)
{
    var  time = (new Date(projectNames[0].times[i].toLocaleString())).getTime();
    ////console.log(projectNamesColumn[i].data.times.length);

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

    console.log(categories);
    /*  console.log(categories);
        console.log(datacolumn1); */




    //series

    $('#container-series').highcharts({
        chart: {
            type: 'spline',

            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {
                    var  j=0;
                    var myPlotLineId = "myPlotLine";

                    ////console.log(Session.get( "SeriesObject" ));
                    var currentIndex = data[0].x;


                    ////console.log(data.length);
                    var length=data.length;
                    var lastindex=data[length-1].x;
                    var chart = $('#container-series').highcharts();;
                    // var l = chart.series[0].points.length;
                    var l = 30;
                    var xAxis = this.series[0].chart.xAxis[0];

                    ////console.log(currentIndex);
                    ////console.log(lastindex);

                    var currentindextime=moment.utc(currentIndex).format('MM/DD/YYYY HH:mm A');

                    console.log(currentindextime);
                    xAxis.addPlotLine({
                        value: currentIndex,
                        width: 2,
                        color: 'Dark orange',
                        dashStyle: 'dash',
                        id: myPlotLineId
                    });

                    var k=0;
                    setInterval(function () {

                        ////console.log(currentIndex);
                        $.each(xAxis.plotLinesAndBands, function () {
                            if (this.id === myPlotLineId) {
                                this.destroy();
                            }
                        });

                        if (currentIndex > l)
                            {
                                if(currentIndex>=lastindex)
                                    {


                                        //console.log(lastindex)
                                        currentIndex = data[0].x;


                                        if (this.id === myPlotLineId) {
                                            this.destroy();
                                        }

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
                                            ////console.log(currentIndex);
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



                                        }


                                        //
                                        var columntime=currentIndex;

                                        var excelDateString=moment.utc(currentIndex).format('MM/DD/YYYY HH:mm A');;

                                        var chartseries = $('#container-column').highcharts();

                                        var dataColumn=datacolumn1;
                                        var length=dataColumn.length;
                                        // //console.log(length);
                                        var xAxisColumn = chartseries.series[0].chart.xAxis[0];
                                        var dynamiccategories=[];

                                        var dynamicdata=[];



                                        dynamiccategories=['Susquehanna', 'Annapolis', 'Upper Potomac', 'Patapsco', 'Gooses Reef'];

                                        console.log(dataSusquehanna.length);

                                        console.log(dataAnnapolis.length);

                                        console.log(dataUpperPotomac.length);

                                        console.log(dataPatapsco.length);

                                        console.log(dataGoosesReef.length);

                                        if(k<46)
                                            {
                                                dynamicdata=[dataSusquehanna[k].y,dataAnnapolis[k].y,dataUpperPotomac[k].y,dataPatapsco[k].y,dataGoosesReef[k].y];

                                                chartseries.series[0].chart.xAxis[0].setCategories(dynamiccategories);

                                                chartseries.series[0].setData(dynamicdata);
                                            }
                                            else{
                                                k=0;
                                            }
                                            k++;
                            }
                    }, 1000);

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
            data: data
        }]

    });
    //
    //column chart start

    console.log(datacolumn1);
    $('#container-column').highcharts({
        chart: {
            type: 'column',

            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {
                    var data=datacolumn1;

                    var length=data.length;

                    var chart = this;

                    var l = 30;
                    var xAxis = this.series[0].chart.xAxis[0];

                    var  j=0;

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
                    font: '14px Nunito',
                    top: '100px'
                },
            }
        },

        yAxis: {
            title: {
                text: 'Sea Water Salinity'
            },

        },
        tooltip: {
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
            data:datacolumn1
        }]
    });


    //column chart end


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
                    ////console.log(Session.get( "SeriesObject" ));
                    var currentIndex = data[0].x;


                    ////console.log(data.length);
                    var length=data.length;
                    var lastindex=data[length-1].x;
                    var chart = $('#container-series').highcharts();;
                    // var l = chart.series[0].points.length;
                    var l = 30;
                    var xAxis = this.series[0].chart.xAxis[0];

                    ////console.log(currentIndex);
                    ////console.log(lastindex);
                    xAxis.addPlotLine({
                        value: currentIndex,
                        width: 2,
                        color: 'Dark orange',
                        dashStyle: 'dash',
                        id: myPlotLineId
                    });
                    setInterval(function () {

                        //console.log(currentIndex);
                        $.each(xAxis.plotLinesAndBands, function () {
                            if (this.id === myPlotLineId) {
                                this.destroy();
                            }
                        });

                        if (currentIndex > l)
                            {
                                if(currentIndex>=lastindex)
                                    {

                                        //console.log(lastindex)
                                        currentIndex = data[0].x;


                                        if (this.id === myPlotLineId) {
                                            this.destroy();
                                        }

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
                                            ////console.log(currentIndex);
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


                                        //
                                        var columntime=currentIndex;

                                        var excelDateString=moment.utc(currentIndex).format('MM/DD/YYYY HH:mm A');;

                                        var chartseries = $('#container-column').highcharts();
                                        chartseries.setTitle({text: "Sea Water Salinity " + excelDateString});
                                        ////console.log(chartseries.xAxis[0]);
                                        //



                                        //
                                        var dataColumn=Session.get( "SeriesObjectColumn" );
                                        var length=dataColumn.length;
                                        //console.log(length);
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

                            }
                    }, 1000);

                }
            }
        },
        title: {
            text: 'Water Level (ft)'
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
                    //console.log(length);
                    var length=data.length;

                    var chart = this;

                    var l = 30;
                    var xAxis = this.series[0].chart.xAxis[0];

                    var  j=0;

                }
            }
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


