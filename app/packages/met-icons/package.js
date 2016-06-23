Package.describe({
  name: "met-icons",
  summary: "Provides a header for data-fountain containing meteorological icons.",
  version: "0.0.1",
  git: "https://github.com/maka-io/met-icons.git",
});

Npm.depends({
    'suncalc': '1.7.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2');

  api.use(['ecmascript', 'templating']);
  api.use('modules');

  var packages = [
    'iron:router',
    'russ:weather-icons'
  ];

  api.use(packages);
  api.imply(packages);

  api.mainModule('server/met-icons.js', 'server');
  api.mainModule('client/met-icons.js', 'client');

  api.addFiles('client/component/met-icons.html', 'client');
  api.addFiles('client/component/met-icons.js', 'client');
  api.addFiles('client/component/met-icons.css', 'client');
  api.addFiles('lib/met-icons.js', ['client', 'server']);

  api.addFiles([
      'client/component/weather-icons/css/weather-icons-wind.css',
      'client/component/weather-icons/css/weather-icons-wind.min.css',
      'client/component/weather-icons/css/weather-icons.css',
      'client/component/weather-icons/css/weather-icons.min.css',
      'client/component/skycons/skycons.js'
  ], ['client']);

  api.addAssets([
      'client/component/fonts/GemText.txt',
      'client/component/fonts/Treamd.ttf',
      'client/component/weather-icons/font/weathericons-regular-webfont.eot',
      'client/component/weather-icons/font/weathericons-regular-webfont.svg',
      'client/component/weather-icons/font/weathericons-regular-webfont.ttf',
      'client/component/weather-icons/font/weathericons-regular-webfont.woff',
      'client/component/weather-icons/font/weathericons-regular-webfont.woff2',
  ], ['client']);

  api.export('MetIcons');
});

Package.onTest(function(api) {
  api.use('met-icons');
  api.use('ecmascript');
  api.use('sanjo:jasmine@1.0.0');
  api.use('velocity:html-reporter@0.10.0');
  api.addFiles('tests/server/met-icons.js', 'server');
  api.addFiles('tests/client/met-icons.js', 'client');
});
