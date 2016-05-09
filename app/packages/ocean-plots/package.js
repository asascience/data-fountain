Package.describe({
  name: "ocean-plots",
  summary: "What this does",
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
  api.use('sanjo:jasmine@1.0.0');
  api.use('velocity:html-reporter@0.10.0');
  api.addFiles('tests/server/ocean-plots.js', 'server');
  api.addFiles('tests/client/ocean-plots.js', 'client');
});
