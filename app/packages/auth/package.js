Package.describe({
  name: "auth",
  summary: "What this does",
  version: "0.0.1",
  git: "https://github.com/<username>/auth.git",
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

  api.mainModule('server/auth.js', 'server');
  api.mainModule('client/auth.js', 'client');

  api.addFiles('client/login/login.html', 'client');
  api.addFiles('client/login/login.js', 'client');
  api.addFiles('client/login/login.css', 'client');
  api.addFiles('client/register/register.html', 'client');
  api.addFiles('client/register/register.js', 'client');
  api.addFiles('client/register/register.css', 'client');
  api.addFiles('client/recover/recover.html', 'client');
  api.addFiles('client/recover/recover.js', 'client');
  api.addFiles('client/recover/recover.css', 'client');
  api.addFiles('lib/auth.js', ['client', 'server']);

  api.export('Auth');
});

Package.onTest(function(api) {
  api.use('auth');
  api.use('ecmascript');
  api.use('sanjo:jasmine@1.0.0');
  api.use('velocity:html-reporter@0.10.0');
  api.addFiles('tests/server/auth.js', 'server');
  api.addFiles('tests/client/auth.js', 'client');
});
