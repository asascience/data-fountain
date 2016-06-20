/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Login.events({
    'submit form'(e, template) {
        e.preventDefault();
        let data = {
            email: $('input[type="email"]').val(),
            password: $('input[type="password"]').val()
        };

        Meteor.loginWithPassword(data.email.toLowerCase(), data.password, (err) => {
            if (err) {
                swal('Nope!', 'That was not the right login', 'warning');
                return;
            }
            if (Router.current().route.name === 'login') {
                console.log('test');
               Router.render('/admin');
            }
            setTimeout(function() {
                Router.go('/admin');
            }, 500);
        });
    }
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({
});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.onCreated(function () {
});

Template.Login.onRendered(function () {
});

Template.Login.onDestroyed(function () {
});
