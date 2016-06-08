Package.describe({
  name: "info-ticker",
  summary: "Marquee that scrolls text at the bottom of the screen.",
  version: "0.0.1",
  git: "https://github.com/<username>/info-ticker.git",
});

//Npm.depends({});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2');

  api.use(['ecmascript', 'templating']);
  api.use('modules');

  var packages = [
    'iron:router'
  ];

  api.use(packages);
  api.imply(packages);

  api.mainModule('server/info-ticker.js', 'server');
  api.mainModule('client/info-ticker.js', 'client');

  api.addFiles('lib/info-ticker.js', ['client', 'server']);

  api.addFiles([
      'client/component/info-ticker.css',
      'client/component/info-ticker.html',
      'client/component/info-ticker.js',
  ], ['client']);

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
