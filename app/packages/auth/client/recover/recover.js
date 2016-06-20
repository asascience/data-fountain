import swal from 'sweetalert';
/*****************************************************************************/
/* ForgotPassword: Event Handlers */
/*****************************************************************************/
Template.Recover.events({
    'submit form'(e, template) {
        e.preventDefault();
        let email = $('input[type="email"]').val();
        try {
            Accounts.forgotPassword({email: email}, (err) => {
                if(err) {
                    swal('Not found!', 'Sorry, we could not find a user by that email.', 'warning');
                } else {
                    swal('Email Sent!', 'An email has been sent for you to reset your password', 'success');
                    Router.go('/');
                }
            });
        } catch(e) {
            swal('Whoops!','You need to provide an email','warning');
        }
    }
});

/*****************************************************************************/
/* Recover: Helpers */
/*****************************************************************************/
Template.Recover.helpers({
});

/*****************************************************************************/
/* Recover: Lifecycle Hooks */
/*****************************************************************************/
Template.Recover.onCreated(function () {
});

Template.Recover.onRendered(function () {
});

Template.Recover.onDestroyed(function () {
});
