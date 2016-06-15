/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/
const Future = Npm.require('fibers/future');

Meteor.methods({
    getCommentsWithFuture: function() {
        // Create our future instance.
        var future = new Future();

        HTTP.get( 'http://dev.oceansmap.com/data-fountain/api/data/df-01?time=2016-05-15T09%3A00%3A00%2B00%3A00%2F2016-05-17T09%3A00%3A00%2B00%3A00', {}, function( error, response ) {

            if ( error ) {
                future.return( error );
            } else {
                future.return( response );
            }
        });

        return future.wait();
    },

    getiteration: function(url) {

        check(url, String);

        console.log(url);

        return url;
    },
    getStationsList: function( ) {
        // Create our future instance.
        var future = new Future();

        HTTP.get( 'http://dev.oceansmap.com/data-fountain/api/station_list', {}, function( error, response ) {

            if ( error ) {
                future.return( error );
            } else {
                future.return( response );
            }
        });

        return future.wait();
    },
    getConfig: function() {
        // TODO: Set all these to ||
        return {
            defaultDuration: Meteor.settings.defaultDuration
        }
    }
});

