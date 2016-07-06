## Data-Fountain
Data-Fountain is project funded by an educational grant and it's aim is to represent meteorological (MET) and oceanographic (Ocean) data from buoys and weather stations in a way that is easy to interpret by middle and high school students.

The site will collect and store, at regular intervals, MET and Ocean data.  This data will be represented by various graphs and icons and put on display via Television screens located around the school through a Google Chrome HDMI streaming video adapter.


<b>OCEAN Data Source</b>
Oceanographic data will be provided by NDBC stations, harvested at ASA. Data Access will be provided via Oceansmap.

<b>MET (METAR for weather) Source</b>
For the Chesapeake area there is one METAR station available (KTGI), this will provide meteorological data (weather conditions, windspeed, direction) for station and weather icons in the banner. Data Access will be provided via Oceansmap.

<b>TIDAL Data source</b>
Tidal data will be provided by USGS stations, harvested at ASA. Data Access will be provided via Oceansmap.

<b>Lunar Data Source</b>
* Suncalc for moon illumination

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
