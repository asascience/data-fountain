## Data-Fountain
Data-Fountain is project funded by an educational grant and it's aim is to represent meteorological (MET) and oceanographic (Ocean) data from buoys and weather stations in a way that is easy to interpret by middle and high school students.

The site will collect and store, at regular intervals, MET and Ocean data.  This data will be represented by various graphs and icons and put on display via Television screens located around the school through a Google Chrome HDMI streaming video adapter.

### Page Outline

<b>Home page</b>, displays relevant information to the reference station, as well parameter information for selected stations

The home page can be broken down into 4 main sections, Page Header (top), footer (bottom), station outline (left), station charts (right).

<b>Page Header</b>, contains 6 pieces of meteorological information (left -> right) in weather-icons
* Lunar cycle
* Weather conditions, day and night
  * Options are [Clear, overcast, precipitation]
  * Requires interpretation of METAR weather conditions
* Air temperature (deg c)
* LOGO
* Wind direction (deg)
* Wind speed (mph)
* Timeseries plot duration, (time series chart x axis range, hours)

<b>Station Outline</b>, contains 3 main sections
* A station image
* A station legend (shows reference station, selected stations)
* A station map (shows reference station, selected stations)

<b>Station Charts</b>, displays two charts, that can be configured in either of two ways (sync/ separate)
* Sync: Timeseries chart (top), panel title indicates Station title, selected parameter and selected time. * Chart (bottom) indicates values for reference and selected stations at selected time
* Separate: Timeseries chart (top), panel title indicates Station title, selected parameter and selected time. Chart (bottom) shows a time series of a selected parameter

<b>Admin page</b>, Allows an authorized user to modify the selections as follows
* Reference Date type (realtime = will update the charts as realtime become available, historic = sets a reference datetime)
* Reference Date, the selected date (disabled on realtime data type),
* Reference station (1 maximum) and selected stations (4 maximum)
* Timeseries duration (duration (hours))
* Chart update/refresh time (minutes, [6,12,15,24,30,60])
* Current Selected date/time (is show but can be set is the admin want to set the current datetime)
* Top Timeseries chart parameter (ie water level)
* Bottom Timeseries chart parameter (ie temperature)
* Chart type, (sync = selected time visible in Top timeseries chart, shows the value for the selected datetime across the reference and  selected stations, separate = shows a separate time series plot of a selected parameter
* Scrolling text
* Scrolling text speed (s)


### Station List

A list of available stations in the region of interest (Chesapeake Bay).

* Susquehanna
* Patapsco
* Annapolis
* Upper Potomac
* Gooses Reef
* Potomac
* Stingray Point
* Jamestown
* Norfolk
* First Landing

#### Station output
* endpoint : `/api/station_list`
* Station output example ( i dont have the met yet, TBD)
``` json
{
	"stations": [
	{
		"data_url": "/api/data/df-01",
		"id": "df-01",
		"image_url": "/api/image/df-01",
		"lat": 39.544,
		"lon": -76.075,
		"met": "KTGI",
		"ndbc": "data.oceansmap.com:urn:ioos:station:wmo:44057",
		"title": "Susquehanna",
		"usgs": "data.oceansmap.com:01580620"
	},
	...
```

### Data Fountain Data Sources

<b>OCEAN Data Source</b>
Oceanographic data will be provided by NDBC stations, harvested at ASA. Data Access will be provided via Oceansmap.

<b>MET (METAR for weather) Source</b>
For the Chesapeake area there is one METAR station available (KTGI), this will provide meteorological data (weather conditions, windspeed, direction) for station and weather icons in the banner. Data Access will be provided via Oceansmap.

<b>TIDAL Data source</b>
Tidal data will be provided by USGS stations, harvested at ASA. Data Access will be provided via Oceansmap.

<b>Lunar Data Source</b>
* Suncalc for moon illumination
```
  https://github.com/mourner/suncalc
  SunCalc.getMoonIllumination(/*Date*/ timeAndDate)
  Lunar Phase 0 to 1
```

--

## Developer Section
### Getting started
### Install Node
https://nodejs.org/en/download/

### Install Meteor
https://www.meteor.com/install

### Do Meteor Tutorial
https://www.meteor.com/tutorials/blaze/creating-an-app

---

### Install Maka-cli 
[Maka-cli Documentation](https://www.npmjs.com/package/maka-cli)
```
	$ npm install -g maka-cli
```

---

Navigate to cloned repo.

Initialize any npm dependencies:
```sh
	$ maka npm install
```

Start the app by issuing the following command at the root:

```
	$ maka
```

Get maka help
```
	$ maka help
```

### Directory Structure, Generators and Deployment

[Maka CLI](https://www.npmjs.com/package/maka-cli)

---

### JavaScript Coding Styles

- Write [standard](http://npm.im/standard) JavaScript style.
- Files should NOT end with new line, because we want to match Google’s styles.
- File names should be concatenated with - instead of _ , e.g. file-name.js rather than file_name.js, because in [github/atom](https://github.com/github/atom) module names are usually in the module-name form.
- Use newer ES6 syntax where appropriate
	- const for requires and other constants
	- let for defining variables
	- [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) instead of function () { }
	- [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) instead of string concatenation using +
	
### Reference the official guide
http://guide.meteor.com/code-style.html

### Reference the docs
http://docs.meteor.com/#/full/
