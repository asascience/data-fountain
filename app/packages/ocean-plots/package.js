Package.describe({
  name: "ocean-plots",
  summary: "Draws plots on the page.",
  version: "0.0.1",
  git: "https://github.com/<username>/ocean-plots.git",
});

Npm.depends({
    'highcharts': '4.2.5'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2');

  api.use(['ecmascript', 'templating']);
  api.use('modules');

  var packages = [
    'iron:router'
  ];

  api.use(packages);
  api.imply(packages);

  api.mainModule('server/ocean-plots.js', 'server');
  api.mainModule('client/ocean-plots.js', 'client');

  api.addFiles('lib/ocean-plots.js', ['client', 'server']);

  api.addFiles([
      'client/ocean-plots.js',
      'client/component/ocean-plots.css',
      'client/component/ocean-plots.html',
      'client/component/ocean-plots.js',
  ], ['client']);

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
