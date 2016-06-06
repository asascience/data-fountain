/*****************************************************************************/
/* MetIcons: Event Handlers */
/*****************************************************************************/
Template.MetIcons.events({
});

/*****************************************************************************/
/* MetIcons: Helpers */
/*****************************************************************************/
Template.MetIcons.helpers({
    met() {
        try {
            let weather = Weather.find({}).fetch();
            weather = weather[0].currently;

            let payload = {
                icon: weather.icon,
                temp: Math.round(weather.temperature),
                wdsp: Math.round(weather.windSpeed),
                wdbr: weather.windBearing,
            };
            return payload;
        } catch (exception) {
            // fail silently.
        }
    },

    getWeatherIcon(byteValue, datetime) {
        /*
           gets the weather icon from the metar data, sky conditions
           */
        //byteValue-meanings: clear,few scattered, broken, overcast
        //byteValue: 0, 1, 3, 5, 8
        //datetime: moment date time of selected time
        //eg var datetime = moment()
        var iconSet = {
            "wi-day":{"0":"wi-day-sunny","1":"wi-day-cloudy","3":"wi-day-cloudy-windy","5":"wi-day-cloudy-high","8":"wi-day-sunny-overcast"},
            "wi-night":{"0":"wi-night-clear","1":"wi-night-cloudy","3":"wi-night-cloudy-windy","5":"wi-night-cloudy-high","8":"wi-night-alt-partly-cloudy"}
        }

        var times = SunCalc.getTimes(datetime, 39.544, -76.075);
        var icon;
        //is current time in daylight
        if (datetime.isAfter(moment(times.sunrise)) && datetime.isBefore(moment(times.sunset))){
            icon = iconSet['wi-day'][byteValue];
        }else{
            icon = iconSet['wi-night'][byteValue];
        }
        return icon;

    },
    getLunarPhaseIcon(){
        let datetime = new Date();
        /*
           gets the lunar phase icon from the moon illumination
datetime: moment date time of selected time, eg var datetime = moment()
fraction: 0.0 (new moon) to 1.0 (full moon)
phase: 0.0 to 1.0
*/
        var moonStatus = SunCalc.getMoonIllumination(datetime);
        //Phase Name: 0 New Moon, Waxing Crescent, 0.25  First Quarter, Waxing Gibbous, 0.5 Full Moon, Waning Gibbous, 0.75  Last Quarter, Waning Crescent
        var iconList = ['wi-moon-alt-new', 'wi-moon-alt-waxing-crescent-1', 'wi-moon-alt-waxing-crescent-2', 'wi-moon-alt-waxing-crescent-3', 'wi-moon-alt-waxing-crescent-4', 'wi-moon-alt-waxing-crescent-5', 'wi-moon-alt-waxing-crescent-6', 'wi-moon-alt-first-quarter', 'wi-moon-alt-waxing-gibbous-1', 'wi-moon-alt-waxing-gibbous-2', 'wi-moon-alt-waxing-gibbous-3', 'wi-moon-alt-waxing-gibbous-4', 'wi-moon-alt-waxing-gibbous-5', 'wi-moon-alt-waxing-gibbous-6', 'wi-moon-alt-full', 'wi-moon-alt-waning-gibbous-1', 'wi-moon-alt-waning-gibbous-2', 'wi-moon-alt-waning-gibbous-3', 'wi-moon-alt-waning-gibbous-4', 'wi-moon-alt-waning-gibbous-5', 'wi-moon-alt-waning-gibbous-6', 'wi-moon-alt-third-quarter', 'wi-moon-alt-waning-crescent-1', 'wi-moon-alt-waning-crescent-2', 'wi-moon-alt-waning-crescent-3', 'wi-moon-alt-waning-crescent-4', 'wi-moon-alt-waning-crescent-5', 'wi-moon-alt-waning-crescent-6']
            var step = 1/iconList.length

        var o = d3.scale.linear()
        .domain(d3.range(0,1+step,step))
        .range(d3.range(0,iconList.length+1));

        var idx = Math.floor(o(moonStatus.fraction.toFixed(2)));
        return iconList[idx];
    }
});

/*****************************************************************************/
/* MetIcons: Lifecycle Hooks */
/*****************************************************************************/
Template.MetIcons.onCreated(() => {
});

Template.MetIcons.onRendered(() => {
    $('[data-skycon]').each(initSkycon);
});

Template.MetIcons.onDestroyed(() => {
});
