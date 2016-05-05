Package.describe({
  name: "buoy-map",
  summary: "This package creates a map, legend, and displays an image of the buoy.",
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
  api.use('tinytest@1.0.0');
  api.addFiles('test/buoy-map.js', 'server');
});
