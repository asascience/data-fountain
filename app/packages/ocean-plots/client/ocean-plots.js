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

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

export default function camelToRegular(string) {
    return string.replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => { return str.toUpperCase(); })
}
