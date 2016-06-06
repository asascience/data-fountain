Package.describe({
  name: "met-icons",
  summary: "What this does",
  version: "0.0.1",
  git: "https://github.com/<username>/met-icons.git",
});

Npm.depends({
    'forecast': '0.2.1'
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
