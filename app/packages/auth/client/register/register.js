import swal from 'sweetalert';
/*****************************************************************************/
/* Register: Event Handlers */
/*****************************************************************************/
Template.Register.events({
    'submit form'(e) {
        e.preventDefault();

        let name = $('[name="name"]').val(),
            email = $('[name="email"]').val(),
            password = $('[name="password"]').val();

        Accounts.createUser({
            email: email,
            password: password,
            profile: {
                name,
                primaryStation: null,
                proximityStations: [],
                dataDuration: 48,
                refreshInterval: 2,
                temperatureUnit: null,
                infoTickerText: null,
                timeZone: null,
                topPlotDataParameter: null,
                bottomPlotDataParameter: null,
                dataStart: null,
                dataEnd: null,
                parameterAlerts: {
                    lowAlert: null,
                    midAlert: null,
                    highAlert: null,
                    unit: null
                }
            },
        }, (err) => {
            if (err) {
                console.log(err);
            } else {
                $('.spinner').css('opacity', 1);
                $('.loginscreen').css('opacity', 0);
                Router.go('/admin');
            }
        });
    }
});

/*****************************************************************************/
/* Register: Helpers */
/*****************************************************************************/
Template.Register.helpers({
});

/*****************************************************************************/
/* Register: Lifecycle Hooks */
/*****************************************************************************/
Template.Register.onCreated(function () {
});

Template.Register.onRendered(function () {
});

Template.Register.onDestroyed(function () {
});
