Router.onBeforeAction(function() {
    if (!Meteor.userId() && !Meteor.loggingIn()) {
        this.render('Login');
    } else {
        this.next();
    }
}, {except: ['Recover', 'Register']});

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

