import Highcharts from 'highcharts';
//Add support for update method
Highcharts.PlotLineOrBand.prototype.update = function (newOptions){
    let plotBand = this;
    Highcharts.extend(plotBand.options, newOptions);
    if (plotBand.svgElem) {
        plotBand.svgElem.destroy();
        plotBand.svgElem = undefined;
        plotBand.render();
    }
}
