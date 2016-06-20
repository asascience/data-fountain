Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});


Router.route('/', {
  name: 'Home',
  controller: 'HomeController',
  where: 'client'
});


Router.route('/admin', {
  name: 'admin',
  controller: 'AdminController',
  where: 'client'
});
