Router.onBeforeAction(function() {
    if (!Meteor.userId() && !Meteor.loggingIn()) {
        this.render('Login');
        this.stop();
    } else {
        this.next();
    }
}, {except: ['Recover', 'Register', 'Home']});

Router.route('/login', {
  name: 'Login',
  where: 'client'
});

Router.route('/register', {
  name: 'Register',
  where: 'client'
});

Router.route('/recover', {
  name: 'Recover',
  where: 'client'
});

