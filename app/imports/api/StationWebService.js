import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { moment } from 'meteor/mrt:moment';
import Buoy from 'buoyjs';
import humps from 'humps';

const Future = Npm.require('fibers/future');

export default class StationWebService {
    constructor() {}

    _getTimeStamp() {
        return Math.round(new Date().getTime()/1000);
    }

    _convertCtoF(value) {
        let fahr = value * 9 / 5 + 32;
        return fahr;
    }

    _convertKnotToMph(value) {
        let mph = value * 1.151;
        return mph;
    }

    fetchStations() {
        console.log('[+] Compiling a collection of stations');
        try {
            const HUMPS = require('humps');

            // go and get the stations, and convert the heathen snake case to
            // glorious camel case.
            let response = Assets.getText('stations/cbibs.json'),
                snakeData = JSON.parse(response),
                data = HUMPS.camelizeKeys(snakeData);

            // time stuff
            let currentUnix = this._getTimeStamp();


            data.forEach((station) => {
                Object.assign(station, {createdAt: currentUnix});
                Object.assign(station, {stationId: (station.ndbc) ? station.ndbc.split(':').reverse()[0] : null});
                Object.assign(station, {isPrimary: false});
                Stations.upsert({id: station.id}, station);
            });
            console.log('[+] Station compilations complete.');
            return;
        } catch (exception) {
            if (exception.response) {
                // We've caught an exception in the HTTP response, and can handle it.
                let error = {
                    code: exception.response.statusCode,
                    url: process.env.DATA_FOUNTAIN_URL,
                    data: exception.response.data
                };

                console.log(`\r\n\tThere was a problem connecting to OceansMap.\r\n\tOceansMap connection responded with:\n\r\t\t ${EJSON.stringify(error)}\n\r\tMake sure the URL is correct, and that data is flowing.\r\n\tIf the problem persists, you'll need to call for help. The previous stations will be used if possible.`);

            } else if (exception.errno) {
                // We've caught a connection refused error, and can handle it.
                console.log(`\r\n\tWell this is embarrasing . . . it appears that our servers cannot be reached for some reason.  Please try again later: ${exception}`);

            } else {
                // We have no idea what the problem is, and can't even.
                console.log(`${exception}, please make sure settings are configured.`);
            }
        }
    }

