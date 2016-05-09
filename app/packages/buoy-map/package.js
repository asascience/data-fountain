Package.describe({
  name: "buoy-map",
  summary: "What this does",
  version: "0.0.1",
  git: "https://github.com/<username>/buoy-map.git",
});

//Npm.depends({});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2');

  api.use('ecmascript');

  var packages = [
    'iron:router'
  ];

  api.use(packages);
  api.imply(packages);

  api.addFiles('lib/buoy-map.js', ['client', 'server']);
  api.addFiles('client/buoy-map.js', 'client');
  api.addFiles('server/buoy-map.js', 'server');

  api.export('BuoyMap');
});

Package.onTest(function(api) {
  api.use('buoy-map');
  api.use('ecmascript');
  api.use('sanjo:jasmine@1.0.0');
  api.use('velocity:html-reporter@0.10.0');
  api.addFiles('tests/server/buoy-map.js', 'server');
  api.addFiles('tests/client/buoy-map.js', 'client');
});
