Package.describe({
  name: "met-icons",
  summary: "Supplied with meteorological data, this package will create several icons.",
  version: "0.0.1",
  git: "https://github.com/<username>/met-icons.git",
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

  api.addFiles('lib/met-icons.js', ['client', 'server']);
  api.addFiles('client/met-icons.js', 'client');
  api.addFiles('server/met-icons.js', 'server');

  api.export('MetIcons');
});

Package.onTest(function(api) {
  api.use('met-icons');
  api.use('ecmascript');
  api.use('tinytest@1.0.0');
  api.addFiles('test/met-icons.js', 'server');
});
