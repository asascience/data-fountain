Package.describe({
  name: "ocean-plots",
  summary: "Provided data, this package will display a list of configurable plots.",
  version: "0.0.1",
  git: "https://github.com/<username>/ocean-plots.git",
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

  api.addFiles('lib/ocean-plots.js', ['client', 'server']);
  api.addFiles('client/ocean-plots.js', 'client');
  api.addFiles('server/ocean-plots.js', 'server');

  api.export('OceanPlots');
});

Package.onTest(function(api) {
  api.use('ocean-plots');
  api.use('ecmascript');
  api.use('tinytest@1.0.0');
  api.addFiles('test/ocean-plots.js', 'server');
});