    fetchStationsData() {
        console.log(`[+] Compiling a collection of data from stations`);
        try {
            // define our method constants
            const Humps = Npm.require('humps');
            const DATE = new Date();
            const DURATION = Meteor.settings.defaultDuration;
            const KNOTS_TO_MPH = 1.152;
            const METER_TO_FT = 3.28084;
            const MPS_TO_MPH = 2.2369363;

            // set the end date to today.
            let endDate = DATE.toISOString();

            // calculate a new date from the duration
            let startDate = new Date();
            startDate.setHours(startDate.getHours() - DURATION);
            startDate = startDate.toISOString();

            let stations = Stations.find({}, {fields: {dataUrl: 1, id: 1, title: 1, stationId: 1, usgs: 1}}).fetch();

            // create a place to store the results
            let dataSet = [];

            for (let station of stations) {
                let data = {};
                let headers;

                let compiledUrl = `${Meteor.settings.dataFountainUrl}${station.dataUrl}?time=${startDate}/${endDate}`;
                data.data = {};
                data.id = station.id;
                data.title = station.title;
                data.stationId = station.stationId;
                data.usgsSite = station.usgs.split(':')[1];

                /***************
                 *  OceansMap
                 ***************/
                // // make the call to get the scientific data, and block with future.
                HTTP.call('GET', compiledUrl, (error, response) => {
                    if (error || response.error) {
                        console.log(`[!] Error from OceansMap: ${error}`);
                    } else {
                        try {
                            let responseData = Humps.camelizeKeys(response.data);
                            let gageHeight = responseData.data.gageHeight;
                            let oceansMapData =  Humps.camelizeKeys(response.data);

                            oceansMapData = (!oceansMapData.data.times) ? null : oceansMapData;

                            if (oceansMapData) {
                                let times = [];

                                oceansMapData.data.times.forEach((tick) => {
                                    let time = moment(tick).seconds(0).milliseconds(0).toISOString();
                                    times.push(time);
                                });

                                function createDataObject(paramName) {
                                    // OceansMap insists on sending NaNs, which break Highcharts...
                                    if (responseData.data[paramName] && responseData.data[paramName].values) {
                                        let noNaNValue = responseData.data[paramName].values.map((obj) => {
                                            return (obj === "NaN" || isNaN(obj)) ? null : obj;
                                        });


                                        return {
                                            values: (responseData.data && responseData.data[paramName]) ? noNaNValue : null,
                                            units:  (responseData.data && responseData.data[paramName]) ? responseData.data[paramName].units[0] : null,
                                            times
                                        }
                                    } else {
                                        return {
                                            values: null,
                                            units: null,
                                            times: null
                                        };
                                    }
                                }


                                let rainfall = createDataObject('rainfall');
                                let seanettleProb = createDataObject('seanettleProb');
                                let relativeHumidity = createDataObject('relativeHumidity');

                                if (data.id) {

                                    if (responseData.data.dewPointTemperature && responseData.data.dewPointTemperature.values) {
                                        let dewPointTempValues = responseData.data.dewPointTemperature.values.map((obj) => {
                                            obj = (obj === "NaN" || isNaN(obj)) ? null : obj;
                                            return this._convertCtoF(obj);
                                        });

                                        let dewPointTemperature = {
                                            values: (responseData.data && responseData.data.dewPointTemperature) ? dewPointTempValues : null,
                                            units: "F",
                                            times
                                        };

                                        if (dewPointTemperature.values) {
                                            data.data.dewPointTemperature = dewPointTemperature;
                                        }
                                    }

                                    if (responseData.data.airTemperature && responseData.data.airTemperature.values) {
                                        let airTempValues = responseData.data.airTemperature.values.map((obj) => {
                                            obj = (obj === "NaN" || isNaN(obj)) ? null : obj;
                                            return this._convertCtoF(obj);
                                        });

                                        let airTemperature = {
                                            values: (responseData.data && responseData.data.airTemperature) ? airTempValues : null,
                                            units: "F",
                                            times
                                        };

                                        if (airTemperature.values) {
                                            data.data.airTemperature = airTemperature;
                                        }
                                    }


                                    if (responseData.data.windSpeed && responseData.data.windSpeed.values) {
                                        let windSpeedValues = responseData.data.windSpeed.values.map((obj) => {
                                            obj = (obj === "NaN" || isNaN(obj)) ? null : obj;
                                            return this._convertKnotToMph(obj);
                                        });

                                        let windSpeed = {
                                            values: (responseData.data && responseData.data.windSpeed) ? windSpeedValues : null,
                                            units: "mph",
                                            times
                                        };

                                        if (windSpeed.values) {
                                            data.data.windSpeed = windSpeed;
                                        }
                                    }

                                    let rainFall = createDataObject('rainfall');
                                    let dissolvedOxygen = createDataObject('massConcentrationOfOxygenInSeaWater');
                                    let ph = createDataObject('ph');
                                    let seaWaterSalinity = createDataObject('seaWaterSalinity');
                                    let seaWaterTemperature = createDataObject('seaWaterTemperature');
                                    let turbidity = createDataObject('simpleTurbidity');
                                    let windDirection = createDataObject('windFromDirection');
                                    let airPressure = createDataObject('airPressure');

                                    if (windDirection.values) {
                                        data.data.windDirection = windDirection;
                                    }


                                    if (ph.values) {
                                        data.data.ph = ph;
                                    }

                                    if (seaWaterTemperature.values) {
                                        data.data.seaWaterTemperature = seaWaterTemperature;
                                    }

                                    if (turbidity.values) {
                                        data.data.turbidity = turbidity;
                                    }

                                    if (dissolvedOxygen.values) {
                                        data.data.dissolvedOxygen = dissolvedOxygen;
                                    }

                                    if (rainFall.values) {
                                        data.data.rainFall = rainFall;
                                    }

                                    if (seaWaterSalinity.values) {
                                        data.data.seaWaterSalinity = seaWaterSalinity;
                                    }

                                    if (airPressure.values) {
                                        data.data.airPressure = airPressure;
                                    }

                                }


                                if (relativeHumidity.values) {
                                    data.data.relativeHumidity = relativeHumidity;
                                }

                                if (seanettleProb.values) {
                                    data.data.seaNettleProbability = seanettleProb;
                                }

                                if (!data.data.times && times.length > 0) {
                                    data.data.times = times;
                                }

                                Data.upsert({id: data.id}, data);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });

                /***************
                 *  BuoyJS
                 ***************/
                let ndbcRootUrl = `http://www.ndbc.noaa.gov/data/realtime2/`;
                HTTP.get(`${ndbcRootUrl}${data.stationId}.ocean`, (error, response) => {
                    if (error || response.error) {
                        console.log(`[!] Error from BuoyJS ocean: ${error}`);
                    } else {
                        let currentBuoyData = Buoy.Buoy.realTime(response.content),
                            times = [],
                            oceanTempValues = [],
                            clconValues = [],
                            o2ppmValues = [],
                            turbidityValues = [],
                            salinityValues = [];

                        currentBuoyData.forEach((datum) => {
                            let time = moment(datum.date).seconds(0).milliseconds(0).toISOString();
                            times.push(time);
                            if (!isNaN(Math.max(datum.oceanTemp))) { oceanTempValues.push([time, this._convertCtoF(datum.oceanTemp)]); }
                            if (!isNaN(Math.max(datum.chlorophyllConcentration))) { clconValues.push([time, datum.chlorophyllConcentration]); }
                            if (!isNaN(Math.max(datum.oxygenPartsPerMil))) { o2ppmValues.push([time, datum.oxygenPartsPerMil]); }
                            if (!isNaN(Math.max(datum.turbidity))) { turbidityValues.push([time, datum.turbidity]); }
                            if (!isNaN(Math.max(datum.waterSalinity))) { salinityValues.push([time, datum.waterSalinity]); }
                        });

                        // Make sure all the data is in the correct order.
                        times.sort((a,b) => {
                            return new Date(a) - new Date(b);
                        });
                        oceanTempValues.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        clconValues.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        o2ppmValues.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        turbidityValues.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        salinityValues.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });

                        // remove the timestamps now
                        oceanTempValues = oceanTempValues.map((item, index) => {
                            return item[1];
                        });
                        clconValues = clconValues.map((item, index) => {
                            return item[1];
                        });
                        o2ppmValues = o2ppmValues.map((item, index) => {
                            return item[1];
                        });
                        turbidityValues = turbidityValues.map((item, index) => {
                            return item[1];
                        });
                        salinityValues = salinityValues.map((item, index) => {
                            return item[1];
                        });

                        let oceanTemp = {
                            values: oceanTempValues || null,
                            units: 'F',
                            type: 'timeSeries',
                            times
                        };

                        let chlorophyllCon = {
                            values: clconValues || null,
                            units: '\u03BCg/L',
                            type: 'timeSeries',
                            times
                        };

                        let oxygenPartsPerMil = {
                            values: o2ppmValues || null,
                            units: 'ppm',
                            type: 'timeSeries',
                            times
                        };

                        let turbidity = {
                            values: turbidityValues || null,
                            units: 'FTU',
                            type: 'timeSeries',
                            times
                        };

                        let waterSalinity = {
                            values: salinityValues || null,
                            units: 'PSU',
                            type: 'timeSeries',
                            times
                        };

                        if (oceanTemp.values) {
                            data.data.oceanTemperature = oceanTemp;
                            data.data.oceanTemperature.times = times;
                        }

                        if (chlorophyllCon.values) {
                            data.data.chlorophyll = chlorophyllCon;
                            data.data.chlorophyll.times = times;
                        }

                        if (oxygenPartsPerMil.values) {
                            data.data.dissolvedOxygen = oxygenPartsPerMil;
                            data.data.dissolvedOxygen.times = times;
                        }

                        if (turbidity.values) {
                            data.data.turbidity = turbidity;
                            data.data.turbidity.times = times;
                        }

                        if (waterSalinity.values) {
                            data.data.salinity = waterSalinity;
                            data.data.salinity.times = times;
                        }

                        if (!data.data.times && times) {
                            data.data.times = times;
                        }
                        Data.upsert({id: data.id}, data);
                    }
                });

                /***************
                 *  BuoyJS
                 ***************/
                HTTP.get(`${ndbcRootUrl}${data.stationId}.txt`, (error, response) => {
                    if (error || response.error) {
                        console.log(`[!] Error from BuoyJS met: ${error}`);
                    } else {
                        let currentBuoyData = Buoy.Buoy.realTime(response.content),
                            times = [],
                            wdir = [],
                            wspd = [],
                            atmp = [],
                            waveHeightValues = [],
                            wtmp = [];

                        let last, curr;
                        currentBuoyData.forEach((datum) => {
                            curr = moment(datum.date).hour();
                            if (last === undefined || last-curr === 1) {
                                let time = moment(datum.date).minutes(0).seconds(0).milliseconds(0).toISOString();
                                times.push(time);
                                if (!isNaN(Math.max(datum.windDirection))) { wdir.push([time, datum.windDirection]); }
                                if (!isNaN(Math.max(datum.windSpeed))) { wspd.push([time, datum.windSpeed * MPS_TO_MPH]); }
                                if (!isNaN(Math.max(datum.airTemp))) { atmp.push([time, this._convertCtoF(datum.airTemp)]); }
                                if (!isNaN(Math.max(datum.waveHeight))) { waveHeightValues.push([time,datum.waveHeight]); }
                                if (!isNaN(Math.max(datum.waterTemp))) { wtmp.push([time, this._convertCtoF(datum.waterTemp)]); }
                            }
                            // set the time for use in the "last" calculation.
                            last = curr;
                        });

                        // Make sure all the data is in the correct order.
                        times.sort((a,b) => {
                            return new Date(a) - new Date(b);
                        });
                        wdir.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        wspd.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        atmp.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        waveHeightValues.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });
                        wtmp.sort((a,b) => {
                            return new Date(a[0]) - new Date(b[0]);
                        });

                        // remove the timestamps now
                        wdir = wdir.map((item, index) => {
                            return item[1];
                        });
                        wspd = wspd.map((item, index) => {
                            return item[1];
                        });
                        atmp = atmp.map((item, index) => {
                            return item[1];
                        });
                        waveHeightValues = waveHeightValues.map((item, index) => {
                            return item[1];
                        });
                        wtmp = wtmp.map((item, index) => {
                            return item[1];
                        });

                        let windDirection = {
                            values: wdir,
                            units: 'deg',
                            type: 'timeSeries',
                            times
                        };

                        let windSpeed = {
                            values: wspd,
                            units: 'mph',
                            type: 'timeSeries',
                            times
                        };

                        let airTemp = {
                            values: atmp,
                            units: 'F',
                            type: 'timeSeries',
                            times
                        };

                        let waterTemp = {
                            values: wtmp,
                            units: 'F',
                            type: 'timeSeries',
                            times
                        };

                        let waveHeight = {
                            values: waveHeightValues,
                            units: 'm',
                            type: 'timeSeries',
                            times
                        };

                        if (windDirection.values) {
                            data.data.windDirection = windDirection;
                            data.data.windDirection.times = times;
                        }

                        if (windSpeed.values) {
                            data.data.windSpeed = windSpeed;
                            data.data.windSpeed.times = times;
                        }

                        if (airTemp.values) {
                            data.data.airTemperature = airTemp;
                            data.data.airTemperature.times = times;
                        }

                        if (waveHeight.values) {
                            data.data.waveHeight = waveHeight;
                            data.data.waveHeight.times = times;
                        }

                        if (waterTemp.values) {
                            data.data.waterTemperature = waterTemp;
                            data.data.waterTemperature.times = times;
                        }

                        if (!data.data.times && times) {
                            data.data.times = times;
                        }
                        Data.upsert({id: data.id}, data);
                    }
                });

                /*************
                 * USGS
                 * **********/
                let usgsPortalUrl = 'http://usgs-portal.herokuapp.com/';

                HTTP.get(`${usgsPortalUrl}${data.usgsSite}?startDT=${startDate}&endDT=${endDate}`, (error, response) => {
                    if (error || response.error) {
                        console.log(`[!] Error from USGS: ${error}`);
                    } else {
                        try {
                            let usgsBuoyData = JSON.parse(response.content),
                                gageHeight = [],
                                times = [];

                            usgsBuoyData.data.forEach((datum) => {
                                if (moment(datum.utc).minute() === 0) {
                                    if (datum['69564_00065']) {
                                        gageHeight.push(parseFloat(datum['69564_00065']));
                                        times.push(datum['utc']);
                                    }
                                }
                            });

                            times.sort((a,b) => {
                                return new Date(a) - new Date(b);
                            });

                            let waterLevel = {
                                type: 'timeSeries',
                                units: 'ft',
                                values: gageHeight,
                                times
                            }

                            if (gageHeight.length > 0) {
                                data.data.waterLevel = waterLevel;
                                Data.upsert({id: data.id}, data);
                            }
                        } catch(exception) {
                            console.log(exception);
                        }
                    }
                });

            }
            console.log(`[+] Station Data compilations complete.`);
            return;
            // when the future is ready, return the data.
        } catch(exception) {
            //debugger;
            console.log(exception);
            return exception;
        }
    }

    fetchWeatherForecast() {
        try {
            /***************
             *  Forecast.io
             ***************/
            // These are server settings, and should be configured via the user profile.
            const FORECAST_API = process.env.FORECAST_API || Meteor.settings.forecastIoApi;
            const DURATION = Meteor.settings.defaultDuration;
            const COORD = [process.env.FORECAST_COORD_LAT, process.env.FORECAST_COORD_LON] || [Meteor.settings.forecastIoCoord[0], Meteor.settings.forecastIoCoord[1]];
            let referenceStation = Stations.findOne({isPrimary: true}, {fields: {'title': 1, 'lon': 1, 'lat': 1, 'stationId': 1}});
            if (referenceStation) {
                let referenceStationData = Data.findOne({stationId: referenceStation.stationId}, {fields: {'data.times': 1}});
                let timeSet = referenceStationData.data.times;
                let weather = Weather.find({}).fetch();

                let removeCount = Weather.remove({});
                let TEMPTimeSet = timeSet.splice(timeSet.length - 55, timeSet.length - 1);
                for (let i=0; i < TEMPTimeSet.length -1; i++) {
                    let unixTime = moment(TEMPTimeSet[i]).unix();
                    let url = `https://api.forecast.io/forecast/${FORECAST_API}/${referenceStation.lat},${referenceStation.lon},${unixTime}`;
                    HTTP.get(url, (error, response) => {
                        if (error) {
                            console.log(`fetchWeatherForecast ${error}`);
                        } else {
                            Weather.insert(response.data);
                        }
                    });
                }
            }
        } catch (exception) {
            console.log('There was an error, trying again in 10 seconds');
            console.log(exception);
            Meteor.setTimeout(() => {
                this.fetchWeatherForecast();
            }, 10000);
        }
    }
}
