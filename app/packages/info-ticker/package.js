Package.describe({
  name: "info-ticker",
  summary: "What this does",
  version: "0.0.1",
  git: "https://github.com/<username>/info-ticker.git",
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

  api.addFiles('lib/info-ticker.js', ['client', 'server']);
  api.addFiles('client/info-ticker.js', 'client');
  api.addFiles('server/info-ticker.js', 'server');

  api.export('InfoTicker');
});

Package.onTest(function(api) {
  api.use('info-ticker');
  api.use('ecmascript');
  api.use('sanjo:jasmine@1.0.0');
  api.use('velocity:html-reporter@0.10.0');
  api.addFiles('tests/server/info-ticker.js', 'server');
  api.addFiles('tests/client/info-ticker.js', 'client');
});
