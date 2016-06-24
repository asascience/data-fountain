import swal from 'sweetalert';
/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Settings.events({
    'submit form'(e, template) {
        e.preventDefault();
        let data = {
            email: $('input[type="email"]').val(),
            password: $('input[type="password"]').val()
        };

        Meteor.loginWithPassword(data.email.toLowerCase(), data.password, (err) => {
            if (err) {
                swal('Sorry!', 'That was not the right login', 'warning');
                return;
            } else {
                if (Router.current().route.name === 'Settings') {
                    Router.render('/admin');
                }
            }
            // setTimeout(function() {
            //     Router.go('/admin');
            // }, 500);
        });
    }
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Settings.helpers({
});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Settings.onCreated(function () {
});

Template.Settings.onRendered(function () {
});

Template.Settings.onDestroyed(function () {
});
